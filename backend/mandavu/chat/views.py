from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from .models import *
from .serializers import *
import traceback
from django.utils.crypto import get_random_string

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated


# Create your views here.


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id1, user_id2):
        print('uerid',user_id1)
        print('uerid',user_id2)

        if not request.user.is_authenticated:
            raise NotAuthenticated('User must be authenticated to view messages')
        try:
            chat_room = ChatRooms.objects.filter(
                Q(user1_id=user_id1, user2_id=user_id2) | Q(user1_id=user_id2, user2_id=user_id1)
            ).first()  # Use .first() to get a single instance or None

            if not chat_room :
                raise NotFound('Room not found')
            
            messages = Messages.objects.filter(chat_room=chat_room).order_by('-timestamp')
            messages.filter(seen=False).exclude(user=request.user).update(seen=True)

            
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ChatRooms.DoesNotExist:
            return Response({'detail': 'Chat room does not exist'}, status=status.HTTP_404_NOT_FOUND)



class AddChatRoomView(APIView) :
    def post(self, request):
        try:
            user_id1 = request.data.get('user_id1')
            user_id2 = request.data.get('user_id2')
            print('uesrid',user_id1)
            print('ownerrid',user_id2)


            if user_id1 == user_id2 :
                return Response({'error': 'Cannot create chat room with the same user.'}, status=status.HTTP_400_BAD_REQUEST)
            
            chat_rooms = ChatRooms.objects.filter(
                Q(user1_id=user_id1, user2_id=user_id2) | Q(user1_id=user_id2, user2_id=user_id1)

            )

            if chat_rooms.exists() :
                chat_room = chat_rooms.first()
                serializer = ChatroomSerializer(chat_room)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            else :
                chat_room = ChatRooms.objects.create(user1_id=user_id1, user2_id=user_id2)
                serializer = ChatroomSerializer(chat_room)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e :
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class ListChatUsersView(APIView) :
    def get(self, request,user_id):
        try :
            users = ChatRooms.objects.filter(Q(user1_id = user_id) | Q(user2_id = user_id))
            if not users:
                return Response({'message':'No chat rooms found '})
            serializer = ChatroomSerializer(users,many = True)
            return Response(serializer.data)
        
        except ChatRooms.DoesNotExist :
            return ChatRooms.objects.none()



class CreateMeetingView(APIView):
    def post(self, request):
        print('Request data:', request.data)
        user_id = request.data.get('userId')
        recipient_id = request.data.get('recipientId')
        print('User ID:', user_id)
        print('Recipient ID:', recipient_id)

        meeting_id = get_random_string(length=10)  # Generate a random meeting ID
        print('Generated Meeting ID:', meeting_id)

        # Save meeting ID to database or in-memory storage if needed

        return Response({'meetingId': meeting_id})