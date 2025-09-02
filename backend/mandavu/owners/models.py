from django.db import models
from users.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from django.utils import timezone
from datetime import timedelta
import uuid


# Create your models here.


class Owner(CustomUser):
    phone = models.CharField(max_length=12, unique=True, verbose_name="Contact Phone")
    phone2 = models.CharField(max_length=12, unique=True, verbose_name="Contact Phone")
    id_proof = models.ImageField(upload_to='id_proof/', verbose_name="Id Proof")
    is_approved = models.BooleanField(default=False)
    

    def __str__(self):
        return f"{self.first_name} - {self.last_name}"

    

class OneTimePasswordForOwner(models.Model) :
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE)
    code  = models.CharField(max_length=225,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=2)

    def __str__(self) :
        return f"{self.owner.first_name}-- otp"
   

class Venue(models.Model) :
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE)
    convention_center_name = models.CharField(max_length=150, unique=True, verbose_name="Venue Name")
    short_description = models.CharField(max_length=225, verbose_name="Short Description")
    description = models.TextField(verbose_name="Venue Description")
    dining_seat_count = models.PositiveIntegerField(verbose_name="Dining Seat Count")
    auditorium_seat_count = models.PositiveIntegerField(verbose_name="Auditorium Seat Count")
    condition = models.CharField( max_length=6)
    extra_ac_price = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True) 
    price = models.IntegerField(verbose_name="Price")
    state = models.CharField(max_length=150, verbose_name="State")
    district = models.CharField(max_length=150, verbose_name="District")
    city = models.CharField(max_length=150, verbose_name="City")
    pincode = models.CharField(max_length=10, verbose_name="Pincode")
    address = models.TextField(verbose_name="Address")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="Latitude", null=True,blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="Longitude", null=True,blank=True)
    terms_and_conditions = models.FileField(upload_to='terms_conditions/', verbose_name="Terms and Conditions PDF", null=True, blank=True)
    venue_license = models.ImageField(upload_to='venue_license/', verbose_name="Venue License")
    is_verified = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    is_active  = models.BooleanField(default=True)
    is_under_maintenance = models.BooleanField(default=False)
    maintenance_start_date = models.DateField(null=True,blank=True)
    maintenance_end_date = models.DateField(null=True,blank=True)
    maintenance_reason = models.TextField(null=True, blank=True)
    blocking_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.convention_center_name

    

class Facility(models.Model):
    facility = models.TextField(verbose_name="Facility Description")
    price = models.CharField(max_length=15,default='FREE')
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='facilities')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.facility


class Event(models.Model):
    event_name = models.CharField(max_length=150, verbose_name="Event Name")
    event_photo = models.ImageField(upload_to='events/', verbose_name="Event Photo")
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='events')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.event_name
    


class BookingPackages(models.Model) :
    package_name = models.CharField(max_length=225)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_for_per_hour = models.CharField(max_length=150)
    air_condition = models.CharField(max_length=150)
    extra_price_for_aircondition = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    description = models.TextField()
    is_active = models.BooleanField(default=True) # defaul is False
    is_verified = models.BooleanField(default=False)
    is_editable = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    rejection_reason = models.TextField(null=True,blank=True)
    
    def __str__(self) :
        return self.package_name



class TimeSlots(models.Model):
    booking_package = models.ForeignKey(BookingPackages, on_delete=models.CASCADE)
    time_slots = models.JSONField(blank=True, null=True, default=list)


class VenueImage(models.Model):
    venue_photo = models.ImageField(upload_to='venue_images/', verbose_name="Venue Photo")
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='images')
    is_active = models.BooleanField(default=True)
 

    

class TempOwnerAndVenueDetails(models.Model):
    owner_details = models.JSONField(null=True,blank=True)
    venue_details = models.JSONField(null=True, blank=True)
    event_details = models.JSONField(null=True, blank=True)  
    facility_details = models.JSONField(null=True, blank=True)
    secure_token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
