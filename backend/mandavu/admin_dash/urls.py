from django.urls import path
from .views import *


urlpatterns  =[
    path('login/',AdminLoginView.as_view(),name='login'),
    path('logout/',AdminLogoutView.as_view(),name='logout'),

    path('get-all-bookings/',GetAllBookingDetailsview.as_view(),name='get-all-bookings'),
    path('get-booking-status/',GetAllBookingsStatusView.as_view(),name='get-booking-status'),
    path('get-allusers-status/',GetAllUsersCountView.as_view(),name='get-allusers-status'),
    path('get-revenue/',GetTotalRevenueView.as_view(),name='get-revenue'),
    path('user-list/',UserListView.as_view(),name='user-list'),
    path('block-user/<int:uid>/',BlockUserView.as_view(),name='block-user'),
    path('unblock-user/<int:uid>/',UnblockUserView.as_view(),name='unblock-user'),

    path('owner-list/',OwnerListView.as_view(),name='owner-list'),
    path('block-owner/<int:uid>/',BlockOwnerView.as_view(),name='block-owner'),
    path('unblock-owner/<int:uid>/',UnblockOwnerView.as_view(),name='unblock-owner'),

    path('venue-list/',VenueListView.as_view(),name='venue-list'),
    path('block-venue/<int:vid>/',BlockVenueView.as_view(),name='block-venue'),
    path('unblock-venue/<int:vid>/',UnblockVenueView.as_view(),name='unblock-venue'),
    path('verify-venue/<int:vid>/',VenueVerifyView.as_view(),name='verify-venue'),
    path('reject-venue/<int:vid>/',RejectVenueView.as_view(),name='reject-venue'),
    # path('unverify-venue/<int:vid>/',VenueUnVerifyView.as_view(),name='unverify-venue'),
    path('venue-details/<int:vid>/',VenueDetailsView.as_view(),name='venue-details'),


    path('booking-package-approval/<int:vid>/',VeneuBookingPackageApproval.as_view(),name='booking-package-approval'),
    path('booking-package-rejection/<int:vid>/',VeneuBookingPackageRejection.as_view(),name='booking-package-rejection'),

    path('get-user-inquiries/',GetUserInquiriesView.as_view(),name='get-user-inquiries'),
    path('sending-inquiry-reply/<int:inquiry_id>/',ReplyUserInquiriesView.as_view(),name='sending-inquiry-reply'),
    path('generate-sales-reports/',GenerateSalesReports.as_view(),name='generate-sales-reports'),
]