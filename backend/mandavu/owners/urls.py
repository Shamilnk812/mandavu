from django.urls import path
from .views import *


urlpatterns = [
    path('registration-step1/',RegistrationStep1.as_view(),name='registration-step1'),
    path('registration-step2/<str:token>/',RegistrationStep2.as_view(),name='registration-step2'),
    path('registration-step3/<str:token>/',RegistrationStep3.as_view(),name='registration-step3'),
    path('cancel-registration/<str:token>/',CancelRegistrationView.as_view(),name='cancel-registration'),
    path('register/<str:token>/',RegisterCombinedView.as_view(),name='register'),
    path('login/',LoginOwnerView.as_view(),name='login'),
    path('logout/',LogoutOwnerView.as_view(),name='logout'),
    path('get-all-revenue/',TotalRevenueView.as_view(),name='get-all-revenue'),
    path('get-booking-status/',GetBookingsStatusView.as_view(),name='get-booking-status'),
    path('owner-details/<int:uid>/',OwnerDetailsView.as_view(),name='owner-details'),
    path('update/<int:uid>/',UpdateOwnerView.as_view(),name='update'),
    path('change-password/<int:uid>/',ChangeOwnerPassword.as_view(),name='change-password'),
    path('verify-otp/',VerifyOwerOtp.as_view(),name='verify-otp'),
    path('resend-owner-otp/',ResendOwnerOtp.as_view(),name='resend-owner-otp'),
    path('owner-password-reset-request/',OwnerPasswordResetRequestView.as_view(),name='owner-password-reset-request'),
    path('owner-password-reset-confirm/<uidb64>/<token>/',OwnerPasswordResetConfirmView.as_view(),name='owner-password-reset-confirm'),
    path('owner-setnew-password/',OwnerSetNewPasswordView.as_view(),name='owner-setnew-password/'),
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
    
    path('get-all-booking-packages/<int:vid>/',GetAllBookingPackagesView.as_view(),name='get-all-booking-packages'),
    path('add-booking-package/<int:vid>/',AddBookingPackageView.as_view(),name='add-booking-package'),
    path('update-booking-package/<int:vid>/',UpdateBookingPackageView.as_view(),name='update-booking-package'),
    path('block-booking-package/<int:vid>/',BlockBookingPackageView.as_view(),name='block-booking-package'),
    path('unblock-booking-package/<int:vid>/',UnblockBookingPackagesView.as_view(),name='unblock-booking-package'),

    path('get-time-slotes/<int:vid>/',GetPackageTimeSlotes.as_view(),name='get-time-slotes'),
    path('change_time_slote_status/<int:vid>/',BlockOrUnblockBookingPackageTimeSlote.as_view(),name='change_time_slote_status'),

    path('all-booking-details/<int:vid>/',AllBookingDetailsView.as_view(),name='all-booking-details'),
    path('get-single-booking-details/<int:b_id>/',GetSingleBookingDetailsView.as_view(),name='get-single-booking-details'),
    # path('booking-cancelling/<int:bid>/',CancellingBookingView.as_view(),name='booking-cancelling'),
    path('update-booking-status/<int:b_id>/',UpdateBookingStatusview.as_view(),name='update-booking-status'),
    path('get-booked-dates/<int:vid>/', GetAllBookingSlotes.as_view(), name='get-booked-dates' ),
    path('manage-unavailable-date/<int:vid>/', ManageUnavailableDates.as_view(), name='manage-unavailable-date' ),
    

    path('get-owner-venue-details/<int:uid>/',OwnerAndVenueDetailsView.as_view(),name='get-owner-venue-details'),
    path('set-maintenance/<int:vid>/',SetVenueMaintenanceView.as_view(),name='set-maintenance'),
    path('remove-maintenance/<int:vid>/',RemoveVenueMaintenanceView.as_view(),name='remove-maintenance'),

    path('generate-sales-report/',GenerateSalesReport.as_view(),name='generate-sales-report'),
    
    
]