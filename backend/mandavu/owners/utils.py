import random
from django.core.mail import EmailMessage
from .models import Owner,OneTimePasswordForOwner
from django.conf import settings
import base64
from django.core.files.base import ContentFile
from django.utils import timezone
from users.utils import encrypt_otp,decrypt_otp

def generateOtp() :
    otp = ""
    for i in range(6) :
        otp += str(random.randint(1,9))
    return otp


# def encrypt_otp(otp):
#     encrypted_otp = settings.CIPHER_SUITE.encrypt(otp.encode())
#     return encrypted_otp.decode()

# def decrypt_otp(encrypted_otp):
#     decrypted_otp = settings.CIPHER_SUITE.decrypt(encrypted_otp.encode())
#     return decrypted_otp.decode()


def sent_otp_to_owner(email) :
    subject = "One time OTP for email verification"
    otp_code = generateOtp()
    encrypted_otp = encrypt_otp(otp_code)
    try :
        owner = Owner.objects.get(email=email)
        current_site = "Mandavu.com"
        email_body = f"Hi {owner.first_name} thanks for singing up on {current_site} please verify your email wiht the one tiem OTP {otp_code}"
        from_email = settings.DEFAULT_FROM_EMAIL

        OneTimePasswordForOwner.objects.update_or_create(
            owner=owner,
            defaults={'code': encrypted_otp, 'created_at': timezone.now()}
        )
        s_email = EmailMessage(subject=subject, body=email_body, from_email=from_email, to=[email])
        s_email.send(fail_silently=False)
        print('emial sented success')
    except Exception as e :
        print(f"Failed to send email: {e}")    


def decode_base64_file(base64_data, default_extension='jpg'):
    try:
        file_extension = default_extension
        if base64_data.startswith('data:'):
            # Remove the data URL scheme and extract the file extension if present
            header, base64_data = base64_data.split(',', 1)
            file_extension = header.split('/')[1].split(';')[0]  # Extract the extension from the header
            
        file_data = base64.b64decode(base64_data)
        file_name = f'decoded_file.{file_extension}'  # Ensure the file has the correct extension
        return ContentFile(file_data, name=file_name)
    except Exception as e:
        raise ValueError(f"Error decoding base64 file: {e}")



def send_owner_password_reset_email(data):
    email = EmailMessage(
        subject=data['email_subject'],
        body=data['email_body'],
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[data['to_email']]
    )
    email.send(fail_silently=False)