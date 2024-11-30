from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(Owner)
admin.site.register(Venue)
admin.site.register(Facility)
admin.site.register(Event)
admin.site.register(VenueImage)
admin.site.register(BookingPackages)
admin.site.register(TimeSlots)