from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import smart_bytes,force_str
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_password_reset_email
from rest_framework.exceptions import ValidationError
from owners.serializers import BannerDetailsSerializer,GetFacilitiesSerializer,VenueDetailsSerializer
from owners.models import Venue


class UserRegisterSerializer(serializers.ModelSerializer) :
    password  = serializers.CharField(max_length=60, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=60, min_length=6, write_only=True)

    class Meta :
        model = User
        fields = ['first_name', 'last_name', 'email', 'password' ,'password2']


    def validate(self, attrs):
        password = attrs.get('password', '')
        password2 = attrs.get('password2', '')
        if password != password2 :
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    
    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data['email'],
            password=validated_data.get('password'),
            is_user=True
        )
        return user 
    

class UserLoginSerializer(serializers.ModelSerializer) :
    email = serializers.CharField(max_length=225)
    password = serializers.CharField(max_length=60, write_only=True) 
    access_token = serializers.CharField(max_length=225, read_only=True) 
    refresh_token = serializers.CharField(max_length=225, read_only=True) 

    class Meta :
        model= User
        fields = ['id','email', 'password', 'access_token', 'refresh_token']

    def validate(self, attrs):
        email=attrs.get('email')
        password=attrs.get('password')
        request=self.context.get('request')
        user=authenticate(request, email=email, password=password)
        if not user :
            raise AuthenticationFailed("Invalid credentials try again")
        if not user.is_user :
            raise AuthenticationFailed("Your are not a enduser")
        if not user.is_active :
            raise AuthenticationFailed("Your Account is blocked")
        if not user.is_verified :
            raise AuthenticationFailed("Email not verified")
        user_token = user.token()
        print(f"User ID: {user.id}")

        attrs.pop('password', None)
        attrs['user_id'] = user.id    
        attrs['email'] = user.email   
        attrs['access_token'] = str(user_token.get('access'))
        attrs['refresh_token'] = str(user_token.get('refresh'))
          # Adding user_id to attrs
        
        return attrs


class LogoutUserSerializer(serializers.Serializer) :
    refresh_token = serializers.CharField()
    default_error_message={
        'bad_token':('Token is invalid or has expired')
    }
    def validate(self, attrs):
        self.token = attrs.get('refresh_token')

        return attrs
    
    def save(self, **kwargs) :
        try :
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError : 
            return self.fail('bad_token')
        


class UpdateUserSerializer(serializers.ModelSerializer) :

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance
    

class UserDetailsSerializer(serializers.ModelSerializer) :
    class Meta:
        model = User
        fields = '__all__'



class PasswordResetRequestSerializer(serializers.ModelSerializer) :
    email = serializers.EmailField(max_length=225)

    class Meta :
        model = User
        fields=['email']

    def validate(self, attrs):
        email= attrs.get('email')
        if User.objects.filter(email=email).explain() :
            user= User.objects.get(email=email)
            uidb64=urlsafe_base64_encode(smart_bytes(user.id))
            token=PasswordResetTokenGenerator().make_token(user)
            request=self.context.get('request')
            site_domain=get_current_site(request).domain
            relative_link= reverse('password-reset-confirm', kwargs={'uidb64':uidb64,'token':token})
            abslink=f"http://{site_domain}{relative_link}"
            email_body=f"Hi use the link below to reset your password {abslink}"
            data = {
                'email_body': email_body,
                'email_subject': "Reset your Password",
                'to_email': user.email
            }
            send_password_reset_email(data)
        return super().validate(attrs)    
      



class SetNewPasswordSerializer(serializers.ModelSerializer) :
    password = serializers.CharField(max_length=60, write_only=True) 
    confirm_password = serializers.CharField(max_length=60, write_only=True)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    class Meta :
        model = User
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        try :
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            password = attrs.get('password')
            confirm_password = attrs.get('confirm_password')

            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token) :
                raise AuthenticationFailed('Reset link is invalid or has expired', 401)
            if password  != confirm_password :
                raise AuthenticationFailed('passwords do not match')
            user.set_password(password)
            user.save()
            return user
        except Exception as e :
            return AuthenticationFailed("link is  invalid or has expired")

          

class VenuesListSerializer(serializers.ModelSerializer) :
    images = BannerDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Venue
        fields = ['id','convention_center_name', 'price', 'images']


class SingleVenueDetailsSerializer(serializers.ModelSerializer) :
    images = BannerDetailsSerializer(many=True, read_only=True)
    facilities = GetFacilitiesSerializer(many=True, read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True) 


    class Meta:
        model = Venue
        fields = ['id','convention_center_name', 'description', 'dining_seat_count', 'auditorium_seat_count', 'condition', 'price', 'address', 'latitude', 'longitude', 'images', 'facilities','owner_id']



# ============= Show Bookings ============


class ShowBookingDetailsForCalandarSerializer(serializers.ModelSerializer) :

    start = serializers.DateField(source='date')

    class Meta:
        model = Booking
        fields = ['id', 'start', 'status' ]



class ShowBookingListSerializer(serializers.ModelSerializer) :
    venue = VenueDetailsSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
    
#===========CUSTOMUSER ===========

class CustomUserSerializer(serializers.ModelSerializer) :
    class Meta:
        model = CustomUser
        fields = '__all__'