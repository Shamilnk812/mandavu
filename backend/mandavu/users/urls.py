from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('register/',RegisterUserView.as_view(),name='register'),
    path('login/',LoginUserView.as_view(),name='login'),
    path('logout/',LogoutUserView.as_view(),name='logout'),
    path('user-details/<int:uid>/',UserDetailsView.as_view(),name='user_details'),
    path('update/<int:uid>/',UpdateUserView.as_view(),name='update'),
    path('change-password/<int:uid>/',ChangeUserPassword.as_view(),name='change-password'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token/refresh'),
    path('verify-otp/',VerifyUserOtp.as_view(),name='verify-otp'),
    path('password-reset/',PasswordResetRequestView.as_view(),name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/',PasswordResetConfirm.as_view(),name='password-reset-confirm'),
    path('set-new-password/',SetNewPassword.as_view(),name='set-new-password'),
]