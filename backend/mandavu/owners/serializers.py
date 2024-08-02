from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import Owner,Venue,Facility,Event
from django.contrib.auth import authenticate


from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut,GeocoderServiceError

from django.conf import settings
import googlemaps
import json

from opencage.geocoder import OpenCageGeocode
from rest_framework.exceptions import ValidationError

class OwnerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=60, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=60, min_length=6, write_only=True)

    class Meta:
        model = Owner
        fields = ['id','first_name', 'last_name', 'email', 'convention_center_name', 'password', 'password2']

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
            email=validated_data['email'],
            password=validated_data.get('password'),
            convention_center_name=validated_data['convention_center_name'],
            is_owner = True
        )        
        return owner
       




class OwnerLoginSerializer(serializers.ModelSerializer) :
    email = serializers.CharField(max_length=225)
    password= serializers.CharField(max_length=60, write_only=True)
    access_token = serializers.CharField(max_length=225, read_only=True)
    refresh_token = serializers.CharField(max_length=225, read_only=True)

    class Meta:
        model = Owner
        fields = ['email', 'password', 'access_token', 'refresh_token']
        
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        owner = authenticate(request, email=email, password=password)
        if not owner :
            raise AuthenticationFailed("Invalid credentials try again")
        if not owner.is_owner :
            raise AuthenticationFailed("You not a venue user")
        if not owner.is_active :
            raise AuthenticationFailed("Your Account is blocked")
        if not owner.is_verified :
            raise AuthenticationFailed(" Your Acooutn is not verified")
        
        owner_token = owner.token()

        # return {
        #     'owner_id': owner.id,
        #     'email':owner.email,
        #     'access_token':str(owner_token.get('access')),
        #     'refresh_token':str(owner_token.get('refresh'))
        # }
        print(owner.id)
        attrs.pop('password', None)
        attrs['owner_id'] = owner.id    
        attrs['email'] = owner.email   
        attrs['access_token'] = str(owner_token.get('access'))
        attrs['refresh_token'] = str(owner_token.get('refresh'))
        return attrs
    # def create(self, validated_data):
    #     # Do not create a new owner; instead, just return the validated data
    #     return validated_data

        

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
            return self.fail('bad_token')
        

class OwnerDetailsSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Owner
        fields = '__all__'


class UpdateOwnerSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Owner
        fields = ['first_name', 'last_name', 'email']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return  instance



# ============= VENUE HANDLING ===========


class RegisterVenueSerializer(serializers.ModelSerializer) :
    
    class Meta:
        model = Venue
        fields = ['owner', 'name', 'email', 'phone', 'description', 'dining_seat_count', 'auditorium_seat_count', 'condition', 'price', 'state', 'district', 'pincode', 'address', 'latitude', 'longitude']

    def create(self, validated_data):
        venue = Venue(**validated_data)
        self.geocode_address(venue)
        venue.save()
        return venue
    
    def geocode_address(self,venue):
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
        

class VenueDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


class UpdateVenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['owner', 'name', 'email', 'phone', 'description', 'dining_seat_count', 'auditorium_seat_count', 'condition', 'price', 'state', 'district', 'pincode', 'address', 'latitude', 'longitude']

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