import random
from django.core.mail import EmailMessage
from .models import OneTimePassword,User
from django.conf import settings

def generateOtp() :
    otp = ""
    for i in range(6) :
        otp += str(random.randint(1,9))
    return otp


def sent_otp_to_user(email) :
    subject = "One time OTP for email verification"
    otp_code = generateOtp()
    print(otp_code)
    try :
        user = User.objects.get(email=email)
        current_site = "Mandavu.com"
        email_body = f"Hi {user.first_name} thanks for singing up on {current_site} please verify your email wiht the one tiem OTP {otp_code}"
        from_email = settings.DEFAULT_FROM_EMAIL

        OneTimePassword.objects.create(user=user,code=otp_code)
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
        from_email = settings.DEFAULT_FROM_EMAIL,
        to=[data['to_email']]

    )
    email.send(fail_silently=False)