from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_approval_email(venue):
        subject = 'Your Venue has been Approved!'
        recipient_list = [venue.owner.email]
        context = {
            'venue_name': venue.name,
        }
        message = render_to_string('emails/venue_approved.html', context)
        send_mail(subject, '', 'shamilnk67@gmail.com', recipient_list, html_message=message)