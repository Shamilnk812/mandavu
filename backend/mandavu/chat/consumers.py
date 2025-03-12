import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import CustomUser,User
from owners.models import Owner,Venue
from django.utils.timezone import now
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
                
               
                await self.update_user_status(self.request_user.id, "online")


                # user = await database_sync_to_async(CustomUser.objects.get)(id=self.request_user.id)
                # last_seen = user.last_seen.isoformat() if user.last_seen else None
                # user_status = user.is_online
                # print('last seen',last_seen)
                # print('user status', user_status)
                # await self.channel_layer.group_send(
                #     self.room_group_name,
                #     {
                #         "type": "user_status",
                #         "user_id": self.request_user.id,
                #         "status": "online",
                #         "last_seen": last_seen,
                #         "user_status":user_status
                #     }
                # )


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
                
                username = await self.get_username()
                result = await self.save_message(message)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message_id": result['message_id'],
                        "content": message,
                        "user": self.request_user.id,  # Pass the sender's user ID
                        "username": username,
                        "timestamp": result['timestamp'],  # Send the timestamp
                        "seen": result['seen'],
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

            # await self.mark_messages_as_seen()    
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))


    
    
   
    @database_sync_to_async
    def save_message(self, message_content):
        chat_room = self.chat_room[0]
        message = Messages.objects.create(
            chat_room=chat_room,
            user=self.request_user,
            content=message_content,
            seen=False
        )

        return {
            'message_id': message.id,
            'timestamp': message.timestamp.isoformat(),  # Return the timestamp
            'seen': message.seen ,
        }
    
    @database_sync_to_async
    def get_username(self):
        if self.request_user.is_owner:
            owner = Owner.objects.get(id=self.request_user.id)
            venue = Venue.objects.filter(owner=owner).first()
            if venue :
                return f"{owner.first_name} {owner.last_name} ({venue.convention_center_name})"
            return f"{owner.first_name} {owner.last_name}"
        
        elif self.request_user.is_user:
            return f"{self.request_user.first_name} {self.request_user.last_name}"
        
        return "Unknown User"





    # @database_sync_to_async
    # def mark_messages_as_seen(self):
    #     chat_room = self.chat_room[0]
    #     Messages.objects.filter(
    #         chat_room=chat_room,
    #         user=self.request_user
    #     ).update(seen=True)

    async def disconnect(self, code):
        try:
            await self.update_user_status(self.request_user.id, "offline")

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
            # user = await database_sync_to_async(CustomUser.objects.get)(id=self.request_user.id)
            # last_seen = user.last_seen.isoformat() if user.last_seen else None
            # user_status = user.is_online

            # await self.channel_layer.group_send(
            #     self.room_group_name,
            #     {
            #         "type": "user_status",
            #         "user_id": self.request_user.id,
            #         "status": "offline",
            #         "last_seen": last_seen,
            #         "user_status":user_status
            #     }
            # )


        except Exception as e:
            print(f"Error in disconnect: {str(e)}")


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message_id": event['message_id'],
            "content": event['content'],
            "user": event['user'],  # Use the sender's user ID from the event
            "username": event['username'],
            "timestamp": event['timestamp'],
            "seen": event['seen'],
        }))


    async def video_call(self, event):
        await self.send(text_data=json.dumps({
            "type": "video_call",
            "link": event['link']
        }))
    
    
    # Update user online status
    # @database_sync_to_async
    # def update_user_status(self, user_id, status):
    #     user = CustomUser.objects.get(id=user_id)
    #     user.is_online = status == "online"
    #     user.save()


    @database_sync_to_async
    def update_user_status(self, user_id, status):
        user = CustomUser.objects.get(id=user_id)
        if status == "offline":
            user.last_seen = now() 
        user.is_online = (status == "online")
        user.save()    
        print(f"Updated user {user_id} - Last Seen: {user.last_seen}")  # Debug print


    # async def user_status(self, event):
    #     await self.send(text_data=json.dumps({
    #         "type": "user_status",
    #         "user_id": event["user_id"],
    #         "status": event["status"],
    #         "last_seen": event["last_seen"],
    #         "user_status": event["user_status"]
    #     }))
