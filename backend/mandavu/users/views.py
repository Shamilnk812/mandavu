from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
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

from django.http import HttpResponse
import json
from datetime import datetime
from django.db.models import Avg,Count,F,FloatField, ExpressionWrapper,Q
from django.db.models.functions import ACos, Cos, Radians, Sin
from decimal import Decimal





# Create your views here.



class RegisterUserView(GenericAPIView) :
    serializer_class = UserRegisterSerializer

    def post(self, request) :
        user_data = request.data
        print(user_data['email'])
        serializer = self.serializer_class(data=user_data)
        if serializer.is_valid() :
            serializer.save()
            user = serializer.data
            sent_otp_to_user(user['email'])
            return Response({
                'data' :user,
                'message' :f"Hi thanks for singing up a OTP has be sent to your email "
            },status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoginUserView(GenericAPIView) :
    serializer_class = UserLoginSerializer
    def post(self, request) :
        serializer = self.serializer_class(data=request.data, context={'request':request})
        if serializer.is_valid() :
            response_data = serializer.validated_data
            return Response(response_data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


class LogoutUserView(GenericAPIView) :
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)



class UpdateUserView(GenericAPIView) :
    serializer_class = UpdateUserSerializer

    def put(self, request,uid) :
        user = get_object_or_404(User, pk=uid)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class UserDetailsView(GenericAPIView) :
    serializer_class = UserDetailsSerializer
    def get(self, request,uid) :
        user = get_object_or_404(User, pk=uid)
        serializer = self.serializer_class(user) 
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ChangeUserPassword(GenericAPIView) :
    def post(self, request,uid) :
        user = get_object_or_404(User, pk=uid)
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        print(old_password)
        if not old_password or not new_password :
            return Response({'message':'old password and New password are required'},status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(old_password) :
            return Response({'message':'Incorrect old password'},status=status.HTTP_400_BAD_REQUEST)
 
        print(new_password)
        user.password = make_password(new_password)
        user.save()
        return Response({'message':'Password changed successfully'},status=status.HTTP_200_OK)



class VerifyToken(APIView):
    permission_classes = [IsAuthenticated]

    def post(self , request):
        print('tooooooooken chekking ---------------------------------------------------')
        return Response({"message":"token is valid"},status=status.HTTP_200_OK)

#=====================================================================

    
class VerifyUserOtp(GenericAPIView) :
    def post(self, request) :
        otp_code = request.data.get('otp')
        email = request.data.get('email')
        print(email,otp_code)
        try :
            user = User.objects.get(email=email)
            otp_entry = OneTimePassword.objects.get(user=user)

            decrypted_otp_code = decrypt_otp(otp_entry.code)
            print(decrypted_otp_code)
            if decrypted_otp_code == otp_code :
                print(otp_code)

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

# ============= Password Reset ==================

class PasswordResetRequestView(GenericAPIView) :
    serializer_class = PasswordResetRequestSerializer
    def post(self, request) :
        serializer = self.serializer_class(data= request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':"a link has been sent to your email to reset password"},status=status.HTTP_200_OK)  



class PasswordResetConfirm(GenericAPIView) :
    def get(self, request, uidb64, token) :
        try :
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token) :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            # return Response({'success':True,'message':'credentials is valid','uidb64':uidb64,'token':token},status=status.HTTP_200_OK)
            reset_url = f"http://localhost:5173/user/set-new-passwod?uidb64={uidb64}&token={token}"
            return redirect(reset_url)
        except DjangoUnicodeDecodeError :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)



class SetNewPassword(GenericAPIView) :
    serializer_class= SetNewPasswordSerializer

    def patch(self, request) :
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message':'password reset successfully '},status=status.HTTP_200_OK)
    



# =================  ================

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
    pagination_class = UserPagination

    def get(self, request):
       
        search_query = request.GET.get('search', '')
        dining_seat_count = request.GET.get('dining_seat_count')
        auditorium_seat_count = request.GET.get('auditorium_seat_count')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        user_latitude = request.GET.get('latitude')
        user_longitude = request.GET.get('longitude')


        # Convert user latitude and longitude to Decimal
        new_latitude = None
        new_longitude = None
        
        if user_latitude not in [None, '0', '']:
            new_latitude = Decimal(user_latitude) 
            
        
        if user_longitude not in [None, '0', '']:
            new_longitude = Decimal(user_longitude) 
           
        queryset = Venue.objects.filter(is_active=True, is_verified=True,owner__is_active=True )
        if search_query:
            queryset = queryset.filter(
                Q(convention_center_name__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(state__icontains=search_query) |
                Q(district__icontains=search_query)
            )
                
    
        if dining_seat_count  not in [None, '0', ''] :
            print('iaaadfdaf')
            new_dining_seat_count = int(dining_seat_count)
            queryset = queryset.filter(dining_seat_count__lte=new_dining_seat_count)
            print(queryset)

        if auditorium_seat_count  not in [None, '0', ''] :
            print('asdkfa')
            new_auditorium_seat_count = int(auditorium_seat_count)
            queryset = queryset.filter(auditorium_seat_count__lte=new_auditorium_seat_count)
              
        if min_price not in [None, ''] and max_price not in [None, '0', '']:
            new_min = int(min_price)
            new_max = int(max_price)
            queryset = queryset.filter(price__gte=new_min, price__lte=new_max)   
            

        if new_latitude is not None  and new_longitude is not None :
            # Distance calculation 
            queryset = queryset.annotate(
                distance=ExpressionWrapper(
                    6371 * ACos(
                        Cos(Radians(new_latitude)) *
                        Cos(Radians(F('latitude'))) *
                        Cos(Radians(F('longitude')) - Radians(new_longitude)) +
                        Sin(Radians(new_latitude)) *
                        Sin(Radians(F('latitude')))
                    ),
                    output_field=FloatField()
                )
            ).order_by('distance')    
           
           
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

 
    

class SingleVenueDetailsView(GenericAPIView) :
    serializer_class = SingleVenueDetailsSerializer
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        serializer = self.serializer_class(venue, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    

class SingleVenueEventsDetails(GenericAPIView) :
    serializer_class = SingleVenueEventsDetailsSerializer
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        event = Event.objects.filter(venue=venue)
        serializer = self.serializer_class(event, many=True, context={'request': request} )
        return Response(serializer.data, status=status.HTTP_200_OK)
        




# ============= Stripe Payment  =========




class CreateCheckOutSession(APIView):
    def post(self, request):
        amount = request.data.get('bookingAmount')
        venue_name = request.data.get('venueName')
        venue_id = request.data.get('venueId')
        user_id  = request.data.get('userId')

        user = get_object_or_404(User, id=user_id)
        venue = get_object_or_404(Venue, id=venue_id)

        temp_booking = TempBooking.objects.create(
            user=user,
            venue=venue,
            data=request.data
        )

        # booking_details = request.data

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'inr',
                            'unit_amount': int(amount) * 100,  # Convert to cents
                            'product_data': {
                                'name': venue_name,
                            },
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=settings.SITE_URL + '?success=true',
                cancel_url=settings.SITE_URL + '?canceled=true',
                 metadata={
                    'temp_booking_id': temp_booking.id   # Send all request data as metadata
                }
            )
            return Response({'id': checkout_session.id})
        except stripe.error.StripeError as e:
            return Response({'msg': 'Stripe error', 'error': str(e)}, status=500)
        except Exception as e:
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

        temp_booking = get_object_or_404(TempBooking, id=temp_booking_id)

        booking_details = temp_booking.data

        booking_package_id = booking_details['bookingPackage']
        booking_package = get_object_or_404(BookingPackages, id=booking_package_id)
        
        # user_id  = booking_details['userId']
        # venue_id = booking_details['venueId']
        # date_str = booking_details['date']
        # user = get_object_or_404(User, id=user_id)
        # venue = get_object_or_404(Venue, id=venue_id)

        # try:
        #     date = datetime.strptime(booking_details['date'], '%Y-%m-%d').date()  # Adjust the format if necessary
        # except ValueError:
        #     return Response(status=400)  # Invalid date format


        booking = Booking.objects.create(
            user=temp_booking.user,  # Set to None if user info is not available
            venue=temp_booking.venue,
            name=booking_details['fullName'],  # Data from frontend
            # email=booking_details['email'],  ############
            phone=booking_details['phoneNumber'],
            additional_phone=booking_details['additionalPhoneNumber'],
            city=booking_details['city'],
            state=booking_details['state'],
            address=booking_details['fullAddress'],
            # time=booking_details['timeOfDay'],  ########
            # date=date, ########
            condition=booking_details['airConditioning'],
            extra_ac_price=booking_details['extraAcAmount'],
            total_price=booking_details['totalAmount'],
            booking_amount=booking_details['bookingAmount'],  # Assuming 15% booking amount
            remaining_amount=booking_details['remainingAmount'],
            payment_intent_id=session['payment_intent'] ,
            times = booking_details['times'],
            dates = booking_details['dates'],
            event_name = booking_details['eventName'],
            event_details = booking_details['eventDetails'],
            package_type = booking_package,
            package_name=booking_details['packageName']
            
        )

        facilities = booking_details['facilities']
        print('cheeeeking ', facilities)
        for f in facilities:
            BookingDetails.objects.create(
                booking=booking,
                facilities=f"{f['facility']} - {f['price']}"
            )

        # Send Booking confirmation Email 
        send_venue_booking_confirmation_email(booking, facilities)
        
        temp_booking.delete()
        
        



        print('Booking created successfully with facilities', session)

    return HttpResponse(status=200)    



#================== Boooking 2 ===========


class GetBookedDates(APIView):
    def get(self, request, vid):
        venue = get_object_or_404(Venue, id=vid)
        bookings = Booking.objects.filter(venue=venue, status="Booking Confirmed")
        booking_package = request.query_params.get("booking_package")  # Use query params

        if booking_package == "regular":
            # Scenario 1: Fetch all dates
            # booked_dates = bookings.values_list("dates", flat=True)  # Fetch from `dates` field
            booked_dates = bookings.filter(package_type__package_name="regular").values_list("dates", flat=True)
            flattened_dates = [date for sublist in booked_dates for date in sublist]  # Flatten nested lists
            unique_dates = list(set(flattened_dates))  # Remove duplicates
            result = [{"date": date} for date in unique_dates]
        # else:
        #     # Scenario 2: Fetch dates with aggregated time slot counts
        #     date_slot_count = {}
        #     for booking in bookings:
        #         if booking.dates and booking.times:
        #             for date in booking.dates:
        #                 if date not in date_slot_count:
        #                     date_slot_count[date] = 0
        #                 # Increment by the count of time slots
        #                 date_slot_count[date] += len(booking.times)

        #     result = [
        #         {"date": date, "booked_time_slots_count": count}
        #         for date, count in date_slot_count.items()
        #     ]
        else :
            date_slot_count = {}
            for booking in bookings:
                if booking.dates and booking.times:
                    # Filter out unwanted time slots
                    filtered_times = [
                        time for time in booking.times if time not in ["Morning", "Evening", "Full Day"]
                    ]

                    # Only process bookings with remaining valid time slots
                    if len(filtered_times) > 0:
                        for date in booking.dates:
                            if date not in date_slot_count:
                                date_slot_count[date] = 0
                            # Increment by the count of filtered time slots
                            date_slot_count[date] += len(filtered_times)

            result = [
                {"date": date, "booked_time_slots_count": count}
                for date, count in date_slot_count.items()
            ]

        return Response(result, status=status.HTTP_200_OK)
    


class GetBookedTimeSlotsForASelectedDate(APIView):

    def get(self, request,vid):
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


# ==================   Booking =================

class ShowBookingDetailsForCalandar(GenericAPIView) :
    serializer_class = ShowBookingDetailsForCalandarSerializer

    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid) 
        bookings = Booking.objects.filter(venue=venue)
        serializer = self.serializer_class(bookings,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



        # paginator = self.pagination_class()
        # result_page = paginator.paginate_queryset(bookings, request)
        # serializer = self.serializer_class(result_page, many=True)

        # return paginator.get_paginated_response(serializer.data)
    

class ShowBookingListView(GenericAPIView) :
    serializer_class = ShowBookingListSerializer
    pagination_class = CustomPagination
    def get(self, request, uid) :
        page = request.query_params.get('page', 1)

        user = get_object_or_404(User, id=uid)
        all_bookings = Booking.objects.filter(user=user).order_by('-id')
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(all_bookings, request)
        serializer = self.serializer_class(result_page , many=True)

        return paginator.get_paginated_response(serializer.data)

       
        # return Response(serializer.data, status=status.HTTP_200_OK)


class ShowSingleBookingDetails(GenericAPIView) :
    serializer_class = ShowBookingListSerializer
    def get(self, request, bid) :
        booking_obj = get_object_or_404(Booking, id=bid)
        serializer = self.serializer_class(booking_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class CancelBookingView(GenericAPIView) :
    def post(self, request, bid) :
        cancel_reason = request.data.get('reason')
        is_user = request.data.get('user')
        
        booking_obj = get_object_or_404(Booking, id=bid)
        # booking_obj.cancel_reason = cancel_reason
        # booking_obj.status = 'Booking Canceled'
        # booking_obj.save()
        # return Response({"message": "Booking canceled and refund processed successfully."}, status=status.HTTP_200_OK)


        try :
            
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
 
            if booking_obj.payment_intent_id :
                refund = stripe.Refund.create(
                    payment_intent=booking_obj.payment_intent_id,
                    amount=int(refund_amount * 100)
                )

                booking_obj.cancel_reason = cancel_reason
                booking_obj.status = 'Booking Canceled'
                booking_obj.save()


                return Response({"message": "Booking canceled and refund processed successfully."}, status=status.HTTP_200_OK)
            else:
                 return Response({"error": "No payment information found."}, status=status.HTTP_400_BAD_REQUEST)
        
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





#-------------- ADD VENUE REVIEWS ----------


class AddReviewView(APIView) :
    def post(self, request) :
        serializer = AddReviewSerializer(data=request.data)
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)
    

class ShowRatingView(APIView) :
    def get(self, request, vid):
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


class GetReviewsView(APIView) :
    def get(self, request, vid) :
        reviews = Review.objects.filter(booking__venue_id=vid)
        serializer = GetReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




#------------------ Inquiries from user side ------------   


class UserInquiryView(GenericAPIView):
    serializer_class = UserInquirySerializer
    
    def post(self, request, uid):
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
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

     


         
