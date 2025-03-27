import random
from django.core.mail import EmailMessage
from .models import Owner,OneTimePasswordForOwner
from users.models import Booking
from django.conf import settings
import base64
from django.core.files.base import ContentFile
from django.utils import timezone
from users.utils import encrypt_otp,decrypt_otp
from datetime import datetime,timedelta
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



def description_for_regular_bookingpackages(dining_capacity, auditorium_seating):
    return (
        f"Experience the perfect blend of elegance and comfort with our Common Package, designed to meet your diverse event needs. "
        f"This package offers a spacious and well-equipped venue to create unforgettable memories.\n\n"
        f"Dining Capacity: Accommodates up to {dining_capacity} guests, ensuring a delightful dining experience with ample space for everyone.\n"
        f"Auditorium Seating: Comfortable seating for up to {auditorium_seating} attendees, ideal for ceremonies, presentations, or entertainment programs.\n\n"
        f"Our venue boasts a sophisticated ambiance and modern amenities, promising a seamless experience for you and your guests. "
        f"Choose the Common Package for a hassle-free and memorable event!"
    )



def get_bookings_in_date_range(venue_id=None, start_date=None, end_date=None, is_descending_order=False):
    
    if is_descending_order:
        all_bookings = Booking.objects.filter(venue_id=venue_id).order_by('-id')
    else:
        if venue_id :
            all_bookings = Booking.objects.filter(venue_id=venue_id)
        else:
            all_bookings = Booking.objects.all()


    if start_date and end_date:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
     
            
        # Generate the range of dates between start_date and end_date
        date_range = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
        date_range_str = [d.strftime("%Y-%m-%d") for d in date_range]

        
        filtered_bookings = []
        for booking in all_bookings:
            booking_dates = booking.dates 

            # Check if any of the booking dates fall within the range
            if any(date in date_range_str for date in booking_dates):
                filtered_bookings.append(booking)

        all_bookings = filtered_bookings        

    return all_bookings