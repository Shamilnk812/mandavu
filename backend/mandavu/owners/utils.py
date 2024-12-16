import random
from django.core.mail import EmailMessage
from .models import Owner,OneTimePasswordForOwner
from django.conf import settings
import base64
from django.core.files.base import ContentFile
from django.utils import timezone
from users.utils import encrypt_otp,decrypt_otp
from datetime import datetime
from django.core.mail import send_mail
from django.template.loader import render_to_string


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
        recipient_list = [email]
        
        context = {
            'user_name': owner.first_name + owner.last_name,
            'otp_code' : otp_code, 
            'current_year': datetime.now().year

        }

        OneTimePasswordForOwner.objects.update_or_create(
            owner=owner,
            defaults={'code': encrypted_otp, 'created_at': timezone.now()}
        )

        message = render_to_string('emails/otp_verification_email.html', context)
        send_mail(subject,'',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)
       
        print('email sent successfully.')
        print(otp_code)
    except Exception as e :
        print(f"Failed to sent email: {e}")    



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