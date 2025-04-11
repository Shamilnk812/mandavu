from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime


def send_approval_email(venue):
        subject = 'Your Venue has been Approved!'
        recipient_list = [venue.owner.email]
        context = {
            'venue_name': venue.convention_center_name,
        }
        message = render_to_string('emails/venue_approved.html', context)
        send_mail(subject, '', 'shamilnk67@gmail.com', recipient_list, html_message=message)


def send_rejection_email(venue, reason):
    subject = f'Rejection: {reason}'
    recipient_list = [venue.owner.email]
    context = {
        'venue_name': venue.convention_center_name,
        'rejection_reason': reason,
    }
    message = render_to_string('emails/venue_rejected.html', context)
    send_mail(subject, '', 'shamilnk67@gmail.com', recipient_list, html_message=message)



# VENUE BOOKING PACKAGE APPROVALS AND REJECTIONS

def send_venue_booking_package_approval_email(venue, booking_package_name):
      subject = "Booking Package Approved"
      recipient_list = [venue.owner.email]
      approval_date = datetime.now().strftime("%B %d, %Y")
 
      context = {
            'booking_package_name' : booking_package_name,
            'venue_name' : venue.convention_center_name,
            'approval_date': approval_date
      }
      message = render_to_string('emails/venue_booking_package_approval.html', context)
      send_mail(subject, '', settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)




def send_venue_booking_package_rejection_email(venue, booking_package_name, rejection_reason) :
      subject =  "Booking Package Rejection Notice"
      recipient_list = [venue.owner.email]
      context = {
            'booking_package_name' : booking_package_name,
            'rejection_reason' : rejection_reason,
            'venue_name' : venue.convention_center_name
      }

      message = render_to_string('emails/venue_booking_package_rejection.html', context)
      send_mail(subject, '',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)




#------------- Accounts blockng and unblocking  -------------

def send_account_blocking_reason_email(recipient, username ,reason , venue_name=None):
      if venue_name :
            subject = f"Your venue {venue_name} is blocked!"
      else:
            subject = f"Your account is blocked!"      
      recipient_list = [recipient]
      context = {
            'subject': subject,
            'reason': reason,
            'user_name':username,
      }
      message = render_to_string('emails/account_blocking_email.html', context)
      send_mail(subject, '',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)



def send_account_unblocking_email(recipient, username, venue_name=None):
      if venue_name :
            subject = f"Your venue {venue_name} is Unblocked!"
      else:
            subject = f"Your account is unblocked!"      
      recipient_list = [recipient]
      context = {
            'subject': subject,
            'user_name':username,
      }
      message = render_to_string('emails/account_unblocking_email.html', context)
      send_mail(subject, '',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)



#------------------------- User Inquiry reply mail ------------------

def send_user_inquiry_reply_email(recipient,username, reply_message):
      
      subject = f"Mandavu Support Team Reply"
      recipient_list = [recipient]
      context = {
            'subject':subject,
            'user_name': username,
            'reply_message': reply_message,
      }

      message = render_to_string('emails/user_inquiry_reply_email.html', context)
      send_mail(subject, '',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)

 