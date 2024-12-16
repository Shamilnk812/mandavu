import random
from django.core.mail import EmailMessage
from .models import OneTimePassword,User
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import datetime


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
        current_site = "Mandavu.com"
        email_body = f"Hi {user.first_name} thanks for singing up on {current_site} please verify your email wiht the one tiem OTP {otp_code}"
        from_email = settings.DEFAULT_FROM_EMAIL

        OneTimePassword.objects.update_or_create(
            user=user,
            defaults={'code': encrypted_otp, 'created_at': timezone.now()}
        )
        s_email = EmailMessage(subject=subject, body=email_body, from_email=from_email, to=[email])
        s_email.send(fail_silently=False)
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
    recipient_list = ['shamilnk0458@gmail.com']
    # recipient_list = [booking.user.email]

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





