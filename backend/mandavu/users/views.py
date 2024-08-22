from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import OneTimePassword,Booking,BookingDetails
from .utils import sent_otp_to_user,encrypt_otp,decrypt_otp
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str,DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password

from rest_framework import generics
from rest_framework.views import APIView

import stripe
from django.conf import settings
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from django.http import HttpResponse
import json
from datetime import datetime




# Create your views here.



class RegisterUserView(GenericAPIView) :
    serializer_class = UserRegisterSerializer

    def post(self, request) :
        user_data = request.data
        print(user_data['email'])
        serializer = self.serializer_class(data=user_data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            user = serializer.data
            sent_otp_to_user(user['email'])
            return Response({
                'data' :user,
                'message' :f"hi thanks for singing up a OTP has be sent to your email "
            },status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoginUserView(GenericAPIView) :
    serializer_class = UserLoginSerializer
    def post(self, request) :
        serializer = self.serializer_class(data=request.data, context={'request':request})
        if serializer.is_valid(raise_exception=True) :
            response_data = serializer.validated_data
            return Response(response_data, status=status.HTTP_200_OK)
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


class AllVenuesListView(GenericAPIView):
    serializer_class = VenuesListSerializer

    def get(self, request):
        search_query = request.GET.get('search', '')
        queryset = Venue.objects.filter(is_active=False , is_verified=True)
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SingleVenueDetailsView(GenericAPIView) :
    serializer_class = SingleVenueDetailsSerializer
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        serializer = self.serializer_class(venue, context={'request': request})
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

        booking_details = request.data

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
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
                    'booking_details': json.dumps(booking_details)  # Send all request data as metadata
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
        booking_details = json.loads(session['metadata']['booking_details']) 
        
        user_id  = booking_details['userId']
        venue_id = booking_details['venueId']
        date_str = booking_details['date']
        user = get_object_or_404(User, id=user_id)
        venue = get_object_or_404(Venue, id=venue_id)

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()  # Adjust the format if necessary
        except ValueError:
            return Response(status=400)  # Invalid date format


        booking = Booking.objects.create(
            user=user,  # Set to None if user info is not available
            venue=venue,
            name=booking_details['fullName'],  # Data from frontend
            email=booking_details['email'],
            phone=booking_details['phoneNumber'],
            additional_phone=booking_details['additionalPhoneNumber'],
            city=booking_details['city'],
            state=booking_details['state'],
            address=booking_details['fullAddress'],
            time=booking_details['timeOfDay'],
            date=date,
            condition=booking_details['airConditioning'],
            total_price=booking_details['totalAmount'],
            booking_amount=booking_details['bookingAmount']  # Assuming 15% booking amount
            
        )

        facilities = booking_details.get('facilities', [])
        for facility in facilities:
            # facility_str = f"{facility['facility']} - {facility['price']}"
            BookingDetails.objects.create(
                booking=booking,
                facilities=facility
            )

        print('Booking created successfully with facilities', session)

    return HttpResponse(status=200)    




# ==================   Booking =================

class ShowBookingDetailsForCalandar(GenericAPIView) :
    serializer_class = ShowBookingDetailsForCalandarSerializer

    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid) 
        bookings = Booking.objects.filter(venue=venue)
        serializer = self.serializer_class(bookings,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ShowBookingListView(GenericAPIView) :
    serializer_class = ShowBookingListSerializer
    def get(self, rquest, uid) :
        user = get_object_or_404(User, id=uid)
        all_bookings = Booking.objects.filter(user=user)
        serializer = self.serializer_class(all_bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ShowSingleBookingDetails(GenericAPIView) :
    serializer_class = ShowBookingListSerializer
    def get(self, request, bid) :
        booking_obj = get_object_or_404(Booking, id=bid)
        serializer = self.serializer_class(booking_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class CancelBookingView(GenericAPIView) :
    def post(self, request, bid) :
        cancel_reason = request.data.get('reason')
        print(cancel_reason)
        booking_obj = get_object_or_404(Booking, id=bid)
        booking_obj.cancel_reason = cancel_reason
        booking_obj.status = 'Booking Canceled'
        booking_obj.save()
        return Response(status=status.HTTP_200_OK)


    



        
         
