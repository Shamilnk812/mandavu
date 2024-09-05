from django.urls import re_path
from . import consumers

notification_urlpatterns = [
     re_path(r'ws/notifications/(?P<user_id>\d+)/$', consumers.NotificationConsumer.as_asgi()),
     re_path(r'ws/video_call/(?P<user_id>\d+)/$', consumers.VideoCallConsumer.as_asgi()),
]