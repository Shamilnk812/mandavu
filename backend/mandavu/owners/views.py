from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.utils.encoding import smart_str,DjangoUnicodeDecodeError
from django.shortcuts import redirect
from .serializers import *
from .models import *
from users.models import Booking
from .utils import *
import base64
from django.db import transaction
from django.conf import settings
from django.core.files.base import ContentFile
from users.utils import decrypt_otp
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from django.db.models import Sum,Q
from datetime import datetime, timedelta, date as dt_date
from notifications.signals import notify_admin_on_maintenance_change
import stripe
from reportlab.lib.pagesizes import A4,A3
from reportlab.pdfgen import canvas
import io
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import inch
import requests
from .services import *
from admin_dash.models import PlatformFee
import logging
logger = logging.getLogger("mandavu")



# -------- Owner and Venue registration ---------
class RegistrationStep1(APIView) :
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            phone = request.data.get('phone')
            phone2 = request.data.get('phone2')

            if CustomUser.objects.filter(email=email).exists() :
                return Response({"message": "Owner with this email already exisit!"},status=status.HTTP_400_BAD_REQUEST)
            
            if Owner.objects.filter(phone=phone).exists() :
                return Response({"message": "Owner with this Phone number already exist!"},status=status.HTTP_400_BAD_REQUEST)
            
            if Owner.objects.filter(phone2=phone2).exists():
                return Response({"message": "Owner with this Phone number already exisit!"},status=status.HTTP_400_BAD_REQUEST)
            
            temp_registration = TempOwnerAndVenueDetails.objects.create(owner_details=request.data)
            return Response(
                {"message":"Registration Step 1 successly completed .", "registrationToken": str(temp_registration.secure_token)},
                status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error in RegistrationStep1: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegistrationStep2(APIView) :
    permission_classes = [AllowAny]

    def post(self, request, token):
        temp_registration_obj = get_object_or_404(TempOwnerAndVenueDetails, secure_token=token)
        venue_name = request.data.get('convention_center_name')
       
        if Venue.objects.filter(convention_center_name=venue_name).exists():
            return Response({"message": "Venue with this name already exists !"}, status=status.HTTP_400_BAD_REQUEST)
        
        address = request.data.get('address')
        city = request.data.get('city')
        district = request.data.get('district')
        state = request.data.get('state')
        pincode = request.data.get('pincode')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if not all([address, city, district, state, pincode]) :
            return Response({"message": "Address, state, district, city, and pincode are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not latitude or not longitude:
            return Response({"message": "Setting your location has some issue, please check your given location."})
        else:
            request.data['latitude'] = round(float(latitude), 6)
            request.data['longitude'] = round(float(longitude), 6)

        try:
            response = requests.get(f"https://api.postalpincode.in/pincode/{pincode}",headers = {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            })
            data = response.json()
           
            if data[0]['Status'] == 'Success':
                post_offices = data[0]['PostOffice']
                valid_districts = {po['District'].lower() for po in post_offices if po.get('District')}
                valid_states = {po['State'].lower() for po in post_offices if po.get('State')}
                
                if district.lower() not in valid_districts :
                    return Response({"message":"Given district is not valid"},status=status.HTTP_400_BAD_REQUEST)
                if state.lower() not in valid_states :
                    return Response({"message":"Given state is not valid."},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "Your pincode is not valid, Please enter a valid pincode."},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e :
            print(str(e))
            return Response({"messge":f"something wrong  {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
        
        temp_registration_obj.venue_details = request.data
        temp_registration_obj.save()
        return Response({"message":"Registration Step 2 is successfully completed.", "registrationToken": str(temp_registration_obj.secure_token)},status=status.HTTP_200_OK)
    

class RegistrationStep3(APIView) :
    permission_classes = [AllowAny]

    def post(self, request, token):
        try:
            temp_registration_obj = get_object_or_404(TempOwnerAndVenueDetails, secure_token=token)
            temp_registration_obj.event_details = request.data
            temp_registration_obj.save()
            return Response({"message":"Registration Step 3 successfully completed.", "registrationToken": str(temp_registration_obj.secure_token)}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error in RegistrationStep3: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class CancelRegistrationView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, token):
        try:
            temp_registration_obj = get_object_or_404(TempOwnerAndVenueDetails, secure_token=token)
            temp_registration_obj.delete()
            return Response({"message": "Registration cancelled "}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error in CancelRegistrationView: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            


class RegisterCombinedView(APIView):

    def post(self, request, token):
        try:
            temp_registration_obj = get_object_or_404(TempOwnerAndVenueDetails, secure_token=token)
            
            owner_data = temp_registration_obj.owner_details
            venue_data = temp_registration_obj.venue_details
            events = temp_registration_obj.event_details
            facilities = request.data
            venue_images = venue_data.get("venue_images", [])

            # Handle files
            try:
                decode_files(owner_data, venue_data)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # Create Owner
            owner = create_owner(owner_data)
            if isinstance(owner, Response):  
                return owner

            # Create Venue
            venue = create_venue(venue_data, owner)
            if isinstance(venue, Response):
                return venue

            # Handle Facilities
            facility_error = create_facilities(facilities, venue)
            if facility_error:
                return facility_error

            # Handle Events
            event_error = create_events(events, venue)
            if event_error:
                return event_error

            # Handle Venue Images
            venue_img_error = create_venue_images(venue_images, venue)
            if venue_img_error:
                return venue_img_error

            # Create Default Booking Package
            create_default_booking_package(venue)

            # Send OTP
            sent_otp_to_owner(owner.email)

            return Response({
                'message': 'Owner, Venue, Facilities, and Events registered successfully, OTP sent to owner email.',
                'owner': OwnerRegisterSerializer(owner).data,
                'venue': RegisterVenueSerializer(venue).data,
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Error in RegisterCombinedView: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class LoginOwnerView(GenericAPIView) :
    serializer_class = OwnerLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request) :
        try:
            serializer = self.serializer_class(data=request.data, context={'request':request})
            if serializer.is_valid() :
                response_data = serializer.validated_data
                return Response(response_data,status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Error in LoginOwnerView: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
  
class LogoutOwnerView(GenericAPIView) :
    serializer_class = LogoutOwnerSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error in owner logout view: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
   
class VerifyOwerOtp(GenericAPIView) :
    permission_classes = [AllowAny]

    def post(self, request) :
        otp_code = request.data.get('otp')
        email = request.data.get('email')
        try :
            owner = Owner.objects.get(email=email)
            otp_entry = OneTimePasswordForOwner.objects.get(owner=owner)
            decrypted_otp_code = decrypt_otp(otp_entry.code)
    
            if decrypted_otp_code == otp_code :
                if otp_entry.is_expired() :
                    return Response({'message': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
          
                if not owner.is_verified :
                    owner.is_verified = True
                    owner.save()
                    return Response({
                        'message':'Account email verified successfully'
                    },status=status.HTTP_200_OK)
                return Response({
                        'message' : 'User already verified'
                        },status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            
        except Owner.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)    
        except OneTimePasswordForOwner.DoesNotExist :
            Response({'message':'Invalid OTP'},status=status.HTTP_400_BAD_REQUEST)


class ResendOwnerOtp(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            owner = Owner.objects.get(email=email)
            sent_otp_to_owner(email)
            return Response({'message': 'OTP has been resent successfully'}, status=status.HTTP_200_OK)
        except Owner.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': f'Failed to resend OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OwnerDetailsView(GenericAPIView) :
    serializer_class = OwnerDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get(self,request,uid) :
        try:
            owner = get_object_or_404(Owner, id=uid)
            serializer = self.serializer_class(owner)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error in fetching owner details view: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OwnerAndVenueDetailsView(GenericAPIView) :
    serializer_class = OwnerAndVenueDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get(self,request,uid) :
        try:
            owner = get_object_or_404(Owner, id=uid)
            serializer = self.serializer_class(owner,context={'request': request})
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error in fetching owner And venue details : {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class UpdateOwnerView(GenericAPIView) :
    serializer_class = UpdateOwnerSerializer
    permission_classes = [IsAuthenticated]
    def put(self, request,uid) :
        try:
            owner = get_object_or_404(Owner, id=uid)
            serializer = self.serializer_class(owner, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True) :
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to update owner error: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred while updating the owner. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChangeOwnerPassword(GenericAPIView) :
    permission_classes = [IsAuthenticated]

    def post(self, request, uid) :
        try:
            owner = get_object_or_404(Owner, id=uid)
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
        
            if not old_password or not new_password :
                return Response({'message':'Old password and New password are required'},status=status.HTTP_400_BAD_REQUEST)
            if not owner.check_password(old_password) :
                return Response({'message':'Incorrect old password'},status=status.HTTP_400_BAD_REQUEST)
            owner.password = make_password(new_password)
            owner.save()
            return Response({'message':'Password changed successfully'},status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to change password for owner. Error: {e}", exc_info=True)
            return Response(
                {"message": "An unexpected error occurred while changing the password. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# ------------ Reset Password -------------
class OwnerPasswordResetRequestView(GenericAPIView):
    permission_classes = [AllowAny]

    serializer_class = OwnerPasswordResetSerializer
    def post(self, request) :
        try:
            serializer = self.serializer_class(data= request.data, context={'request':request})
            serializer.is_valid(raise_exception=True)
            return Response({'message':"a link has been sent to your email to reset password"},status=status.HTTP_200_OK)  
        
        except Exception as e:
            logger.error(f"Failed to process password reset request. Error: {str(e)}", exc_info=True)
            return Response(
                {"message": "Something went wrong. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class OwnerPasswordResetConfirmView(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token) :
        try :
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = Owner.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token) :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            
            reset_url = f"{settings.BASE_FRONT_END_URL}/owner/set-new-passwod?uidb64={uidb64}&token={token}"
            return redirect(reset_url)

        except DjangoUnicodeDecodeError :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)


class OwnerSetNewPasswordView(GenericAPIView):
    permission_classes = [AllowAny]

    serializer_class = OwnerSetNewPasswordSerializer
    def patch(self, request) :
        try:
            serializer = self.serializer_class(data = request.data)
            serializer.is_valid(raise_exception=True)
            return Response({'message':'password reset successfully '},status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("Failed to reset owner password. {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ---------- Venue Management -----------
class VenueDetailsView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VenueDetailsSerializer

    def get(self, request, uid):
        try:
            venue = get_object_or_404(Venue, owner=uid)
            serializer = self.serializer_class(venue)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch venue details for UID {uid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong during fetch venue details. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UpdateVenueView(GenericAPIView) :
    serializer_class = UpdateVenueSerializer
    permission_classes = [IsAuthenticated]
    
    def put(self, request,vid) :
        try:
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            request.data['latitude'] = round(float(latitude), 6)
            request.data['longitude'] = round(float(longitude), 6)
            venue = get_object_or_404(Venue, id=vid)
            serializer = self.serializer_class(venue, data=request.data, partial=True)    
            if serializer.is_valid(raise_exception=True) :
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to update venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

# ----------- Facilities ----------
class AddFacilitiesView(GenericAPIView):
    serializer_class = AddFacilitiesSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, vid) :
        try:
            venue = get_object_or_404(Venue, id=vid)
            data = request.data.copy()
            data['venue'] = venue.id
            serializer = self.serializer_class(data=data)
            if serializer.is_valid(raise_exception=True) :
                serializer.save()
                print(serializer.data)
                return Response({'data':serializer.data},status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to add facilities for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong dring add new facility. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class GetFacilitiesView(GenericAPIView) :
    serializer_class= GetFacilitiesSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, vid) :
        try:
            facilities = Facility.objects.filter(venue=vid)
            serializer = self.serializer_class(facilities, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch facilities for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong during fetch facilities. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class UpdateFacilitiesView(GenericAPIView) :
    serializer_class = UpdateFacilitiesSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, vid) :
        try:
            venue = get_object_or_404(Venue, id=vid) 
            facility_id = request.data.get('facility_id')
            facility = get_object_or_404(Facility, id=facility_id)
            data = request.data.copy()
            data['venue'] = venue.id
            serializer = self.serializer_class(instance=facility, data=data, partial=True)
            if serializer.is_valid(raise_exception=True) :
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to update facility for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong during update the venue facility. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    
class BlockFacilityView(GenericAPIView) :
    permission_classes = [IsAuthenticated]

    def post(self, request, vid):
        try:
            facility_id = request.data.get('facility_id')
            venue = get_object_or_404(Venue, id=vid)
            facility = get_object_or_404(Facility, id=facility_id, venue=venue)
            facility.is_active = False
            facility.save()
            return Response({"message": "Facility blocked successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to block facility ID {facility_id} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UnblockFacilityView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, vid):
        try:
            facility_id = request.data.get('facility_id')
            venue = get_object_or_404(Venue, id=vid)
            facility = get_object_or_404(Facility , id=facility_id, venue=venue)
            facility.is_active = True
            facility.save()
            return Response(status=status.HTTP_200_OK)    
        
        except Exception as e:
            logger.error(f"Failed to unblock facility ID {facility_id} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ------------ Venue Photos ----------
class AddVenuePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            venue_photo = request.data.get('venue_photo')
            try:
                venue_photo_file = decode_base64_file(venue_photo)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = AddVenuePhotoSerializer(data={
                'venue_photo': venue_photo_file,
                'venue': venue.id,
            })
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Banner added successfully"}, status=status.HTTP_201_CREATED)
           
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to add venue photo for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ShowAllVenuePhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            banner_details = VenueImage.objects.filter(venue=venue).order_by('-id')
            serializer = BannerDetailsSerializer(banner_details, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch venue photos for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BlockVenuePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, bid):
        try:
            banner_obj = get_object_or_404(VenueImage, id=bid)
            banner_obj.is_active = False 
            banner_obj.save()
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to block venue photo ID {bid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class UnblockVenuePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, bid):
        try:
            banner_obj = get_object_or_404(VenueImage, id=bid)
            banner_obj.is_active = True 
            banner_obj.save()
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to unblock venue photo ID {bid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# ----------- Events ---------
class GetAllEventsDetails(GenericAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            events = Event.objects.filter(venue=venue).order_by('-id')
            serializer = self.serializer_class(events, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch events for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong during fetch venue events. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AddEventView(GenericAPIView):
    serializer_class = CreatingEventSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            event_photo = request.FILES.get('event_photo')
            event_name  = request.data.get('event_name')
            
            if Event.objects.filter(venue=venue,event_name=event_name).exists():
                return Response({"message": "This event already exist in this veneu"},status=status.HTTP_400_BAD_REQUEST)
            
            data = {
                'event_photo': event_photo,
                'event_name': event_name,
                'venue': venue.id
            }
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"message": "New event added successfully"}, status=status.HTTP_201_CREATED)
        
        except ValidationError as ve:
            logger.warning(f"Validation error while adding event for venue {vid}: {ve}")
            return Response(
                {'message': 'Invalid data provided.', 'errors': str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Failed to add event for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class UpdateEventView(GenericAPIView):
    serializer_class = UpdateEventSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            event_id = request.data.get('event_id')
            venue = get_object_or_404(Venue, id=vid) 
            event = Event.objects.filter(id=event_id, venue=venue)
            data = request.data.copy()
            data['venue'] = venue.id
            serializer = self.serializer_class(isinstance=event, data=data, many=True)
            if serializer.is_valid() :
                return Response({"message":"Event details updated successfully"}, status=status.HTTP_200_OK)
                
            else:
                logger.warning(f"Validation errors while updating event ID {event_id} for venue {vid}: {serializer.errors}")
                return Response(
                    {'message': 'Invalid data provided.', 'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Exception as e:
            logger.error(f"Failed to update event ID {event_id} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BlockEventView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            event_id = request.data.get('event_id')
            venue = get_object_or_404(Venue, id=vid)
            event_obj = get_object_or_404(Event, id=event_id, venue=venue)
            event_obj.is_active = False
            event_obj.save()
            return Response({"message":"Event is blocked successfully"},status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to block event ID {event_id} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UnblockEventView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            event_id = request.data.get('event_id')
            venue = get_object_or_404(Venue, id=vid)
            event_obj = get_object_or_404(Event, id=event_id, venue=venue)
            event_obj.is_active = True
            event_obj.save()
            return Response({"message":"Event is unblocked successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to unblock event ID {event_id} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


#------------ Booking Packges -----------
class GetAllBookingPackagesView(GenericAPIView):
    serializer_class = BookingPackagesSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            booking_packages = BookingPackages.objects.filter(venue=venue)
            serializer = self.serializer_class(booking_packages,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch booking packages for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class AddBookingPackageView(GenericAPIView) :
    serializer_class = BookingPackagesSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, vid) :
        try:
            venue = get_object_or_404(Venue, id=vid)
            data = request.data.copy()
            data['venue'] = venue.id
            
            serializer = self.serializer_class(data=data)
            if serializer.is_valid() :
                booking_package  = serializer.save()
                
                if booking_package.price_for_per_hour.lower() != 'not allowed':
                    time_slots = []
                    start_hour = 9  # Start time: 9 AM
                    end_hour = 21  # End time: 9 PM (21:00 in 24-hour format)

                    for hour in range(start_hour, end_hour):
                        start_time = f"{hour % 12 if hour % 12 != 0 else 12} {'AM' if hour < 12 else 'PM'}"
                        end_time = f"{(hour + 1) % 12 if (hour + 1) % 12 != 0 else 12} {'AM' if (hour + 1) < 12 else 'PM'}"
                        time_slots.append({"start_time":start_time, "end_time":end_time, "is_active":True})

                    TimeSlots.objects.create(
                            booking_package=booking_package,
                            time_slots=time_slots
                        )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            else:
                logger.warning(f"Validation errors while adding booking package for venue ID {vid}: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to add booking package for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateBookingPackageView(GenericAPIView):
    serializer_class = BookingPackagesSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, vid):
        try:
            pid = request.data['package_id']
            venue = get_object_or_404(Venue, id=vid)
            booking_package = get_object_or_404(BookingPackages, id=pid, venue=venue)
            data = request.data.copy()
            data['venue'] = booking_package.venue.id
            
            serializer = self.serializer_class(booking_package, data=data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            else:
                logger.warning(f"Validation errors while updating booking package ID {pid} for venue ID {vid}: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Failed to update booking package ID {pid} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
  


class BlockBookingPackageView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            pid = request.data.get('package_id')
            venue = get_object_or_404(Venue, id=vid)
            booking_package_obj = get_object_or_404(BookingPackages, id=pid, venue=venue)
            booking_package_obj.is_active = False
            booking_package_obj.save()
            return Response({"message":"Event is blocked successfully"},status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Failed to block booking package ID {pid} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class UnblockBookingPackagesView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            pid = request.data.get('package_id')
            venue = get_object_or_404(Venue, id=vid)
            booking_package_obj = get_object_or_404(BookingPackages, id=pid, venue=venue)
            booking_package_obj.is_active = True
            booking_package_obj.save()
            return Response({"message":"Event is unblocked successfully"},status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to unblock booking package ID {pid} for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



#---------- Manage booking package time slots ---------
class GetPackageTimeSlotes(GenericAPIView):
    serializer_class = BookingPackageTimeSlotesSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            package_id = request.query_params.get('packageId')
            booking_package = get_object_or_404(BookingPackages, id=package_id,venue=venue)

            time_slots = TimeSlots.objects.filter(booking_package=booking_package)
            serializer = self.serializer_class(time_slots,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch time slots for booking package ID {package_id} in venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class BlockOrUnblockBookingPackageTimeSlote(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            package_id = request.data.get('package_id')
            time_slot_index = request.data.get('index')
            is_active = request.data.get('is_active')

            if package_id is None or time_slot_index is None or is_active is None :
                return Response(
                    {"error": "Missing required fields: 'index' or 'is_active'"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
            booking_package = get_object_or_404(BookingPackages, id=package_id, venue=venue)
            time_slot_obj = get_object_or_404(TimeSlots, booking_package =booking_package)
            time_slots = time_slot_obj.time_slots

            if time_slot_index < 0 or time_slot_index > len(time_slots) :
                return Response(
                    {"error": "Invalid time slot index"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            time_slots[time_slot_index]["is_active"] = is_active
            start_time = time_slots[time_slot_index]["start_time"]
            end_time = time_slots[time_slot_index]["end_time"]
            time_slot_obj.time_slots = time_slots
            time_slot_obj.save()

            return Response(
                {"updated_slot": {"start_time": start_time, "end_time": end_time, "is_active": is_active}},
                status=status.HTTP_200_OK
                )
        except Exception as e:
            logger.error(f"Failed to update time slot index {time_slot_index} for package ID {package_id} in venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {"message": "Something went wrong. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    

#---------- Bookings --------
class OwnerPagination(PageNumberPagination):
    page_size = 6
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


class AllBookingDetailsView(GenericAPIView):
    serializer_class = AllBookingDetailsSerializer
    pagination_class = OwnerPagination
    permission_classes = [IsAuthenticated]
    
    def get(self, request, vid):
        try:
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            all_bookings  = get_bookings_in_date_range(venue_id=vid,is_descending_order=True)     

            if start_date and end_date:
                all_bookings = get_bookings_in_date_range(venue_id=vid,start_date=start_date,end_date=end_date,is_descending_order=True)

            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(all_bookings, request)
            serializer = self.serializer_class(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        except Exception as e:
            logger.error(f"Failed to fetch bookings for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetSingleBookingDetailsView(GenericAPIView) :
    serializer_class = AllBookingDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, b_id):
        try:
            booking_obj = Booking.objects.filter(id=b_id)
            serializer = self.serializer_class(booking_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch booking details for booking ID {b_id}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class UpdateBookingStatusview(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, b_id):
        try:
            booking_obj = get_object_or_404(Booking, id=b_id)
            booking_obj.status = 'Booking Completed'
            booking_obj.save()

            PlatformFee.objects.update_or_create(
                booking=booking_obj,
                fee_collected=booking_obj.platform_fee
            )
            return Response(status=status.HTTP_200_OK) 
        
        except Exception as e:
            logger.error(f"Failed to update booking status for booking ID {b_id}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ----------- Manage Booking Slotes ----------

class GetAllBookingSlotes(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, vid):
        try:
            today = dt_date.today()
            result = []

            bookings = Booking.objects.filter(venue_id=vid, status="Booking Confirmed")
            for booking in bookings:
                for d in booking.dates:
                    try:
                        d_obj = datetime.strptime(d, "%Y-%m-%d").date()
                        if d_obj >= today:  
                            result.append({
                                "date": d,
                                "status": booking.status
                            })
                    except ValueError:
                        logger.warning(f"Invalid date format '{d}' in booking ID {booking.id}, skipping...")
                        continue  

            unavailables = UnavailableDate.objects.filter(venue_id=vid, date__gte=today)
            for un in unavailables:
                result.append({
                    "date": str(un.date),
                    "status": "Unavailable"
                })

            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch booking slots for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {"message": "Something went wrong. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    


class ManageUnavailableDates(APIView):
    permission_classes = [IsAuthenticated]

    # make a date as unavailable 
    def _add_date(self, venue, selected_date_obj, selected_date):
        obj, created = UnavailableDate.objects.get_or_create(
            venue=venue, date=selected_date_obj
        )
        if created:
            return Response(
                {"message": f"Date {selected_date} marked as unavailable"},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"warning": f"Date {selected_date} is already marked unavailable"},
            status=status.HTTP_200_OK,
        )

    # remove unavailbale date 
    def _remove_date(self, venue, selected_date_obj, selected_date):
        deleted, _ = UnavailableDate.objects.filter(
            venue=venue, date=selected_date_obj
        ).delete()
        if deleted:
            return Response(
                {"message": f"Date {selected_date} is now available"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"warning": f"Date {selected_date} was not marked unavailable"},
            status=status.HTTP_200_OK,
        )


    def post(self, request, vid):
        action = request.data.get("action")
        selected_date = request.data.get("date")

        if not action or not selected_date:
            return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            selected_date_obj = datetime.strptime(selected_date, "%Y-%m-%d").date()

            venue = Venue.objects.get(id=vid)
        except ValueError:
            return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)
        except Venue.DoesNotExist:
            return Response({"error": "Venue not found"}, status=status.HTTP_404_NOT_FOUND)
    
        if selected_date_obj < dt_date.today():
            return Response({"error": "You cannot block a past date"}, status=status.HTTP_400_BAD_REQUEST,)
        
        booking_exists = Booking.objects.filter(
            venue=venue,
            status="Booking Confirmed",
            dates__contains=[selected_date]  
        ).exists()

        if booking_exists:
            return Response(
                {"error": f"Date {selected_date} is already booked. Cannot mark unavailable."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    
        # manage date based on action 
        if action == "add":
            return self._add_date(venue, selected_date_obj, selected_date)
        elif action == "remove":
            return self._remove_date(venue, selected_date_obj, selected_date)
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)



# ----------- Veneu Maintenance -------------
class SetVenueMaintenanceView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            maintenance_reason = request.data.get('reason')
            start_date = request.data.get('start_date')
            end_date = request.data.get('end_date')

            venue = get_object_or_404(Venue, id=vid)
            previous_status = venue.is_under_maintenance 
            all_bookings = get_bookings_in_date_range(venue_id=venue.id, start_date=start_date, end_date=end_date )
            
            with transaction.atomic():
                for booking in all_bookings:
                    if booking.status == "Booking Confirmed" :
                        if booking.payment_intent_id :
                            refund = stripe.Refund.create(
                                payment_intent=booking.payment_intent_id,
                                amount=int(booking.booking_amount * 100)
                            )
                            booking.cancel_reason = maintenance_reason
                            booking.status = 'Booking Canceled'
                            booking.save()

                venue.is_under_maintenance = True
                venue.maintenance_reason = maintenance_reason
                venue.maintenance_start_date = start_date
                venue.maintenance_end_date = end_date
                venue.save()

                if previous_status != venue.is_under_maintenance:
                    notify_admin_on_maintenance_change(venue)

            return Response({'message':'Venue maintenance details have been successfully updated.'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to set maintenance for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RemoveVenueMaintenanceView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, vid):
        try:
            venue = get_object_or_404(Venue, id=vid)
            previous_status = venue.is_under_maintenance 
            venue.is_under_maintenance = False
            venue.maintenance_reason = ''
            venue.maintenance_start_date = None
            venue.maintenance_end_date = None
            venue.save()

            if previous_status != venue.is_under_maintenance:
                notify_admin_on_maintenance_change(venue)

            return Response(
                {'message':'Venue maintenance details Removed successfully.'},
                status=status.HTTP_200_OK
                )
        
        except Exception as e:
            logger.error(f"Failed to remove maintenance for venue ID {vid}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ---------- Dashboard ---------
class TotalRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            selected_view = request.GET.get('view', 'monthly')
            venue_id = request.GET.get('venue_id') 
            if not venue_id:
                return Response({'error': 'Venue ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            bookings = Booking.objects.filter(venue=venue_id)
            revenue_data = None
            now = datetime.now()
            
            if selected_view == 'daily':
                start_date = now - timedelta(days=7)
                revenue_data = bookings.filter(
                    status='Booking Completed',
                    created_at__gte=start_date
                ).annotate(
                    day=TruncDay('created_at')
                ).values('day').annotate(
                    total_revenue=Sum('total_price')
                ).order_by('day')

            elif selected_view == 'weekly':
                start_date = now - timedelta(weeks=7)
                revenue_data = bookings.filter(
                    status='Booking Completed',
                    created_at__gte=start_date
                ).annotate(
                    week=TruncWeek('created_at')
                ).values('week').annotate(
                    total_revenue=Sum('total_price')
                ).order_by('week')

            elif selected_view == 'monthly':
                start_date = now.replace(day=1) - timedelta(days=7*30)
                revenue_data = bookings.filter(
                    status='Booking Completed',
                    created_at__gte=start_date
                ).annotate(
                    month=TruncMonth('created_at')
                ).values('month').annotate(
                    total_revenue=Sum('total_price')
                ).order_by('month')

            elif selected_view == 'yearly':
                start_date = now.replace(month=1, day=1) - timedelta(days=7*365)
                revenue_data = bookings.filter(
                    status='Booking Completed',
                    created_at__gte=start_date
                ).annotate(
                    year=TruncYear('created_at')
                ).values('year').annotate(
                    total_revenue=Sum('total_price')
                ).order_by('year')

            else:
                return Response({'error': 'Invalid view selected'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'data': list(revenue_data)}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to fetch revenue data for venue ID {venue_id}. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class GetBookingsStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            venue = request.GET.get('venue_id')
            venue_obj = get_object_or_404(Venue, id=venue)
        
            confirmed_count = Booking.objects.filter(venue=venue,status='Booking Confirmed').count()
            completed_count = Booking.objects.filter(venue=venue,status='Booking Completed').count()
            cancelled_count = Booking.objects.filter(venue=venue,status='Booking Canceled').count()
            total_revenue = Booking.objects.filter(venue=venue,status='Booking Completed').aggregate(total_revenue=Sum('total_price'))['total_revenue'] or 0
            maintenance_status = venue_obj.is_under_maintenance
            data = [
                {"label": "Confirmed", "value": confirmed_count},
                {"label": "Completed", "value": completed_count},
                {"label": "Canceled", "value": cancelled_count},
                {"total_revenue":total_revenue},
                {"maintenance_status":maintenance_status}
            ]
            return Response(data,status=status.HTTP_200_OK)    
        
        except Exception as e:
            logger.error(f"Failed to fetch booking status for venue. Error: {e}", exc_info=True)
            return Response(
                {'message': 'Something went wrong. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


# ----------- Generate sales report ---------
class GenerateSalesReport(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        venue_id = request.data.get('venue_id')

        if not start_date or not end_date or not venue_id:
            return Response({"error": "start date or end date missing. Please add valid dates"}, status=400)
        
        try:
            formatted_start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%d %B, %Y")
            formatted_end_date = datetime.strptime(end_date, "%Y-%m-%d").strftime("%d %B, %Y")
            all_booking = get_bookings_in_date_range(venue_id=venue_id ,start_date = start_date, end_date=end_date, is_descending_order=False)   
            
            if not all_booking:
                return Response({"error": "No records found for the selected date range."}, status=400)
            
            pdf_buffer = build_pdf(all_booking, formatted_start_date, formatted_end_date)
            response = HttpResponse(pdf_buffer, content_type="application/pdf")
            response["Content-Disposition"] = 'attachment; filename="sales_report.pdf"'
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=500)