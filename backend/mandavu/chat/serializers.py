from rest_framework import serializers
from .models import *
from users.serializers import CustomUserSerializer



class ChatroomSerializer(serializers.ModelSerializer):
    user1 = CustomUserSerializer(read_only=True)
    user2 = CustomUserSerializer(read_only=True)
    user1_venue = serializers.SerializerMethodField()
    user2_venue = serializers.SerializerMethodField()

    class Meta:
        model = ChatRooms
        fields = ['id', 'user1', 'user2', 'user1_venue', 'user2_venue']

    def get_user1_venue(self, obj):
        """Returns the venue name if user1 is an owner and has a venue."""
        if hasattr(obj.user1, 'owner') and hasattr(obj.user1.owner, 'venue'):
            return obj.user1.owner.venue.convention_center_name
        return None

    def get_user2_venue(self, obj):
        """Returns the venue name if user2 is an owner and has a venue."""
        if hasattr(obj.user2, 'owner') and hasattr(obj.user2.owner, 'venue'):
            return obj.user2.owner.venue.convention_center_name
        return None
    

class MessageSerializer(serializers.ModelSerializer):
    chat_room = ChatroomSerializer(read_only=True)

    class Meta:
        model = Messages
        fields = ['id','chat_room','user','content','timestamp','seen']