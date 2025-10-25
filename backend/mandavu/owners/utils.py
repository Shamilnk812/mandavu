import random
from django.core.mail import EmailMessage
from .models import Owner,OneTimePasswordForOwner, BookingPackages
from users.models import Booking
from django.conf import settings
import base64
from django.core.files.base import ContentFile
from django.utils import timezone
from users.utils import encrypt_otp,decrypt_otp
from datetime import datetime,timedelta
from django.core.mail import send_mail
from django.template.loader import render_to_string
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4,A3




def generateOtp() :
    otp = ""
    for i in range(6) :
        otp += str(random.randint(1,9))
    return otp


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


def build_pdf(bookings, formatted_start_date, formatted_end_date):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A3)
    elements = []
    styles = getSampleStyleSheet()

    # Heading
    heading_style = ParagraphStyle('Heading1', parent=styles['Heading1'], alignment=TA_CENTER)
    elements.append(Paragraph("Sales Report", heading_style))
    subheading_style = ParagraphStyle('Subheading', parent=styles['Normal'], fontSize=14, alignment=TA_CENTER)
    elements.append(Paragraph(f"From {formatted_start_date} to {formatted_end_date}", subheading_style))
    elements.append(Spacer(1, 0.2 * inch))

    # Table
    data, total_price = prepare_table_data(bookings)
    table = create_table(data)
    elements.append(table)
    elements.append(Spacer(1, 0.2 * inch))

    # Total price
    total_price_style = ParagraphStyle('TotalPrice', parent=styles['Normal'], fontSize=14, alignment=TA_RIGHT)
    elements.append(Paragraph(f"Total Price = {total_price}", total_price_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer



def prepare_table_data(bookings):
    data = [["ID", "Username", "Event", "Package Name", "Date", "Total Price", "Status"]]
    total_price = 0

    for index, booking in enumerate(bookings, start=1):
        if booking.status == 'Booking Completed':
            total_price += booking.total_price

        formatted_dates = "\n".join([
            datetime.strptime(date, "%Y-%m-%d").strftime("%d %b, %Y")
            for date in booking.dates
        ])
        formatted_price = int(float(booking.total_price))

        data.append([
            str(index),
            booking.user.first_name,
            booking.event_name,
            (booking.package_name[:25] + "...") if booking.package_name and len(booking.package_name) > 25 else (booking.package_name or "N/A"),
            formatted_dates,
            f"{formatted_price}",
            booking.status,
        ])

    return data, total_price



def create_table( data):
    table = Table(data, colWidths=[0.5 * inch, 1.5 * inch, 2 * inch, 2 * inch, 1.5 * inch, 1 * inch, 2 * inch])
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])
    table.setStyle(style)
    return table