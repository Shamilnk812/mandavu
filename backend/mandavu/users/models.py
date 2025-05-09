from django.db import models
from django.contrib.auth.models import AbstractBaseUser ,PermissionsMixin
from django.utils.translation import gettext_lazy as _ 
from .managers import UserManager
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta,date,datetime

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
    blocking_reason = models.TextField(null=True, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    is_online = models.BooleanField(default=False)
    
    
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
        # ('Booking Pending', 'Booking Pending'),
        ('Booking Confirmed', 'Booking Confirmed'),
        ('Booking Completed', 'Booking Completed'),
        ('Booking Canceled', 'Booking Canceled')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    venue = models.ForeignKey('owners.Venue', on_delete=models.CASCADE) 
    name = models.CharField(max_length=150)
    # email = models.EmailField(max_length=225)   ####
    phone = models.CharField(max_length=12)
    additional_phone = models.CharField(max_length=12) 
    city = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    address = models.TextField()
    # time = models.CharField(max_length=150)  ###
    times = models.JSONField(default=list)
    dates = models.JSONField(default=list)
    # date = models.DateField()   ######
    event_name = models.CharField(max_length=225,default="Default Event Name")
    event_details = models.TextField(blank=True, null=True)
    package_type = models.ForeignKey('owners.BookingPackages', on_delete=models.CASCADE, null=True, blank=True)
    package_name = models.CharField(max_length=225,null=True,blank=True)
    condition = models.CharField(max_length=150)
    extra_ac_price = models.DecimalField(max_digits=10, decimal_places=2 , null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booking_amount = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    status = models.CharField(max_length=150, choices=booking_status, default='Booking Confirmed')
    cancel_reason = models.TextField(blank=True, null=True)
    is_canceled_by_user = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_intent_id = models.CharField(max_length=255, blank=True, null=True)

    @property
    def is_completed(self):
        # Check if the booking is completed based on the last date in 'dates'
        if self.dates:
            date_objects = [datetime.strptime(d, '%Y-%m-%d').date() for d in self.dates]
            last_date = max(date_objects)  # Find the latest date
            return date.today() > last_date
        return False




class BookingDetails(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    facilities = models.CharField(max_length=225)


class TempBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    venue = models.ForeignKey('owners.Venue', on_delete=models.CASCADE) 
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking.venue.convention_center_name} - {self.rating} Stars"
    


class UserInquiry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=225)
    message = models.TextField()
    reply_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
   

    def __str__(self):
        return f"Inquiry from {self.user_name} ({self.email})"



