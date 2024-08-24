from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from users.models import CustomUser,User,Booking
from owners.models import Owner
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json



#--------------- BOOKING NOTIFICATION ---------------


@receiver(post_save,sender=Booking)
def send_booking_notification(sender,instance,created, **kwargs) :
    if created :
        message_for_owners = (
            f"New booking confirmed!\n"
            f"Name: {instance.name}\n"
            f"Date: {instance.date.strftime('%B %d, %Y')}\n"
            f"Time: {instance.time}\n"
            f"Please ensure everything is ready for the booking."
        )
        message_for_admin = (
            f"New booking confirmed!\n"
            f"Venue: {instance.venue.convention_center_name}\n"
            f"Name: {instance.name}\n"
            f"Date: {instance.date.strftime('%B %d, %Y')}\n"
            f"Time: {instance.time}\n"
        )

        venue_owner = instance.venue.owner
        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_booking_notification(venue_owner,message_for_owners)
        create_booking_notification(admin_user,message_for_admin)

def create_booking_notification(user,message,link=None) :
    Notification.objects.create(
        user=user,
        message=message,
        link=link
    )
    send_real_time_notification(user.id,message)




# User creationatin 
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