import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import CustomUser,User
from owners.models import Owner,Venue
from django.utils.timezone import now
from django.utils import timezone
from .models import *
from django.core.cache import cache



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
                
                # set user to active user 
                await self.add_user_to_active_chat(self.chat_room[0].id, self.request_user.id)

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
                        "user": self.request_user.id, 
                        "username": username,
                        "timestamp": result['timestamp'],  
                        "seen": result['seen'],
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
            content=message_content,
            seen=False
        )
     
        return {
            'message_id': message.id,
            'timestamp': message.timestamp.isoformat(),  
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






    async def disconnect(self, code):
        try:

            #remove user from active list 
            if hasattr(self, 'chat_room') and self.chat_room:
                await self.remove_user_from_active_chat(self.chat_room[0].id, self.request_user.id)
            
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
        except Exception as e:
            print(f"Error in disconnect: {str(e)}")


    async def chat_message(self, event):
        recipient_user_id = int(self.chat_with_user)
        send_user_id = self.request_user.id

        is_recipient_active = await self.is_user_active_in_chat(self.chat_room[0].id, recipient_user_id)
        unread_message_count = 0
        message_seen = event['seen']
       

        if is_recipient_active:
           message_seen = True
           await self.mark_message_as_marked( event['message_id'])
        else:
            unread_message_count = await self.get_unread_count(self.chat_room[0].id,recipient_user_id)
           

        await self.send(text_data=json.dumps({
            "type": "message",
            "message_id": event['message_id'],
            "content": event['content'],
            "user": event['user'],  
            "username": event['username'],
            "timestamp": event['timestamp'],
            "seen": message_seen,
        }))


        await self.channel_layer.group_send(
            f"user_status_{recipient_user_id}",
            {
                "type": "unread_count_update",
                "chat_room_id": self.chat_room[0].id,
                "sender_id": event['user'],
                "unread_count": unread_message_count,
                "last_message": event['content'],
                "timestamp": event['timestamp']
            }
        )



    @database_sync_to_async
    def get_unread_count(self, chat_room_id, recipient_user_id):
        return Messages.objects.filter(
            chat_room_id=chat_room_id, 
            seen=False
        ).exclude(user_id=recipient_user_id).count()
    

    
    @database_sync_to_async
    def mark_message_as_marked(self ,message_id):
        Messages.objects.filter(id=message_id).update(seen=True)
        
    

    # async def unread_count_update(self, event):
    #     await self.send(text_data=json.dumps({
    #         "type": "unread_count_update",
    #         "user1_id": event['user1_id'],
    #         "user2_id": event['user2_id'],
    #         "unread_count_user1": event['unread_count_user1'],
    #         "unread_count_user2": event['unread_count_user2'],
    #     }))
    


    # adding users to active chat
    @database_sync_to_async
    def add_user_to_active_chat(self, chat_room_id, user_id):
        active_chats = cache.get(f'active_chats_{chat_room_id}', {})
        active_chats[user_id] = True
        cache.set(f'active_chats_{chat_room_id}', active_chats, timeout=None)
    

    # remove users from active chat
    @database_sync_to_async
    def remove_user_from_active_chat(self, chat_room_id, user_id):
        active_chats = cache.get(f'active_chats_{chat_room_id}', {})
        if user_id in active_chats:
            del active_chats[user_id]
            cache.set(f'active_chats_{chat_room_id}', active_chats, timeout=None )

    
    # check user is active or not  
    @database_sync_to_async
    def is_user_active_in_chat(self,chat_room_id, user_id):
        active_chats = cache.get(f'active_chats_{chat_room_id}', {})
        return active_chats.get(user_id, False)
    


    async def video_call(self, event):
        await self.send(text_data=json.dumps({
            "type": "video_call",
            "link": event['link']
        }))
    
    


# ------------------------------------------------------------------------------------------------------------





class ChatNotificationCosumer2(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.user = self.scope['user']
            if self.user.is_authenticated:
                await self.accept()

                # Add user to their personal status group
                self.status_group_name = f"user_status_{self.user.id}"
                await self.channel_layer.group_add(
                    self.status_group_name,
                    self.channel_name
                )

                await self.channel_layer.group_add("global_online_users", self.channel_name)

                #  Mark user as online
                await self.set_user_online(self.user.id)

                # Update online users list
                await self.broadcast_online_users()
              
            else:
                await self.close()
        except Exception as e:
            print(f"Error in status connect: {str(e)}")
            await self.close()

    



    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("action")
            
            if action == "mark_as_read":
                chat_room_id = data.get("chat_room_id")
                recipient_user_id = data.get('recipient_id')
                message_data = await self.mark_messages_as_read(chat_room_id)


                await self.channel_layer.group_send(
                    f"user_status_{self.user.id}",
                    {
                        "type": "unread_count_update",
                        "chat_room_id": chat_room_id,
                        "sender_id": recipient_user_id,
                        "unread_count": message_data['unread_count'],
                        "last_message": message_data['last_message_content'],
                        "timestamp": message_data['last_message_timestamp'],
            
                    }
                )
                
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))



    async def disconnect(self, close_code):
        try:
             # Remove user from online list
            await self.set_user_offline(self.user.id)

            # Broadcast updated online users list
            await self.broadcast_online_users()
           
            await self.channel_layer.group_discard(
                self.status_group_name,
                self.channel_name
            )

            await self.channel_layer.group_discard(
                "global_online_users", 
                self.channel_name
            )

        except Exception as e:
            print(f"Error in status disconnect: {str(e)}")



    @database_sync_to_async
    def mark_messages_as_read(self, chat_room_id):
        # Mark all unread messages in this chat room as read
        Messages.objects.filter(
            chat_room_id=chat_room_id,
            seen=False
        ).exclude(
            user=self.user
        ).update(seen=True)
        print('messge updated')
        

        unread_count = Messages.objects.filter(
            chat_room_id=chat_room_id,
            seen=False
        ).exclude(user=self.user).count()

        last_message = Messages.objects.filter(chat_room_id=chat_room_id).order_by('-timestamp').first()
    
        last_message_content = last_message.content if last_message else None
        last_message_timestamp = last_message.timestamp if last_message else None

        return {
            "unread_count": unread_count,
            "last_message_content": last_message_content,
            "last_message_timestamp": last_message_timestamp.isoformat()
        }

           
    

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "user_status",
            "user_id": event['user_id'],
            "online": event['online'],
            "last_seen": event['last_seen'],
        }))



    async def unread_count_update(self, event):
        # Send unread count updates to the recipient side
        await self.send(text_data=json.dumps({
            "type": "unread_update",
            "chat_room_id": event["chat_room_id"],
            "sender_id": event["sender_id"],
            "unread_count": event["unread_count"],
            "last_message": event.get("last_message"),
            "timestamp": event.get("timestamp")
        }))
    

    
    
    # Mark user to online users
    async def set_user_online(self, user_id):
        online_users = cache.get("online_users", {})
        online_users[user_id] = True  # Mark user as online
        cache.set("online_users", online_users, timeout=None)



    # Remove user from online users list
    async def set_user_offline(self, user_id):
        online_users = cache.get("online_users", {})
        if user_id in online_users:
            del online_users[user_id]  
            cache.set("online_users", online_users, timeout=None)


    
    async def broadcast_online_users(self):
        online_users = cache.get("online_users", {})
        await self.channel_layer.group_send(
            "global_online_users",  
            {
                "type": "send_online_users",
                "online_users": list(online_users.keys()) 
            }
        )



    # Handle online users update event
    async def send_online_users(self, event):
        await self.send(text_data=json.dumps({
            "type": "online_users",
            "online_users": event["online_users"]
            }))      

  






# ---------------------------------------------------------- end -----------------------------------------------------------------































   