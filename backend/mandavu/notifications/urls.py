from django.urls import path
from .views import *

urlpatterns = [
    path('notification-list/', NotificationListView.as_view(), name='notification-list'),
]