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
]