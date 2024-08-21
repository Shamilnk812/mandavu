from django.db import models
from django.contrib.auth.models import AbstractBaseUser ,PermissionsMixin
from django.utils.translation import gettext_lazy as _ 
from .managers import UserManager
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta

class CustomUser(AbstractBaseUser) :
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email      = models.EmailField(max_length=225,unique=True)
    is_superuser = models.BooleanField(default=False)
    is_verified  = models.BooleanField(default=False)
    is_staff     = models.BooleanField(default=False)
    is_active    = models.BooleanField(default=True)
    is_user      = models.BooleanField(default=False)
    is_owner     = models.BooleanField(default=False)
    date_joined  = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD  ='email'
    REQUIRED_FIELDS = ['first_name','last_name']
    
    objects = UserManager()

    def has_perm(self, perm, obj = None):
        return True
    
    def has_module_perms(self,app_label):
        return True
    
    def token(self) :
        refresh = RefreshToken.for_user(self)
        return{
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        }
    


class User(CustomUser) :
    
    def __str__(self) -> str:
        return self.email



class OneTimePassword(models.Model) :
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    code = models.CharField(max_length=225,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=2)
    
    def __str__(self) :
        return f"{self.user.first_name}-OTP"
    



class Booking(models.Model):
    booking_status = (
        ('Booking Confirmed', 'Booking Confirmed'),
        ('Booking Completed', 'Booking Completed'),
        ('Booking Canceled', 'Booking Canceled')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    venue = models.ForeignKey('owners.Venue', on_delete=models.CASCADE) 
    name = models.CharField(max_length=150)
    email = models.EmailField(max_length=225)
    phone = models.CharField(max_length=12)
    additional_phone = models.CharField(max_length=12)
    city = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    address = models.TextField()
    time = models.CharField(max_length=150)
    date = models.DateField()
    condition = models.CharField(max_length=150)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booking_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=150, choices=booking_status, default='Booking Confirmed')
    cancel_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class BookingDetails(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    facilities = models.CharField(max_length=225)



