from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from .models import Notification
from chat.models import Messages
from users.models import CustomUser,User,Booking,UserInquiry
from owners.models import Owner,BookingPackages,Venue
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from datetime import datetime
from django.core.cache import cache




# Utility Function for Creating Notifications
def create_notification(user,message,link=None) :
    Notification.objects.create(
        user=user,
        message="new one",
        message2= message,
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
        if instance.dates:
            formatted_dates = "\n".join(
                [datetime.strptime(d, "%Y-%m-%d").strftime("%B %d, %Y") for d in instance.dates]
            )
        else:
            formatted_dates = "No dates provided"

        if instance.package_type and instance.package_type.price_for_per_hour != "Not Allowed":
            # Flatten the nested list and join times
            formatted_times = ", ".join([", ".join(time_slot) for time_slot in instance.times])
        else:
            # Directly join times
            formatted_times = ", ".join(instance.times)

            
        # if instance.times:
        #     formatted_times = ", ".join(instance.times)  
        # else:
        #     formatted_times = "No times provided"
      
        message_for_owners = {
            "type": "admin_notification",
            "content":  (f"New booking confirmed!\n"
                        f"Name: {instance.name}\n"
                        f"Date: {formatted_dates}\n"
                        f"Time: {formatted_times}\n"
                        f"Please ensure everything is ready for the booking.")
        }
        message_for_admin = {
            "type": "admin_notification",
            "content": (f"New booking confirmed!\n"
                        f"Venue: {instance.venue.convention_center_name}\n"
                        f"Name: {instance.name}\n"
                        f"Date: {formatted_dates}\n"
                        f"Time: {formatted_times}\n")
        }
        message_for_user = {
            "type": "admin_notification",
            "content": (f"Your booking at {instance.venue.convention_center_name} is confirmed!\n"
                        f"Date: {formatted_dates}\n"
                        f"Time: {formatted_times}\n"
                        f"We look forward to hosting you. If you have any questions, feel free to contact us.")
        }


        venue_owner = instance.venue.owner
        create_notification(venue_owner,message_for_owners)

        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user,message_for_admin)
        
        user = instance.user 
        create_notification(user,message_for_user)





# --------------  Booking Cancellation  --------------

@receiver(post_save,sender=Booking)
def send_booking_cancellation_notification(sender, instance, **kwargs):
    if instance.status == 'Booking Canceled':

        if instance.dates:
            formatted_dates = "\n".join(
                [datetime.strptime(d, '%Y-%m-%d').strftime('%B %d, %Y') for d in instance.dates]
            )
        else:
            formatted_dates = "No dates provided"
        

        if instance.package_type and instance.package_type.price_for_per_hour != "Not Allowed":
            # Flatten the nested list and join times
            formatted_times = ", ".join([", ".join(time_slot) for time_slot in instance.times])
        else:
            # Directly join times
            formatted_times = ", ".join(instance.times)


        # if instance.times:
        #     formatted_times = ", ".join(instance.times)  
        # else:
        #     formatted_times = "No times provided"
      
        message_for_owner = {
            "type": "admin_notification",
            "content": f"The booking for {instance.name} on {formatted_dates} at {formatted_times} has been canceled."
        }
        message_for_user = {
            "type": "admin_notification",
            "content": f"Your booking on {formatted_dates} at {formatted_times} has been canceled. If you have any questions, feel free to contact us."
        }


        message_for_admin = {
            "type": "admin_notification",
            "content": (f"Booking for venue {instance.venue.convention_center_name} has been canceled.\n"
                       f"Customer: {instance.name}\n"
                       f"Date: {formatted_dates}\n"
                       f"Time: {formatted_times}")
        }

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

        # message = (
        #     f"A new booking package '{booking_package_name}' has been created for the venue '{venue_name}'. "
        #     "Please check and verify!"
        # )

        message_content = {
            "type": "admin_notification",
            "content": f"A new booking package '{booking_package_name}' has been created for the venue '{venue_name}'. Please check and verify!" 
        }

        

        create_notification(admin_user,message=message_content)
    
    else :
        original_data = _original_booking_package_data.pop(instance.pk, {})
        relevant_fields = [
            'package_name', 'venue_id', 'price', 'price_for_per_hour',
            'air_condition', 'extra_price_for_aircondition', 'description'
        ]
        if any(getattr(instance, field) != original_data.get(field) for field in relevant_fields):
           
            message_content = {
            "type": "admin_notification",
            "content":  f"The booking package '{booking_package_name}' for the venue '{venue_name}' has been updated. Please check and verify!"
            }


            create_notification(admin_user, message=message_content)


        



#---------------------- Users Registration ----------------

@receiver(post_save,sender=User)
def send_notification_user_registration(sender,instance,created, **kwargs):
    if created:
        message_content = {
            "type": "admin_notification",
            "username": "New User Created",
            "content": f'New user {instance.first_name} {instance.last_name} is created , plese check'
        }
        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user, message=message_content)





#------------------- Owners and Venues Registration ------------

@receiver(post_save,sender=Owner)
def send_notification_owner_registration(sender,instance,created, **kwargs) :
    if created :

        message_content = {
            "type": "admin_notification",
            "username": "New Venue Created",
            "content": f'New Venue Owner Rquest - {instance.first_name}{instance.last_name}. Please check and verify!' 
        }


        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user, message=message_content)




# -------------------- Chat Notifications ---------------

@receiver(post_save, sender=Messages)
def notify_recipient_on_new_message(sender, instance, created, **kwargs):

    if created:

        chat_room = instance.chat_room
        sender_user = instance.user
        print(chat_room)

        recipient_user = (
            chat_room.user2 if chat_room.user1 == sender_user else chat_room.user1
        )
    
        
        chat_room.last_message_timestamp = instance.timestamp
        chat_room.save()

       
        message_content = {
            "type": "chat_notification",
            "content": instance.content,
            "username": f"{sender_user.first_name} {sender_user.last_name}",
            "timestamp": instance.timestamp.isoformat(),
        }

        create_notification(user=recipient_user,message=message_content) 

      
        



# -------------------- User Inquiries -------------

@receiver(post_save, sender=UserInquiry)
def notify_new_user_inquiry(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        message_content = {
            "type": "user_inquiry",
            "content": instance.message,
            "username": f"{user.first_name} {user.last_name}",
        }


        admin_user = CustomUser.objects.filter(is_superuser=True).first()
        create_notification(admin_user,message=message_content)



# --------------------- Venue Maintenance ----------------


def notify_admin_on_maintenance_change(venue):
    admin_user = CustomUser.objects.filter(is_superuser=True).first()
    if not admin_user:
        return 

    if venue.is_under_maintenance:
        # Maintenance set
        message_content = {
            "type": "maintenance_set",
            "content": f'The venue {venue.convention_center_name} is now under maintenance. Reason: "{venue.maintenance_reason}".',
            "username": venue.convention_center_name,
        }
    else:
        # Maintenance removed
        message_content = {
            "type": "maintenance_removed",
            "content": f'The venue {venue.convention_center_name} is no longer under maintenance.',
            "username": venue.convention_center_name,
        }

    create_notification(admin_user, message=message_content)