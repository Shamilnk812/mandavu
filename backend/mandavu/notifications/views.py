from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer



class NotificationListView(APIView) :

    def get(self, request, *args, **kwargs):
        user = request.user
        notifications = Notification.objects.filter(user=user) .exclude(message2__type="chat_notification") .order_by('-timestamp')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def put(self, request, *args, **kwargs):
        user = request.user
        notifications = Notification.objects.filter(user=user, is_read=False)
        notifications.update(is_read=True)
        return Response({'status': 'success'}, status=status.HTTP_200_OK)