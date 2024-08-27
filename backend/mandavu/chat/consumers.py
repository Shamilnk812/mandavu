import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import CustomUser
from .models import *

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            self.request_user = self.scope['user']
            if self.request_user.is_authenticated:
                self.chat_with_user = self.scope["url_route"]["kwargs"]["id"]
                user_ids = [int(self.request_user.id), int(self.chat_with_user)]
                user_ids = sorted(user_ids)
                self.room_group_name = f"chat_{user_ids[0]}-{user_ids[1]}"

                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                self.chat_room = await self.get_or_create_chat_room()
                await self.accept()
            else:
                await self.close()
        except Exception as e:
            print(f"Error in connect: {str(e)}")
            await self.close()

    @database_sync_to_async
    def get_or_create_chat_room(self):
        user1 = self.request_user
        user2 = CustomUser.objects.get(id=self.chat_with_user)
        user_ids = sorted([user1.id, user2.id])

        chat_room, created = ChatRooms.objects.get_or_create(
            user1_id=user_ids[0],
            user2_id=user_ids[1],
            defaults={'user1_id': user_ids[0], 'user2_id': user_ids[1]}
        )
        return chat_room, created

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get("message")
            video_call_link = data.get("link")

            if message:
                message_id = await self.save_message(message)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message_id": message_id,
                        "message": message
                    }
                )
            elif video_call_link:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "video_call",
                        "link": video_call_link
                    }
                )
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))

    @database_sync_to_async
    def save_message(self, message_content):
        chat_room = self.chat_room[0]
        message = Messages.objects.create(
            chat_room=chat_room,
            user=self.request_user,
            content=message_content
        )

        return message.id

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"Error in disconnect: {str(e)}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message_id": event['message_id'],
            "message": event['message']
        }))

    async def video_call(self, event):
        await self.send(text_data=json.dumps({
            "type": "video_call",
            "link": event['link']
        }))
