from rest_framework import serializers
from .models import *
from users.serializers import CustomUserSerializer



class ChatroomSerializer(serializers.ModelSerializer):
    user1 = CustomUserSerializer(read_only=True)
    user2 = CustomUserSerializer(read_only=True)
    user1_venue = serializers.SerializerMethodField()
    user2_venue = serializers.SerializerMethodField()
    unread_messages_count = serializers.SerializerMethodField()
    unread_count_user1 = serializers.SerializerMethodField()
    unread_count_user2 = serializers.SerializerMethodField()

    class Meta:
        model = ChatRooms
        fields = ['id', 'user1', 'user2', 'user1_venue', 'user2_venue', 'unread_count_user1', 'unread_count_user2', 'last_message_timestamp', 'unread_messages_count']
    

    # Returns the venue name if user1 is an owner and has a venue.
    def get_user1_venue(self, obj):
        if hasattr(obj.user1, 'owner') and hasattr(obj.user1.owner, 'venue'):
            return obj.user1.owner.venue.convention_center_name
        return None

    
    # Returns the venue name if user2 is an owner and has a venue
    def get_user2_venue(self, obj):
        if hasattr(obj.user2, 'owner') and hasattr(obj.user2.owner, 'venue'):
            return obj.user2.owner.venue.convention_center_name
        return None
    
    
    # Returns the count of unread messages for the current user
    def get_unread_messages_count(self, obj):
        user = self.context.get('user') 
        if not user:
            return 0  
        return obj.message.filter(seen=False).exclude(user=user).count()
    
     
    # Returns the unread message count for user1 if they are the logged-in user.
    def get_unread_count_user1(self, obj):
        user = self.context.get('user')
        if user  == obj.user1.id:
            return obj.message.filter(seen=False).exclude(user=obj.user1).count()
        return obj.unread_count_user1


    # Returns the unread message count for user2 if they are the logged-in user
    def get_unread_count_user2(self, obj):
        user = self.context.get('user')
        if user == obj.user2.id:
            return obj.message.filter(seen=False).exclude(user=obj.user2).count()
        return obj.unread_count_user2
    


class MessageSerializer(serializers.ModelSerializer):
    chat_room = ChatroomSerializer(read_only=True)

    class Meta:
        model = Messages
        fields = ['id','chat_room','user','content','timestamp','seen' ]