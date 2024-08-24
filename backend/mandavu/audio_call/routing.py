from django.urls import re_path
from .consumers import AudioCallConsumer

audio_call_urlpatterns = [
    re_path(r'ws/audio_call/(?P<room_name>\w+)/$', AudioCallConsumer.as_asgi()),
]