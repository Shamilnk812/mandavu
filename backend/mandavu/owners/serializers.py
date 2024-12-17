from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import smart_bytes,force_str
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from .utils import send_owner_password_reset_email

from .models import *
from django.contrib.auth import authenticate


from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut,GeocoderServiceError

from django.conf import settings
import googlemaps
import json
from users.models import Booking


from opencage.geocoder import OpenCageGeocode
from rest_framework.exceptions import ValidationError

class OwnerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=60, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=60, min_length=6, write_only=True)

    class Meta:
        model = Owner
        fields = ['id','first_name', 'last_name', 'email', 'id_proof', 'phone', 'phone2' ,'password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password', '')
        password2 = attrs.get('password2', '')
        if password != password2:
            raise serializers.ValidationError('Passwords do not match')
        return attrs

    def create(self, validated_data):
        owner = Owner.objects.create_user(
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            phone=validated_data.get('phone'),
            phone2=validated_data.get('phone2'),
            id_proof=validated_data.get('id_proof'),
            password=validated_data.get('password'),
            is_owner = True
        )        
        return owner
       




class OwnerLoginSerializer(serializers.ModelSerializer) :
    email = serializers.CharField(max_length=225)
    password= serializers.CharField(max_length=60, write_only=True)
    access_token = serializers.CharField(max_length=225, read_only=True)
    refresh_token = serializers.CharField(max_length=225, read_only=True)
    venue_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Owner
        fields = ['email', 'password', 'access_token', 'refresh_token', 'venue_id']
        
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        try :
            owner = Owner.objects.get(email=email)
        except Owner.DoesNotExist :
            raise AuthenticationFailed("Invalid credentials. Please try again!")    
        
        if not owner.is_owner :
            raise AuthenticationFailed("You not a venue user")
        if not owner.is_active :
            raise AuthenticationFailed("Your Account is blocked")
        if not owner.is_verified :
            raise AuthenticationFailed(" Your Acooutn is not verified")
        
        owner = authenticate(request, email=email, password=password)

        if not owner :
            raise AuthenticationFailed("Invalid credentials, try again")
       
        venue = Venue.objects.filter(owner=owner).first()
        if not venue:
            raise AuthenticationFailed("No venue associated with this owner.")

        # Check if the venue is verified
        if not venue.is_verified:
           raise AuthenticationFailed("Your venue is not approved yet. You will receive an email when it is approved.")
        
        owner_token = owner.token()
       
        print(owner.id)
        attrs.pop('password', None)
        attrs['owner_id'] = owner.id    
        attrs['email'] = owner.email   
        attrs['access_token'] = str(owner_token.get('access'))
        attrs['refresh_token'] = str(owner_token.get('refresh'))
        attrs['venue_id'] = venue.id
        return attrs
  

        

class LogoutOwnerSerializer(serializers.Serializer) :
    refresh_token = serializers.CharField()
    default_error_messages ={
        'bad_token':('Token is invalid or has expired')
    }

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs
    
    def save(self, **kwargs):
        try :
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError :
            # return self.fail('bad_token')
            raise serializers.ValidationError({'refresh_token': 'Token is invalid or has expired'})

        

class OwnerDetailsSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Owner
        fields = '__all__'


class UpdateOwnerSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Owner
        fields = ['first_name', 'last_name', 'phone', 'phone2']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.phone2 = validated_data.get('phone2', instance.phone2)
        instance.save()
        return  instance




#============== PASSWORD RESET ============

class OwnerPasswordResetSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=225)

    class Meta:
        model = Owner
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if Owner.objects.filter(email=email).exists():
            owner = Owner.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(owner.id))
            token = PasswordResetTokenGenerator().make_token(owner)
            request = self.context.get('request')
            site_domain = get_current_site(request).domain
            relative_link = reverse('owner-password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            abslink = f"http://{site_domain}{relative_link}"
            email_body = f"Hi, use the link below to reset your password: {abslink}"
            data = {
                'email_body': email_body,
                'email_subject': "Reset your Password",
                'to_email': owner.email
            }
            send_owner_password_reset_email(data)
        return super().validate(attrs)
    



class OwnerSetNewPasswordSerializer(serializers.ModelSerializer) :
    password = serializers.CharField(max_length=60, write_only=True) 
    confirm_password = serializers.CharField(max_length=60, write_only=True)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    class Meta :
        model = Owner
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        try :
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            password = attrs.get('password')
            confirm_password = attrs.get('confirm_password')

            owner_id = force_str(urlsafe_base64_decode(uidb64))
            owner = Owner.objects.get(id=owner_id)
            if not PasswordResetTokenGenerator().check_token(owner, token) :
                raise AuthenticationFailed('Reset link is invalid or has expired', 401)
            if password  != confirm_password :
                raise AuthenticationFailed('passwords do not match')
            owner.set_password(password)
            owner.save()
            return owner
        except Exception as e :
            return AuthenticationFailed("link is  invalid or has expired")


# ============= VENUE HANDLING ===========





class RegisterVenueSerializer(serializers.ModelSerializer) :
    
    class Meta:
        model = Venue
        fields = ['owner', 'convention_center_name', 'short_description' ,'description', 'dining_seat_count', 'auditorium_seat_count', 'condition', 'price', 'state', 'district', 'city', 'pincode', 'address', 'latitude', 'longitude', 'terms_and_conditions', 'venue_license']

    def create(self, validated_data):
        venue = Venue(**validated_data)
        self.geocode_address(venue)
        venue.save()
        return venue
    
    def geocode_address(self,venue):
        geocoder = OpenCageGeocode(settings.OPENCAGE_API_KEY)
        full_address = f"{venue.address}, {venue.district}, {venue.city}, {venue.state}, {venue.pincode}, {settings.BASE_COUNTRY}"
        try:
            results = geocoder.geocode(full_address)
            if results and len(results):
                location = results[0]['geometry']
                venue.latitude = location['lat']
                venue.longitude = location['lng']
                print(f"Geocoding successful: {full_address} -> ({location['lat']}, {location['lng']})")
            else:
                print(f"Geocoding failed for address: {full_address}")
                raise ValidationError(f"Geocoding failed for address: {full_address}")
        except Exception as e:
            print(f"Geocoding error for address '{full_address}': {str(e)}")
            raise ValidationError(f"Geocoding error: {str(e)}")
        

class VenueDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'




class UpdateVenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['owner', 'convention_center_name' , 'short_description', 'description', 'dining_seat_count', 'auditorium_seat_count', 'condition', 'price', 'state', 'district','city', 'pincode', 'address', 'latitude', 'longitude']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        self.geocode_address(instance)
        instance.save()
        return instance

    def geocode_address(self, venue):
        geocoder = OpenCageGeocode(settings.OPENCAGE_API_KEY)
        full_address = f"{venue.address}, {venue.district}, {venue.state}, {venue.pincode}, {settings.BASE_COUNTRY}"
        try:
            results = geocoder.geocode(full_address)
            if results and len(results):
                location = results[0]['geometry']
                venue.latitude = location['lat']
                venue.longitude = location['lng']
                print(f"Geocoding successful: {full_address} -> ({location['lat']}, {location['lng']})")
            else:
                print(f"Geocoding failed for address: {full_address}")
                raise ValidationError(f"Geocoding failed for address: {full_address}")
        except Exception as e:
            print(f"Geocoding error for address '{full_address}': {str(e)}")
            raise ValidationError(f"Geocoding error: {str(e)}")


#========================================================

class OwnerAndVenueDetailsSerializer(serializers.ModelSerializer) :
    venue = VenueDetailsSerializer(read_only=True)
    
    class Meta:
        model = Owner
        fields = '__all__'
    

#=================== FACILITIES ====================


class CreatingFacilitySerializer(serializers.ModelSerializer) :
    class Meta:
        model  = Facility
        fields = '__all__'



class AddFacilitiesSerializer(serializers.ModelSerializer) :

    class Meta:
        model  = Facility
        fields = '__all__'
        
    def validate(self, attrs):
        facility_name = attrs.get('facility')
        venue_id = attrs.get('venue')
        if Facility.objects.filter(facility=facility_name,venue=venue_id).exists() :
                raise serializers.ValidationError("This facility already exists for this venue.")
        return attrs
    
    def create(self, validated_data):
        return Facility.objects.create(**validated_data)    


class GetFacilitiesSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Facility
        fields = '__all__'


class UpdateFacilitiesSerializer(serializers.ModelSerializer) :
    
    class Meta:
        model = Facility
        fields = '__all__'
    
    def validate(self, attrs):
        facility = attrs.get('facility')
        venue_id = attrs.get('venue')

        if Facility.objects.filter(facility=facility, venue=venue_id).exclude(id=self.instance.id).exists() :
            raise serializers.ValidationError("This facility already exists for this venue.")
        return  attrs
    
    def update(self, instance, validated_data):
        instance.facility = validated_data.get('facility', instance.facility)
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        return instance
    

#===========  Banner ========

# class AddVenuePhotoSerializer(serializers.ModelSerializer) :
#     class Meta:
#         model = VenueImage
#         fields = ['venue_photo']


class BannerDetailsSerializer(serializers.ModelSerializer) :
    class Meta:
        model = VenueImage
        fields = '__all__'
        
    def get_venue_photo(self, obj):
        request = self.context.get('request')
        photo_url = obj.venue_photo.url
        return request.build_absolute_uri(photo_url)    
    

#============ VENUE PHOTOS ===========

class AddVenuePhotoSerializer(serializers.ModelSerializer) :
    class Meta:
        model = VenueImage
        fields = '__all__'

        

    
#============ EVENTS ============

class CreatingEventSerializer(serializers.ModelSerializer) :
    class Meta:
        model  = Event
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer) :
    class Meta:
        model  = Event
        fields = '__all__'
    def get_event_photo(self, obj):
        request = self.context.get('request')
        photo_url = obj.event_photo.url
        return request.build_absolute_uri(photo_url)      


class UpdateEventSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Event
        fields = '__all__'

    def validate(self, attrs):
        event = attrs.get('event_name')
        venue = attrs.get('venue')
        if Event.objects.filter(event_name=event , venue=venue).exclude(id=self.instance.id).exists() :
            raise serializers.ValidationError("This Event already exists for this venue.")
        return attrs     
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


#============ BOOKING PACKAGES ============



class BookingPackagesSerializer(serializers.ModelSerializer) :
    class Meta:
        model = BookingPackages
        fields = '__all__'


    def validate(self, attrs):
        package_name = attrs.get('package_name')
        price_for_per_hour = attrs.get('price_for_per_hour')
        venue_id = attrs.get('venue')

        if self.instance:
            if self.instance.package_name.lower() == 'regular':  
                if 'package_name' in attrs and attrs['package_name'].lower() != 'regular':
                    raise serializers.ValidationError("You can't change the package name for the 'regular' package.")
                if 'price_for_per_hour' in attrs and attrs['price_for_per_hour'].lower() != 'not allowed':
                    raise serializers.ValidationError("You can't set price per hour for the 'regular' package.")

        if self.instance:  
            if BookingPackages.objects.filter(package_name__iexact=package_name, venue=venue_id).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('This package already exists for the selected venue (case-insensitive match).')
        else: 
            if BookingPackages.objects.filter(package_name__iexact=package_name, venue=venue_id).exists():
                raise serializers.ValidationError('This package already exists for the selected venue (case-insensitive match).')

        return attrs
    

    def update(self, instance, validated_data):
        if instance.package_name.lower() == 'regular':  
            venue = instance.venue
            
            if 'price' in validated_data:
                venue.price = validated_data.get('price')
            if 'air_condition' in validated_data:
                venue.condition = validated_data.get('air_condition')    
            venue.save()  

        instance.is_verified = False
        instance.is_editable = False    
        return super().update(instance, validated_data)


#============ PACKGE TIME SLOTES ==========

class BookingPackageTimeSlotesSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeSlots
        fields = ['time_slots']

    # def get_time_slots(self, obj) :
    #     return [
    #         {
    #             "start_time": slot[0],
    #             "end_time": slot[1],
    #             "is_active": slot[2],
    #         }
    #         for slot in obj.time_slots
    #     ]

    # time_slots = serializers.SerializerMethodField()

    
# =========== booking =========


class AllBookingDetailsSerializer(serializers.ModelSerializer) :
    venue_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = '__all__'

    def get_venue_name(self, obj):
        return obj.venue.convention_center_name      


