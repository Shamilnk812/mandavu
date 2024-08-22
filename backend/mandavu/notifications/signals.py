from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from users.models import CustomUser,User
from owners.models import Owner
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

@receiver(post_save,sender=User)
def send_notification_user_registration(sender,instance,created, **kwargs):
    if created:
        message = f'New user {instance.first_name}{instance.last_name} is created , plese check'
        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_user_notification(admin_user, message)



def create_user_notification(user,message,link=None):
    notification = Notification.objects.create(
        user=user,
        message=message,
        link=link
    )
    send_real_time_notification(user.id,message)


#Owner and Venue Registration
@receiver(post_save,sender=Owner)
def send_notification_owner_registration(sender,instance,created, **kwargs) :
    if created :
        message = f'New Venue Owner Rquest - {instance.first_name}{instance.last_name}. Please check and verify!'
        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_owner_notification(admin_user, message)


def create_owner_notification(user, message, link=None):
    notification = Notification.objects.create(
        user = user,
        message = message,
        link = link
    )
    send_real_time_notification(user.id,message)



def send_real_time_notification(user_id,message) :
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{user_id}',
        {
            'type':'notification_message',
            'message':message
        }
    )