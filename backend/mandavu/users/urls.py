from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('register/',RegisterUserView.as_view(),name='register'),
    path('login/',LoginUserView.as_view(),name='login'),
    path('logout/',LogoutUserView.as_view(),name='logout'),
    path('user-details/<int:uid>/',UserDetailsView.as_view(),name='user_details'),
    path('update/<int:uid>/',UpdateUserView.as_view(),name='update'),
    path('change-password/<int:uid>/',ChangeUserPassword.as_view(),name='change-password'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token/refresh'),
    path('verify-otp/',VerifyUserOtp.as_view(),name='verify-otp'),
    path('resend-otp/',ResendUserOtp.as_view(),name='resend-otp'),
    path('password-reset-request/',PasswordResetRequestView.as_view(),name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/',PasswordResetConfirm.as_view(),name='password-reset-confirm'),
    path('set-new-password/',SetNewPassword.as_view(),name='set-new-password'),

    path('venues-list/',AllVenuesListView.as_view(),name='venues-list'),
    path('single-venue-details/<int:vid>/',SingleVenueDetailsView.as_view(),name='single-venue-details'),
    path('create-checkout-session/',CreateCheckOutSession.as_view(),name='create-checkout-session'),
    path('stripe-webhook/', strip_webhook_view, name='stripe-webhook'),

    path('booking-details/<int:vid>/',ShowBookingDetailsForCalandar.as_view(),name='booking-details'),
    path('show-booked-details/<int:uid>/',ShowBookingListView.as_view(),name='show-booked-details'),
    path('show-single-booking-details/<int:bid>/',ShowSingleBookingDetails.as_view(),name='show-single-booking-details'),
    path('cancel-booking/<int:bid>/',CancelBookingView.as_view(),name='cancel-booking'),

    path('add-review/',AddReviewView.as_view(),name='add-review'),
    path('get-ratings/<int:vid>/',ShowRatingView.as_view(),name='get-ratings'),
    path('get-reviews/<int:vid>/',GetReviewsView.as_view(),name='get-reviews')
]