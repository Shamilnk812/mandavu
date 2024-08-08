from django.urls import path
from .views import *


urlpatterns = [
    path('register/',RegisterOwnerView.as_view(),name='register'),
    path('login/',LoginOwnerView.as_view(),name='login'),
    path('logout/',LogoutOwnerView.as_view(),name='logout'),
    path('owner-details/<int:uid>/',OwnerDetailsView.as_view(),name='owner-details'),
    path('update/<int:uid>/',UpdateOwnerView.as_view(),name='update'),
    path('change-password/<int:uid>/',ChangeOwnerPassword.as_view(),name='change-password'),
    path('verify-otp/',VerifyOwerOtp.as_view(),name='verify-otp'),

    path('register-venue/',VenueRegisterView.as_view(),name='register-venue'),
    path('venue-details/<int:uid>/',VenueDetailsView.as_view(),name='venue-details'),
    path('update-venue/<int:vid>/',UpdateVenueView.as_view(),name='update-venue'),
    path('add-facility/<int:vid>/',AddFacilitiesView.as_view(),name='add-facility'),
    path('get-facility/<int:vid>/',GetFacilitiesView.as_view(),name='get-facility'),
    path('update-facility/<int:vid>/',UpdateFacilitiesView.as_view(),name='update-facility'),
    path('block-facility/<int:vid>/',BlockFacilityView.as_view(),name='block-facility'),
    path('unblock-facility/<int:vid>/',UnblockFacilityView.as_view(),name='unblock-facility'),

    path('add-banner/<int:vid>/',AddBannerView.as_view(),name='add-banner'),
    path('banner-details/<int:vid>/',BannerDetailsView.as_view(),name='banner-details'),
    path('block-banner/<int:bid>/',BlockBannerView.as_view(),name='block-banner'),
    path('unblock-banner/<int:bid>/',UnblockBannerView.as_view(),name='unblock-banner'),

    path('all-booking-details/<int:vid>/',AllBookingDetailsView.as_view(),name='all-booking-details'),
    path('booking-cancelling/<int:bid>/',CancellingBookingView.as_view(),name='booking-cancelling'),

    
]