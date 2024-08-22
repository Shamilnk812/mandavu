# import json
# from channels.generic.websocket import AsyncWebsocketConsumer



# class NotificationConsumer(AsyncWebsocketConsumer) :
#     async def connect(self):
#         self.user_id = self.scope['url_route']['kwargs']['user_id']
#         self.group_name = f'notifications_{self.user_id}'

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
#         data = json.loads(text_data)
#         message = data['message']

#         await self.channel_layer.group_send(
#             self.group_name,
#             {
#                 'type': 'notification_message',
#                 'message': message
#             }
#         )    


#     async def notification_message(self, event):
#         message = event['message']

#         await self.send(text_data=json.dumps({
#             'message': message
#         }))    



import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'

        logger.debug(f"Connecting: user_id={self.user_id}, group_name={self.group_name}")

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        logger.debug("Connection accepted")

    async def disconnect(self, close_code):
        logger.debug(f"Disconnecting: close_code={close_code}")
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        logger.debug(f"Received data: {text_data}")
        data = json.loads(text_data)
        message = data['message']

        logger.debug(f"Sending message: {message} to group {self.group_name}")

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'message': message
            }
        )

    async def notification_message(self, event):
        message = event['message']
        logger.debug(f"Notification message: {message}")

        await self.send(text_data=json.dumps({
            'message': message
        }))
