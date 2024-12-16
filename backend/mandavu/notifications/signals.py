from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from .models import Notification
from users.models import CustomUser,User,Booking
from owners.models import Owner,BookingPackages
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json




# Utility Function for Creating Notifications
def create_notification(user,message,link=None) :
    Notification.objects.create(
        user=user,
        message=message,
        link=link
    )
    send_real_time_notification(user.id,message)



# Utility Function for Real-Time Notifications
def send_real_time_notification(user_id,message) :
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{user_id}',
        {
            'type':'notification_message',
            'message':message
        }
    )




#--------------- Venue Booking  ---------------

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
        message_for_user = (
            f"Your booking at {instance.venue.convention_center_name} is confirmed!\n"
            f"Date: {instance.date.strftime('%B %d, %Y')}\n"
            f"Time: {instance.time}\n"
            f"We look forward to hosting you. If you have any questions, feel free to contact us."
        )

        venue_owner = instance.venue.owner
        create_notification(venue_owner,message_for_owners)

        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user,message_for_admin)
        
        user = instance.user 
        create_notification(user,message_for_user)

# def create_booking_notification(user,message,link=None) :
#     Notification.objects.create(
#         user=user,
#         message=message,
#         link=link
#     )
#     send_real_time_notification(user.id,message)



# --------------  Booking Cancellation  --------------

@receiver(post_save,sender=Booking)
def send_booking_cancellation_notification(sender, instance, **kwargs):
    if instance.status == 'Booking Canceled':

        message_for_owner = (
            f"The booking for {instance.name} on {instance.date.strftime('%B %d, %Y')} "
            f"at {instance.time} has been canceled."
        )
        message_for_user = (
            f"Your booking on {instance.date.strftime('%B %d, %Y')} "
            f"at {instance.time} has been canceled. If you have any questions, feel free to contact us."
        )
        message_for_admin = (
            f"Booking for venue {instance.venue.convention_center_name} has been canceled.\n"
            f"Customer: {instance.name}\n"
            f"Date: {instance.date.strftime('%B %d, %Y')}\n"
            f"Time: {instance.time}"
        )


        venue_owner = instance.venue.owner
        create_notification(venue_owner,message_for_owner)

        user = instance.user
        create_notification(user,message_for_user)

        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user,message_for_admin)

        



#------------------- Venue booking package creation and updation -----------------------

_original_booking_package_data = {}

@receiver(pre_save, sender=BookingPackages)
def capture_original_booking_package_data(sender, instance, **kwargs):
    if instance.pk:  # Check if the instance already exists (update scenario)
        original_instance = BookingPackages.objects.get(pk=instance.pk)
        _original_booking_package_data[instance.pk] = {
            'package_name': original_instance.package_name,
            'venue_id': original_instance.venue_id,
            'price': original_instance.price,
            'price_for_per_hour': original_instance.price_for_per_hour,
            'air_condition': original_instance.air_condition,
            'extra_price_for_aircondition': original_instance.extra_price_for_aircondition,
            'description': original_instance.description,
        }



@receiver(post_save, sender=BookingPackages)
def send_notification_for_booking_package(sender, instance, created, **kwargs):
    admin_user = CustomUser.objects.filter(is_superuser=True).first()
    if not admin_user:
        return  
    
    venue_name = instance.venue.convention_center_name
    booking_package_name = instance.package_name

    if created :

        message = (
            f"A new booking package '{booking_package_name}' has been created for the venue '{venue_name}'. "
            "Please check and verify!"
        )

        create_notification(admin_user,message)
    
    else :
        original_data = _original_booking_package_data.pop(instance.pk, {})
        relevant_fields = [
            'package_name', 'venue_id', 'price', 'price_for_per_hour',
            'air_condition', 'extra_price_for_aircondition', 'description'
        ]
        if any(getattr(instance, field) != original_data.get(field) for field in relevant_fields):
            # Notification for Package Update
            message = (
                f"The booking package '{booking_package_name}' for the venue '{venue_name}' has been updated. "
                "Please check and verify!"
            )
            create_notification(admin_user, message)


        






#---------------------- Users Registration ----------------

@receiver(post_save,sender=User)
def send_notification_user_registration(sender,instance,created, **kwargs):
    if created:
        message = f'New user {instance.first_name}{instance.last_name} is created , plese check'
        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user, message)



# def create_user_notification(user,message,link=None):
#     notification = Notification.objects.create(
#         user=user,
#         message=message,
#         link=link
#     )
#     send_real_time_notification(user.id,message)


#------------------- Owners and Venues Registration ------------

@receiver(post_save,sender=Owner)
def send_notification_owner_registration(sender,instance,created, **kwargs) :
    if created :
        message = f'New Venue Owner Rquest - {instance.first_name}{instance.last_name}. Please check and verify!'
        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user, message)


# def create_owner_notification(user, message, link=None):
#     notification = Notification.objects.create(
#         user = user,
#         message = message,
#         link = link
#     )
#     send_real_time_notification(user.id,message)



# def send_real_time_notification(user_id,message) :
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         f'notifications_{user_id}',
#         {
#             'type':'notification_message',
#             'message':message
#         }
#     )