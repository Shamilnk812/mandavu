from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter,A3,A2
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import inch


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



#----------- User Inquiry reply mail ---------

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

 

 # ----------- Generate Salesreport -----------

def build_pdf(bookings, formatted_start, formatted_end):
      buffer = BytesIO()
      doc = SimpleDocTemplate(buffer, pagesize=A2)
      elements = []

      styles = getSampleStyleSheet()

      # Heading
      heading_style = ParagraphStyle('Heading1', parent=styles['Heading1'], alignment=TA_CENTER)
      elements.append(Paragraph("Sales Report", heading_style))

      subheading_style = ParagraphStyle('Subheading', parent=styles['Normal'], fontSize=14, alignment=TA_CENTER)
      elements.append(Paragraph(f"From {formatted_start} to {formatted_end}", subheading_style))
      elements.append(Spacer(1, 0.2 * inch))

      # Table + Total
      data, total_price = prepare_table_data(bookings)
      table = create_table(data)
      elements.append(table)
      elements.append(Spacer(1, 0.2 * inch))

      total_price_style = ParagraphStyle('TotalPrice', parent=styles['Normal'], fontSize=14, alignment=TA_RIGHT)
      elements.append(Paragraph(f"Total Price = {total_price}", total_price_style))

      doc.build(elements)
      buffer.seek(0)
      return buffer



def prepare_table_data(bookings):
      data = [["ID", "Username", "Venue", "Event", "Package Name", "Date", "Total Price", "Status"]]
      total_price = 0

      for index, booking in enumerate(bookings, start=1):
            if booking.status == "Booking Completed":
                  total_price += booking.total_price

            formatted_dates = "\n".join([
                  datetime.strptime(date, "%Y-%m-%d").strftime("%d %b, %Y") 
                  for date in booking.dates
            ])
            formatted_price = int(float(booking.total_price))

            data.append([
                  str(index),
                  booking.user.first_name,
                  booking.venue.convention_center_name,
                  booking.event_name,
                  (booking.package_name[:25] + "...") if booking.package_name and len(booking.package_name) > 25 else (booking.package_name or "N/A"),
                  formatted_dates,
                  f"{formatted_price}",
                  booking.status,
            ])
      return data, total_price



def create_table(data):
      table = Table(data, colWidths=[
      0.5 * inch, 1.5 * inch, 2 * inch, 2 * inch, 2 * inch, 1.5 * inch, 1 * inch, 2 * inch
      ])
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