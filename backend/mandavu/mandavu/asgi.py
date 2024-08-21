import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mandavu.settings')
import django 
django.setup()
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.channels_middleware import JWTwebsocketMiddleware
from chat.routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application

# Set default Django settings module

# Initialize Django ASGI application
django_asgi_app = get_asgi_application()

# Define the ASGI application
application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JWTwebsocketMiddleware(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
