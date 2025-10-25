import random
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from .models import OneTimePassword,User,TempBooking, Booking, BookingDetails
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import datetime
from owners.models import Venue, BookingPackages
import stripe
from decimal import Decimal
from django.db.models import F
from django.db.models.functions import Radians
from django.db.models import Avg,Count,F,FloatField, ExpressionWrapper,Q
from django.db.models.functions import ACos, Cos, Radians, Sin


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


# --------- Password Reset email -------
def send_password_reset_email(data) :
    email = EmailMessage(
        subject=data['email_subject'],
        body=data['email_body'],
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[data['to_email']]
    )
    email.send(fail_silently=False) 


#---------- Venue Booking Confirmation Email -----------
def send_venue_booking_confirmation_email(booking , facilities):
    subject = f"Booking Confirmation - {booking.venue.convention_center_name}"
    logo_url = f"{settings.MEDIA_URL}logo/mandavu-logo.png"
    recipient_list = [booking.user.email]

    context = {
        'logo_url': logo_url,
        'venue_name': booking.venue.convention_center_name,
        'event_name': booking.event_name,
        'event_details': booking.event_details,
        'dates': booking.dates,
        'times': booking.times,
        'facilities': facilities,
        'total_amount': booking.total_price,
        'booking_amount': booking.booking_amount,
        'current_year': datetime.now().year
    }
    message = render_to_string('emails/venue_booking_confirmation_email.html', context)
    send_mail(subject,'',settings.DEFAULT_FROM_EMAIL, recipient_list, html_message=message)


def send_user_inquiry_message(username,email,message):
    subject = f"New Inquiry from {username}"
    recipient_list = [settings.DEFAULT_FROM_EMAIL]
  
    context = {
        "username":username,
        "email":email,
        "message":message
    }
    message = render_to_string('emails/user_inquiry.html',context)
    send_mail(subject,'',email,recipient_list, html_message=message)
    


# Check if requested dates are already booked or exist in temp bookings.
def check_booking_conflicts(venue, requested_dates, package_name):
    # Check confirmed bookings
    existing_bookings = Booking.objects.filter(
        venue=venue,
        status__in=['Booking Confirmed', 'Booking Completed']
    )
    booked_dates = []
    for booking in existing_bookings:
        booked_dates += booking.dates

    for date in requested_dates:
        if package_name == 'regular' and date in booked_dates:
            return True, f"Booking already exists on date {date}. Please choose a different date."

    # Check temp bookings
    existing_temps = TempBooking.objects.filter(venue=venue)
    for temp in existing_temps:
        temp_dates = temp.data.get('dates', [])
        if set(requested_dates) & set(temp_dates):
            return True, f"The date(s) {set(requested_dates) & set(temp_dates)} are currently being booked. Try again later."
        
    return False, ""


def handle_webhook_conflicts(temp_booking, session):
    venue = Venue.objects.select_for_update().get(id=temp_booking.venue.id)
    booking_details = temp_booking.data
    requested_dates = booking_details['dates']
    package_name = booking_details['packageName'].lower()
   
    # Check against confirmed bookings
    existing_bookings = Booking.objects.select_for_update().filter(
        venue=venue,
        status__in=['Booking Confirmed', 'Booking Completed']
    )
    booked_dates = []
    for booking in existing_bookings:
        booked_dates += booking.dates

    for date in requested_dates:
        if package_name == 'regular' and date in booked_dates:

            try:
                stripe.Refund.create(payment_intent=session['payment_intent'])
                return True, "Sorry! The venue is already booked for your selected dates. Your payment has been refunded. Please try different dates."
            except stripe.error.StripeError as e:
                return True, "Booking conflict detected. Please contact support for refund."

    # Check against other temp bookings
    existing_temps = TempBooking.objects.filter(venue=venue).exclude(id=temp_booking.id)
    for temp in existing_temps:
        temp_dates = temp.data.get('dates', [])
        if set(requested_dates) & set(temp_dates):

            try:
                stripe.Refund.create(payment_intent=session['payment_intent'])
                return True, "Another user is currently booking the same dates. Your payment has been refunded. Please try again in a few minutes."
            except stripe.error.StripeError as e:
                return True, "Booking conflict detected. Please contact support for refund."
    return False, ""


def create_final_booking(temp_booking, session):
    """
    Create the final booking from a TempBooking after Stripe payment is successful.
    """
    booking_details = temp_booking.data
    booking_package = get_object_or_404(BookingPackages, id=booking_details['bookingPackage'])

    booking = Booking.objects.create(
        user=temp_booking.user,  
        venue=temp_booking.venue,
        name=booking_details['fullName'],  
        phone=booking_details['phoneNumber'],
        additional_phone=booking_details['additionalPhoneNumber'],
        city=booking_details['city'],
        state=booking_details['state'],
        address=booking_details['fullAddress'],
        condition=booking_details['airConditioning'],
        extra_ac_price=booking_details['extraAcAmount'],
        total_price=booking_details['totalAmount'],
        booking_amount=booking_details['bookingAmount'], 
        remaining_amount=booking_details['remainingAmount'],
        payment_intent_id=session['payment_intent'],
        times=booking_details['times'],
        dates=booking_details['dates'],
        event_name=booking_details['eventName'],
        event_details=booking_details['eventDetails'],
        package_type=booking_package,
        package_name=booking_details['packageName']
    )

    # Create BookingDetails entries
    facilities = booking_details.get('facilities', [])
    for f in facilities:
        BookingDetails.objects.create(
            booking=booking,
            facilities=f"{f['facility']} - {f['price']}"
        )
    return booking, facilities


def calculate_distance(queryset, user_latitude, user_longitude):
        """
        Calculate the distance (in km) from the user's location for each venue
        using the Haversine formula and order results by nearest first.
        """
        return queryset.annotate(
            distance=ExpressionWrapper(
                6371 * ACos(
                    Cos(Radians(user_latitude)) *
                    Cos(Radians(F('latitude'))) *
                    Cos(Radians(F('longitude')) - Radians(user_longitude)) +
                    Sin(Radians(user_latitude)) *
                    Sin(Radians(F('latitude')))
                ),
                output_field=FloatField()
            )
        ).order_by('distance')









