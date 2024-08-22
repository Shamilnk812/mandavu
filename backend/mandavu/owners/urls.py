from django.urls import path
from .views import *


urlpatterns = [
    # path('register/',RegisterOwnerView.as_view(),name='register'),
    path('register/',RegisterCombinedView.as_view(),name='register'),
    path('login/',LoginOwnerView.as_view(),name='login'),
    path('logout/',LogoutOwnerView.as_view(),name='logout'),
    path('owner-details/<int:uid>/',OwnerDetailsView.as_view(),name='owner-details'),
    path('update/<int:uid>/',UpdateOwnerView.as_view(),name='update'),
    path('change-password/<int:uid>/',ChangeOwnerPassword.as_view(),name='change-password'),
    path('verify-otp/',VerifyOwerOtp.as_view(),name='verify-otp'),
    path('resend-owner-otp/',ResendOwnerOtp.as_view(),name='resend-owner-otp'),
    path('owner-password-reset-request/',OwnerPasswordResetRequestView.as_view(),name='owner-password-reset-request'),
    path('owner-password-reset-confirm/<uidb64>/<token>/',OwnerPasswordResetConfirmView.as_view(),name='owner-password-reset-confirm'),
    path('owner-setnew-password/',OwnerSetNewPasswordView.as_view(),name='owner-setnew-password/'),
    # path('register-venue/',VenueRegisterView.as_view(),name='register-venue'),
    path('venue-details/<int:uid>/',VenueDetailsView.as_view(),name='venue-details'),
    path('update-venue/<int:vid>/',UpdateVenueView.as_view(),name='update-venue'),
    path('add-facility/<int:vid>/',AddFacilitiesView.as_view(),name='add-facility'),
    path('get-facility/<int:vid>/',GetFacilitiesView.as_view(),name='get-facility'),
    path('update-facility/<int:vid>/',UpdateFacilitiesView.as_view(),name='update-facility'),
    path('block-facility/<int:vid>/',BlockFacilityView.as_view(),name='block-facility'),
    path('unblock-facility/<int:vid>/',UnblockFacilityView.as_view(),name='unblock-facility'),

    path('add-venue-photo/<int:vid>/',AddVenuePhotoView.as_view(),name='add-venue-photo'),
    path('show-all-venue-photos/<int:vid>/',ShowAllVenuePhotosView.as_view(),name='show-all-venue-photos'),
    path('block-venue-photo/<int:bid>/',BlockVenuePhotoView.as_view(),name='block-venue-photo'),
    path('unblock-venue-photo/<int:bid>/',UnblockVenuePhotoView.as_view(),name='unblock-venue-photo'),
    
    path('add-event/<int:vid>/',AddEventView.as_view(),name='add-event'),
    path('get-all-events/<int:vid>/',GetAllEventsDetails.as_view(),name='get-all-events'),
    path('block-event/<int:vid>/',BlockEventView.as_view(),name='block-event'),
    path('unblock-event/<int:vid>/',UnblockEventView.as_view(),name='unblock-event'),

    path('all-booking-details/<int:vid>/',AllBookingDetailsView.as_view(),name='all-booking-details'),
    path('booking-cancelling/<int:bid>/',CancellingBookingView.as_view(),name='booking-cancelling'),
    

    path('get-owner-venue-details/<int:uid>/',OwnerAndVenueDetailsView.as_view(),name='get-owner-venue-details'),
    
]