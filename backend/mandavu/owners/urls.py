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
]