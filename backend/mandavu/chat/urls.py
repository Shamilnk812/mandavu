from django.urls import path
from .views import *

urlpatterns = [
    path('user_messages/<int:user_id1>/<int:user_id2>/',MessageListView.as_view(),name='user_messages'),
    path('add_chat_rooms/',AddChatRoomView.as_view(),name='add_chat_rooms'),
    path('chat_users/<int:user_id>/',ListChatUsersView.as_view(),name='chat_users'),
    path('create_meeting/',CreateMeetingView.as_view(),name='create_meeting'),
]


