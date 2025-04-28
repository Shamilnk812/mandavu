from django.urls import re_path
from . import consumers



websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<id>\d+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/notifications/$', consumers.ChatNotificationCosumer2.as_asgi()),
    
]


  