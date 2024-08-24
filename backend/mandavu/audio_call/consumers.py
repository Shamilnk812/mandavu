import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AudioCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"audio_call_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        offer = text_data_json.get('offer')
        answer = text_data_json.get('answer')
        ice_candidate = text_data_json.get('iceCandidate')

        if offer:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_offer',
                    'offer': offer,
                }
            )

        if answer:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_answer',
                    'answer': answer,
                }
            )

        if ice_candidate:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_ice_candidate',
                    'ice_candidate': ice_candidate,
                }
            )

    async def send_offer(self, event):
        offer = event['offer']

        await self.send(text_data=json.dumps({
            'offer': offer,
        }))

    async def send_answer(self, event):
        answer = event['answer']

        await self.send(text_data=json.dumps({
            'answer': answer,
        }))

    async def send_ice_candidate(self, event):
        ice_candidate = event['ice_candidate']

        await self.send(text_data=json.dumps({
            'iceCandidate': ice_candidate,
        }))
