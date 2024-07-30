from django.urls import path
from .views import *


urlpatterns  =[
    path('login/',AdminLoginView.as_view(),name='login'),
    path('logout/',AdminLogoutView.as_view(),name='logout'),
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
    path('unverify-venue/<int:vid>/',VenueUnVerifyView.as_view(),name='unverify-venue'),
]