from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import OneTimePassword,Booking,BookingDetails
from owners.models import BookingPackages
from .utils import *
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str,DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from admin_dash.views import CustomPagination
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
import stripe
from django.conf import settings
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from owners.models import UnavailableDate
from django.http import HttpResponse
import json
from datetime import datetime, date as dt_date
from django.db.models import Avg,Count,F,Q
from decimal import Decimal, ROUND_DOWN
from django.db import transaction
import logging
logger = logging.getLogger("mandavu")



# ----------- User Registration ---------
class RegisterUserView(GenericAPIView) :
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request) :
        try:
            user_data = request.data
            serializer = self.serializer_class(data=user_data)
            if serializer.is_valid() :
                serializer.save()
                user = serializer.data
                sent_otp_to_user(user['email'])
                return Response({
                    'data' :user,
                    'message' :f"Hi thanks for singing up a OTP has be sent to your email "
                },status=status.HTTP_201_CREATED)
            logger.warning(f"User registration failed. Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Exception occurred during user registration: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong during registration. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginUserView(GenericAPIView) :
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request) :
        try:
            serializer = self.serializer_class(data=request.data, context={'request':request})
            if serializer.is_valid() :
                response_data = serializer.validated_data
                return Response(response_data, status=status.HTTP_200_OK)
            logger.warning(f"User Loing failed. Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        
        except Exception as e: 
            logger.error(f"Exception occurred during user login: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong during login. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutUserView(GenericAPIView) :
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred during user logout: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong during logout. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateUserView(GenericAPIView) :
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request,uid) :
        try:
            user = get_object_or_404(User, pk=uid)
            serializer = self.serializer_class(user, data=request.data, partial=True)
            if serializer.is_valid() :
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Exception occurred during user update: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while updating user details. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class UserDetailsView(GenericAPIView) :
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request,uid) :
        try:
            user = get_object_or_404(User, pk=uid)
            serializer = self.serializer_class(user) 
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching user details: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching user details. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class ChangeUserPassword(GenericAPIView) :
    permission_classes = [IsAuthenticated]

    def post(self, request,uid) :
        try:
            user = get_object_or_404(User, pk=uid)
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
        
            if not old_password or not new_password :
                return Response({'message':'old password and New password are required'},status=status.HTTP_400_BAD_REQUEST)
            if not user.check_password(old_password) :
                return Response({'message':'Incorrect old password'},status=status.HTTP_400_BAD_REQUEST)
    
            user.password = make_password(new_password)
            user.save()
            return Response({'message':'Password changed successfully'},status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while changing password: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while changing password. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyToken(APIView):
    permission_classes = [IsAuthenticated]
    def post(self , request):
        return Response({"message":"token is valid"},status=status.HTTP_200_OK)

    
class VerifyUserOtp(GenericAPIView) :
    def post(self, request) :
        otp_code = request.data.get('otp')
        email = request.data.get('email')
        try :
            user = User.objects.get(email=email)
            otp_entry = OneTimePassword.objects.get(user=user)
            
            decrypted_otp_code = decrypt_otp(otp_entry.code)
            if decrypted_otp_code == otp_code :
                
                if otp_entry.is_expired() :
                    return Response({'message': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
          
                if not user.is_verified :
                    user.is_verified = True
                    user.save()
                    return Response({
                        'message':'Account email verified successfully'
                    },status=status.HTTP_200_OK)
        
                return Response({
                        'message' : 'User already verified'
                        },status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)    
        
        except OneTimePassword.DoesNotExist :
            Response({'message':'Invalid OTP'},status=status.HTTP_400_BAD_REQUEST)


class ResendUserOtp(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            sent_otp_to_user(email)
            return Response({'message': 'OTP has been resent successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': f'Failed to resend OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------  Password Reset ------------
class PasswordResetRequestView(GenericAPIView) :
    serializer_class = PasswordResetRequestSerializer
    def post(self, request) :
        try:
            serializer = self.serializer_class(data= request.data, context={'request':request})
            serializer.is_valid()
            return Response({'message':"a link has been sent to your email to reset password"},status=status.HTTP_200_OK)  
        
        except Exception as e:
            logger.error(f"Exception occurred during password reset request: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while processing password reset. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetConfirm(GenericAPIView) :
    def get(self, request, uidb64, token) :
        try :
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token) :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            reset_url = f"{settings.BASE_FRONT_END_URL}/user/set-new-passwod?uidb64={uidb64}&token={token}"
            return redirect(reset_url)
        except DjangoUnicodeDecodeError :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)


class SetNewPassword(GenericAPIView) :
    serializer_class= SetNewPasswordSerializer

    def patch(self, request) :
        try:
            serializer = self.serializer_class(data = request.data)
            serializer.is_valid(raise_exception=True)
            return Response({'message':'password reset successfully '},status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while setting new password: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while resetting the password. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class UserPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
        })


class AllVenuesListView(GenericAPIView):
    serializer_class = VenuesListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = UserPagination

    def get(self, request):
        try:
            search_query = request.GET.get('search', '')
            dining_seat_count = request.GET.get('dining_seat_count')
            auditorium_seat_count = request.GET.get('auditorium_seat_count')
            min_price = request.GET.get('min_price')
            max_price = request.GET.get('max_price')
            user_latitude = request.GET.get('latitude')
            user_longitude = request.GET.get('longitude')
            
            new_latitude = Decimal(user_latitude) if user_latitude not in [None, '0', ''] else None
            new_longitude = Decimal(user_longitude) if user_longitude not in [None, '0', ''] else None
            queryset = Venue.objects.filter(is_active=True, is_verified=True,owner__is_active=True )

            if search_query:
                queryset = queryset.filter(
                    Q(convention_center_name__icontains=search_query) |
                    Q(city__icontains=search_query) |
                    Q(state__icontains=search_query) |
                    Q(district__icontains=search_query)
                )
        
            if dining_seat_count not in [None, '0', '']:
                queryset = queryset.filter(dining_seat_count__lte=int(dining_seat_count))

            if auditorium_seat_count not in [None, '0', '']:
                queryset = queryset.filter(auditorium_seat_count__lte=int(auditorium_seat_count))
                
            if min_price not in [None, ''] and max_price not in [None, '0', '']:
                queryset = queryset.filter(price__gte=int(min_price), price__lte=int(max_price))  

            if new_latitude is not None  and new_longitude is not None :
                try:
                    queryset = calculate_distance(queryset, new_latitude, new_longitude)
                except Exception as e:
                    logger.error(f"Error calculating venue distances: {e}", exc_info=True)
                    return Response(
                        {"error": "An unexpected error occurred while calculating venue distances."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(queryset, request)
            serializer = self.serializer_class(result_page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        except Exception as e:
            logger.error(f"Error fetching all venues : {e}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred while fetching venues."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class SingleVenueDetailsView(GenericAPIView) :
    serializer_class = SingleVenueDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, vid) :
        try:
            venue = get_object_or_404(Venue, id=vid)
            serializer = self.serializer_class(venue, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching venue details: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching venue details. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class SingleVenueEventsDetails(GenericAPIView) :
    serializer_class = SingleVenueEventsDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, vid) :
        try:
            venue = get_object_or_404(Venue, id=vid)
            event = Event.objects.filter(venue=venue)
            serializer = self.serializer_class(event, many=True, context={'request': request} )
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching events for venue {vid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching events. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

# ---------- Booking  --------
class CreateCheckOutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('bookingAmount')
        venue_name = request.data.get('venueName')
        venue_id = request.data.get('venueId')
        user_id  = request.data.get('userId')
        requested_dates = request.data.get('dates', [])
        package_name = request.data.get('packageName').lower()
        user = get_object_or_404(User, id=user_id)
        # venue = get_object_or_404(Venue, id=venue_id)

        with transaction.atomic():
            venue = Venue.objects.select_for_update().get(id=venue_id)
            conflict, message = check_booking_conflicts(venue, requested_dates, package_name)
            if conflict:
                return Response({'message': message}, status=400)

            temp_booking = TempBooking.objects.create(
                user=user,
                venue=venue,
                data=request.data
            )
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'inr',
                            'unit_amount': int(amount) * 100,  
                            'product_data': {
                                'name': venue_name,
                            },
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=f"{settings.BASE_FRONT_END_URL}/user/payment-status?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.BASE_FRONT_END_URL}/user/payment-status?canceled=true",
                
                metadata={
                    'temp_booking_id': temp_booking.id  
                }
            )
            return Response({'id': checkout_session.id})
        except stripe.error.StripeError as e:
            temp_booking.delete()
            return Response({'msg': 'Stripe error', 'error': str(e)}, status=500)
        except Exception as e:
            temp_booking.delete()
            return Response({'msg': 'Something went wrong while creating Stripe session', 'error': str(e)}, status=500)
        

@csrf_exempt
def strip_webhook_view(request) :
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None
    try :
        event = stripe.Webhook.construct_event(
        payload, sig_header, settings.STRIPE_SECRET_WEBHOOK
        )
    except ValueError as e:
        # Invalid payload
        return Response(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return Response(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        temp_booking_id = json.loads(session['metadata']['temp_booking_id']) 
        try:
            with transaction.atomic():
                temp_booking = get_object_or_404(TempBooking.objects.select_for_update(), id=temp_booking_id)
                temp_booking.payment_intent_id = session.get('payment_intent')
                temp_booking.save()

                conflict, message = handle_webhook_conflicts(temp_booking, session)
                if conflict:
                    temp_booking.error_message = message
                    temp_booking.save()
                    return HttpResponse(status=200)

                # Create final booking 
                booking, facilities = create_final_booking(temp_booking, session)

                # Send Booking confirmation Email 
                send_venue_booking_confirmation_email(booking, facilities)
                temp_booking.delete()

        except Exception as e:
            logger.error(f"Error processing Stripe webhook for temp_booking {temp_booking_id}: {str(e)}", exc_info=True)
            return HttpResponse(status=500)
    return HttpResponse(status=200)    


class VerifyBooking(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        session_id = request.query_params.get("session_id")
        if not session_id:
            return Response({"status": "error", "message": "Session ID required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            payment_intent = session.payment_intent
            booking = Booking.objects.filter(payment_intent_id=payment_intent).first()

            if booking :
                return Response({
                    "status": "success",
                    "message": "Booking confirmed successfully!"
                })
            else:
                temp_booking = TempBooking.objects.filter(payment_intent_id=payment_intent).first()
                
                if temp_booking and temp_booking.error_message:
                    error_message = temp_booking.error_message
                    temp_booking.delete()
                    return Response({
                        "status": "failed",
                        "message": error_message
                    }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({
                        "status": "failed",
                        "message": "Payment failed or was cancelled. Please try again."
                    }, status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            return Response({"status": "error", "message": "Payment verification failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"status": "error", "message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetBookedDates(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            bookings = Booking.objects.filter(venue=venue, status="Booking Confirmed")
            booking_package = request.query_params.get("booking_package")  
            today = dt_date.today()
            unavailables = UnavailableDate.objects.filter(venue_id=vid, date__gte=today)
            result = []

            if booking_package == "regular":
                result = self._get_regular_booked_dates(bookings, today, unavailables)

            else :
                result = self._get_package_booked_dates(bookings, today, unavailables)
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching booked dates for venue {vid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching booked dates. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    


    def _get_regular_booked_dates(self, bookings, today, unavailables):
        result = []
        booked_dates = bookings.filter(package_type__package_name="regular")
        for booking in booked_dates:
            for d in booking.dates:
                try:
                    d_obj = datetime.strptime(d, "%Y-%m-%d").date()
                    if d_obj >= today:
                        result.append({"date": d, "status": booking.status})
                except ValueError:
                    continue
        for un in unavailables:
            result.append({"date": str(un.date), "status": "Unavailable"})
        return result

    def _get_package_booked_dates(self, bookings, today, unavailables):
        date_slot_count = {}
        for booking in bookings:
            if booking.dates and booking.times:
                filtered_times = [time for time in booking.times if time not in ["Morning", "Evening", "Full Day"]]
                if filtered_times:
                    for date_ in booking.dates:
                        date_slot_count[date_] = date_slot_count.get(date_, 0) + len(filtered_times)

        result = [
            {"date": date_, "booked_time_slots_count": count, "status": "available"}
            for date_, count in date_slot_count.items()
        ]

        for un in unavailables:
            result.append({"date": str(un.date), "booked_time_slots_count": 0, "status": "unavailable"})
        return result
    


class GetBookedTimeSlotsForASelectedDate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            booking_date = request.query_params.get("selectedDate")
            if not booking_date :
                return Response({"error": "selectedDate is required"}, status=status.HTTP_400_BAD_REQUEST)

            bookings = Booking.objects.filter(venue=venue, status="Booking Confirmed", dates__contains=[booking_date])

            booked_time_slots = []
            for booking in bookings :
                booked_time_slots.extend(booking.times)

            excluded_slots = ["Morning", "Evening", "Full Day"]
            remaining_time_slots = [slot for slot in booked_time_slots if slot not in excluded_slots]

            return Response( remaining_time_slots, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching booked time slots for venue {vid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching booked time slots. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ShowBookingDetailsForCalandar(GenericAPIView) :
    permission_classes = [IsAuthenticated]
    serializer_class = ShowBookingDetailsForCalandarSerializer

    def get(self, request, vid) :
        try:
            venue = get_object_or_404(Venue, id=vid) 
            bookings = Booking.objects.filter(venue=venue)
            serializer = self.serializer_class(bookings,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching calendar bookings for venue {vid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching calendar bookings dates. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class ShowBookingListView(GenericAPIView) :
    permission_classes = [IsAuthenticated]
    serializer_class = ShowBookingListSerializer
    pagination_class = CustomPagination

    def get(self, request, uid) :
        try:
            page = request.query_params.get('page', 1)
            user = get_object_or_404(User, id=uid)
            all_bookings = Booking.objects.filter(user=user).order_by('-id')
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(all_bookings, request)
            serializer = self.serializer_class(result_page , many=True)
            return paginator.get_paginated_response(serializer.data)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching bookings for user {uid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching bookings. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    
class ShowSingleBookingDetails(GenericAPIView) :
    permission_classes = [IsAuthenticated]
    serializer_class = ShowBookingListSerializer

    def get(self, request, bid) :
        try:
            booking_obj = get_object_or_404(Booking, id=bid)
            serializer = self.serializer_class(booking_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching single booking {bid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching booking details. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class CancelBookingView(GenericAPIView) :
    permission_classes = [IsAuthenticated]

    def post(self, request, bid) :
        cancel_reason = request.data.get('reason')
        is_user = request.data.get('user')
        booking_obj = get_object_or_404(Booking, id=bid)
        try:
            refund_amount = booking_obj.booking_amount 
            if is_user :
                if booking_obj.dates:
                    first_date = datetime.strptime(booking_obj.dates[0], '%Y-%m-%d').date()
                    days_to_event = (first_date - date.today()).days

                    if days_to_event > 30:
                        refund_amount = booking_obj.booking_amount  # Full refund
                    elif 15 <= days_to_event <= 30:
                        refund_amount = booking_obj.booking_amount * Decimal('0.75')  # 75% refund
                    elif 7 <= days_to_event < 15:
                        refund_amount = booking_obj.booking_amount * Decimal('0.50')  # 50% refund
                    elif 3 <= days_to_event < 7:
                        refund_amount = booking_obj.booking_amount * Decimal('0.25')  # 25% refund
                    else:
                        refund_amount = booking_obj.booking_amount * Decimal('0.15')  # 15% refund
                    
                    booking_obj.is_canceled_by_user = True
                    
            if booking_obj.payment_intent_id :
                with transaction.atomic():
                    rounded_refund = refund_amount.quantize(Decimal('1'), rounding=ROUND_DOWN)

                    refund = stripe.Refund.create(
                        payment_intent=booking_obj.payment_intent_id,
                        amount=int(rounded_refund * 100)
                    )
                    booking_obj.cancel_reason = cancel_reason
                    booking_obj.status = 'Booking Canceled'
                    booking_obj.refund_amount = rounded_refund 
                    booking_obj.save()

                return Response({"message": "Booking canceled and refund processed successfully."}, status=status.HTTP_200_OK)
            else:
                 return Response({"error": "No payment information found."}, status=status.HTTP_400_BAD_REQUEST)
        
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#---------- Venue Reviews ----------
class AddReviewView(APIView) :
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        try:
            serializer = AddReviewSerializer(data=request.data)
            if serializer.is_valid() :
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            
            logger.warning(f"AddReview validation failed. Errors: {serializer.errors}")
            return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Exception occurred while adding review: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while adding the review. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class ShowRatingView(APIView) :
    permission_classes = [IsAuthenticated]

    def get(self, request, vid):
        try:
            reviews = Review.objects.filter(booking__venue_id=vid)
            overall_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
            total_ratings = reviews.count()
            rating_distribution = reviews.values('rating').annotate(count=Count('rating')).order_by('-rating')
            response_data = {
                'overall_rating': round(overall_rating, 2),
                'total_ratings': total_ratings,
                'rating_distribution': rating_distribution,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching ratings for venue {vid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching ratings. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetReviewsView(APIView) :
    permission_classes = [IsAuthenticated]

    def get(self, request, vid) :
        try:
            reviews = Review.objects.filter(booking__venue_id=vid)
            serializer = GetReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Exception occurred while fetching reviews for venue {vid}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while fetching reviews. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


#--------- Inquiries ---------   
class UserInquiryView(GenericAPIView):
    serializer_class = UserInquirySerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, uid):
        try:
            user = get_object_or_404(User, id=uid)
            data = request.data
            data['user'] = user.id

            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                send_user_inquiry_message(
                username=data.get('user_name'),
                email=data.get('email'),
                message=data.get('message')
                )
                return Response({"message":"Your message successfully submitted."},status=status.HTTP_201_CREATED)
            logger.warning(f"User inquiry validation failed. Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Exception occurred while submitting user inquiry: {str(e)}", exc_info=True)
            return Response(
                {"error": "Something went wrong while submitting your inquiry. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )