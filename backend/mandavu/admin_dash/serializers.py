from rest_framework import serializers
from users.models import User,Booking
from owners.models import Owner,Venue
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import PlatformFee



class AdminLoginSerializer(serializers.ModelSerializer) :
    email = serializers.CharField(max_length=225)
    password = serializers.CharField(max_length=60, write_only= True)
    access_token = serializers.CharField(max_length=225, read_only=True)
    refresh_token = serializers.CharField(max_length=225, read_only=True)

    class Meta:
        model=User
        fields= ['email', 'password', 'access_token', 'refresh_token']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        admin = authenticate(request, email=email, password=password)
        if not admin :
            raise AuthenticationFailed('Invalid credentials try again')
        if not admin.is_superuser :
            raise AuthenticationFailed('Only admin can login')
        
        admin_token = admin.token()

        return {
            'email':admin.email,
            'access_token':str(admin_token.get('access')),
            'refresh_token':str(admin_token.get('refresh'))
        }
    

class AdminLogoutSerializer(serializers.Serializer) :
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
            raise serializers.ValidationError({'refresh_token': 'Token is invalid or has expired'})



class GetAllBookingDetailsSerializer(serializers.ModelSerializer) :
    venue_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'

    def get_venue_name(self, obj):
        return obj.venue.convention_center_name    


class UserListSerializer(serializers.ModelSerializer) :
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active', 'date_joined']



class VenueDetailsSeriallizer(serializers.ModelSerializer) :
    class Meta:
        model = Venue
        fields = '__all__'


class OwnerListSerializer(serializers.ModelSerializer) :
    venue = VenueDetailsSeriallizer(read_only=True)
    class Meta:
        model = Owner
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'phone2', 'is_active', 'date_joined','venue','id_proof']


class PlatformFeeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='booking.user.first_name', read_only=True)
    venue_name = serializers.CharField(source='booking.venue.convention_center_name', read_only=True)

    class Meta:
        model = PlatformFee
        fields = ['id', 'username', 'venue_name', 'fee_collected', 'created_at']




