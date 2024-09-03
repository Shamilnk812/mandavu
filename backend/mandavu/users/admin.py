from django.contrib import admin
from .models import User,Booking,BookingDetails,Review

# Register your models here.

admin.site.register(User)
admin.site.register(Booking)
admin.site.register(BookingDetails)
admin.site.register(Review)
