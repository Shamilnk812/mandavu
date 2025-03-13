import random
from django.core.mail import EmailMessage
from .models import OneTimePassword,User
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import datetime


from decimal import Decimal
from django.db.models import F
from django.db.models.functions import Radians
from math import cos, sin, asin, sqrt,radians


def generateOtp() :
    otp = ""
    for i in range(6) :
        otp += str(random.randint(1,9))
    return otp

def encrypt_otp(otp):
    encrypted_otp = settings.CIPHER_SUITE.encrypt(otp.encode())
    return encrypted_otp.decode()

def decrypt_otp(encrypted_otp):
    decrypted_otp = settings.CIPHER_SUITE.decrypt(encrypted_otp.encode())
    return decrypted_otp.decode()

def sent_otp_to_user(email) :
    subject = "One time OTP for email verification"
    otp_code = generateOtp()
    encrypted_otp = encrypt_otp(otp_code)
    print(otp_code)  # For testing purposes
    
    try :
        user = User.objects.get(email=email)
        recipient_list = [email]
        context = {
            'user_name': user.first_name + user.last_name,
            'otp_code' : otp_code, 
            'current_year': datetime.now().year

        }
    
        OneTimePassword.objects.update_or_create(
            user=user,
            defaults={'code': encrypted_otp, 'created_at': timezone.now()}
        )
     
        message = render_to_string('emails/otp_verification_email.html', context)
        send_mail(subject,'',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)
        print('emial sented success')
    except Exception as e :
        print(f"Failed to send email: {e}")    




# ======== Password Reset email  ===========




def send_password_reset_email(data) :
    email = EmailMessage(
        subject=data['email_subject'],
        body=data['email_body'],
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[data['to_email']]
    )
    email.send(fail_silently=False) 


#-------------- Venue Booking Confirmation Email -------------

def send_venue_booking_confirmation_email(booking , facilities):
    subject = f"Booking Confirmation - {booking.venue.convention_center_name}"
    logo_url = f"{settings.MEDIA_URL}logo/mandavu-logo.png"
    # recipient_list = ['shamilnk0458@gmail.com']
    recipient_list = [booking.user.email]

    print('user email is ',recipient_list)
    print('facilitis', facilities)
    context = {
        'logo_url': logo_url,
        'venue_name': booking.venue.convention_center_name,
        'event_name': booking.event_name,
        'event_details': booking.event_details,
        'dates': booking.dates,
        'times': booking.times,
        'facilities': facilities,
        'total_amount': booking.total_price,
        # 'remaining_amount': booking.remaining_amount,
        'booking_amount': booking.booking_amount,
        'current_year': datetime.now().year

    
    }
    message = render_to_string('emails/venue_booking_confirmation_email.html', context)
    send_mail(subject,'',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)




def send_user_inquiry_message(username,email,message):
    subject = f"New Inquiry from {username}"
    recipient_list = [settings.DEFAULT_FROM_EMAIL]
    print(recipient_list)

    context = {
        "username":username,
        "email":email,
        "message":message

    }

    message = render_to_string('emails/user_inquiry.html',context)
    send_mail(subject,'',email,recipient_list, html_message=message)
    print("email sented success")











# def haversine(lat1, lon1, lat2, lon2):
#     """
#     Calculate the distance between two points on Earth using the Haversine formula.
#     """
#     R = 6371  # Earth's radius in kilometers

#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

#     dlon = lon2 - lon1
#     dlat = lat2 - lat1

#     a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
#     c = 2 * asin(sqrt(a))

#     return c * R