from django.contrib import admin
from .models import Owner,Venue,Facility,Event,VenueImage
# Register your models here.


admin.site.register(Owner)
admin.site.register(Venue)
admin.site.register(Facility)
admin.site.register(Event)
admin.site.register(VenueImage)