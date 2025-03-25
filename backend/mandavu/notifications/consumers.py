

import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

# logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'


        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']


        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'message': message
            }
        )

    async def notification_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))









# class VideoCallConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user_id = self.scope['url_route']['kwargs']['user_id']
#         self.group_name = f'video_call_{self.user_id}'

#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         video_call_link = text_data_json.get('link')

#         if video_call_link:
#             await self.channel_layer.group_send(
#                 self.group_name,
#                 {
#                     'type': 'video_call',
#                     'link': video_call_link
#                 }
#             )

#     async def video_call_message(self, event):
#         link = event['link']

#         await self.send(text_data=json.dumps({
#             "type": "video_call",
#             "link": link
#         }))



# class VideoCallConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user_id = self.scope['url_route']['kwargs']['user_id']
#         self.group_name = f'video_call_{self.user_id}'

#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         video_call_link = text_data_json.get('link')

#         if video_call_link:
#             await self.channel_layer.group_send(
#                 self.group_name,
#                 {
#                     'type': 'video_call',  # This matches the method name
#                     'link': video_call_link
#                 }
#             )

#     async def video_call(self, event):  # The method should match 'type': 'video_call'
#         link = event['link']

#         await self.send(text_data=json.dumps({
#             "type": "video_call",
#             "link": link
#         }))


class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'video_call_{self.user_id}'

        # Join the user's video call group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the user's video call group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Handle incoming WebSocket messages.
        Expected format:
        {
            "type": "video_call",
            "link": "video_call_link",
            "recipient_id": "UserB_ID"
        }
        """
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'video_call':
            video_call_link = text_data_json.get('link')
            recipient_id = text_data_json.get('recipient_id')

            if video_call_link and recipient_id:
                # Send the video call link to the recipient's group
                recipient_group = f'video_call_{recipient_id}'
                await self.channel_layer.group_send(
                    recipient_group,
                    {
                        'type': 'video_call',  # Method name to handle the message
                        'link': video_call_link
                    }
                )
            else:
                # Handle invalid message format
                await self.send(text_data=json.dumps({
                    "error": "Invalid video call message format."
                }))
        else:
            # Handle other message types or ignore
            await self.send(text_data=json.dumps({
                "error": f"Unhandled message type: {message_type}"
            }))

    async def video_call(self, event):
        """
        Handler for 'video_call' messages sent to the group.
        """
        link = event['link']

        # Send the video call link to the WebSocket
        await self.send(text_data=json.dumps({
            "type": "video_call",
            "link": link
        }))
