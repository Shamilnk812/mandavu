from django.db import models
from users.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


# Create your models here.


class Owner(CustomUser):
    convention_center_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.first_name} - {self.convention_center_name}"

    

class OneTimePasswordForOwner(models.Model) :
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE)
    code  = models.CharField(max_length=6,unique=True)

    def __str__(self) :
        return f"{self.owner.first_name}-- otp"
   

class Venue(models.Model) :
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE)
    name = models.CharField(max_length=150, unique=True, verbose_name="Venue Name")
    email = models.EmailField(max_length=225, unique=True, verbose_name="Contact Email")
    phone = models.CharField(max_length=12, unique=True, verbose_name="Contact Phone")
    description = models.TextField(verbose_name="Venue Description")
    dining_seat_count = models.PositiveIntegerField(verbose_name="Dining Seat Count")
    auditorium_seat_count = models.PositiveIntegerField(verbose_name="Auditorium Seat Count")
    condition = models.CharField( max_length=6)
    price = models.IntegerField(verbose_name="Price")
    state = models.CharField(max_length=100, verbose_name="State")
    district = models.CharField(max_length=100, verbose_name="District")
    pincode = models.CharField(max_length=10, verbose_name="Pincode")
    address = models.TextField(verbose_name="Address")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="Latitude", null=True,blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="Longitude", null=True,blank=True)
    terms_and_conditions = models.FileField(upload_to='terms_conditions/', verbose_name="Terms and Conditions PDF", null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active  = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Facility(models.Model):
    facility = models.TextField(verbose_name="Facility Description")
    price = models.IntegerField(verbose_name="Facility Price", null=True,blank=True)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='facilities')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.facility


class Event(models.Model):
    event_name = models.CharField(max_length=115, verbose_name="Event Name")
    event_photo = models.ImageField(upload_to='events/', verbose_name="Event Photo")
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='events')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.event_name


class VenueImage(models.Model):
    venue_photo = models.ImageField(upload_to='venue_images/', verbose_name="Venue Photo")
    name = models.CharField(max_length=150)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='images')
    is_active = models.BooleanField(default=True)
 

    def __str__(self):
        return f"Image for {self.venue.name}"
