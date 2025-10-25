from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import logging
from .models import Notification
from .serializers import NotificationSerializer

logger = logging.getLogger("mandavu")




class NotificationListView(APIView) :
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            notifications = Notification.objects.filter(user=user) .exclude(message2__type="chat_notification") .order_by('-timestamp')
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch notifications. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, *args, **kwargs):
        try:
            user = request.user
            notifications = Notification.objects.filter(user=user, is_read=False)
            notifications.update(is_read=True)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Failed to mark notifications as read. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )