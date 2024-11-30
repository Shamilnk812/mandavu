from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.utils.encoding import smart_str,DjangoUnicodeDecodeError
from django.shortcuts import redirect
from .serializers import *
from .models import *
from users.models import Booking
from .utils import sent_otp_to_owner,decode_base64_file
import base64
from django.core.files.base import ContentFile
from users.utils import decrypt_otp
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from django.db.models import Sum
from datetime import datetime, timedelta

# Create your views here.



# class RegisterOwnerView(GenericAPIView) :
#     serializer_class = OwnerRegisterSerializer

#     def post(self, request) :
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid(raise_exception=True) :
#             serializer.save()
#             owner = serializer.data
#             sent_otp_to_owner(owner['email'])
#             return Response({
#                 'data':owner,
#                 'message':f"hi thanks for singing up a OTP has be sent to your email"
#             },status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

            


class RegisterCombinedView(APIView):

    def post(self, request):
        owner_data = request.data.get('owner')
        venue_data = request.data.get('venue')
        events = request.data.get('events')
        facilities = request.data.get('facilities')
        venue_images = request.data.get('venue_images')
    
        id_proof_base64 = owner_data.get('id_proof')
        venue_license_base64 = venue_data.get('venue_license')
        venue_terms_and_conditions = venue_data.get('terms_and_conditions')
        
        if id_proof_base64 or venue_license_base64 or venue_terms_and_conditions:
            try:
                id_proof_file = decode_base64_file(id_proof_base64)
                venue_license_file = decode_base64_file(venue_license_base64)
                venue_terms_and_conditions_file = decode_base64_file(venue_terms_and_conditions,'pdf')
                owner_data['id_proof'] = id_proof_file
                venue_data['venue_license'] = venue_license_file
                venue_data['terms_and_conditions'] = venue_terms_and_conditions_file
                
            except ValueError as e:
                print(f"Error decoding base64 file: {e}")  
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        owner_serializer = OwnerRegisterSerializer(data=owner_data)
        if owner_serializer.is_valid():
            owner = owner_serializer.save()
        else:
            print('error is ',owner_serializer.errors)
            return Response(owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        venue_data['owner'] = owner.id 
        venue_serializer = RegisterVenueSerializer(data=venue_data)
        if venue_serializer.is_valid():
            venue = venue_serializer.save()
        else:
            return Response(venue_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        
        # Handle Facilities
        if facilities:
            for facility_data in facilities:
                facility_serializer = CreatingFacilitySerializer(data={
                    'facility': facility_data.get('facility'),
                    'price': facility_data.get('price', 'FREE'),
                    'venue': venue.id,
                })
                if facility_serializer.is_valid():
                    facility_serializer.save()
                else:
                    return Response(facility_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
            
        # Handle Events
        if events:
            for event_data in events:
                event_name = event_data.get('name')
                event_base64_image = event_data.get('image')
                try:
                    event_photo_file = decode_base64_file(event_base64_image)
                except ValueError as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)     
                
                event_serializer = CreatingEventSerializer(data={
                    'event_name': event_name,
                    'event_photo': event_photo_file,
                    'venue': venue.id,
                })
                if event_serializer.is_valid():
                    event_serializer.save()
                else:
                    return Response(event_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

        # Handle Venue Images
        if venue_images:
            for venue_photo in venue_images:
                try:
                    venue_photo_file = decode_base64_file(venue_photo)
                except ValueError as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
                venue_photo_serializer = AddVenuePhotoSerializer(data={
                    'venue_photo': venue_photo_file,
                    'venue': venue.id,
                })
                if venue_photo_serializer.is_valid():
                    venue_photo_serializer.save()
                else:
                    print('eoorr;',venue_photo_serializer.errors)
                    return Response(venue_photo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        sent_otp_to_owner(owner.email)        

        return Response({
            'message': 'Owner, Venue, Facilities, and Events registered successfully, OTP sent to owner email.',
            'owner': owner_serializer.data,
            'venue': venue_serializer.data,
        }, status=status.HTTP_201_CREATED)




class LoginOwnerView(GenericAPIView) :
    serializer_class = OwnerLoginSerializer
    def post(self, request) :
        print(request.data)
        serializer = self.serializer_class(data=request.data, context={'request':request})
        if serializer.is_valid() :
            response_data = serializer.validated_data
            print(response_data)
            return Response(response_data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LogoutOwnerView(GenericAPIView) :
    serializer_class = LogoutOwnerSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print('logout successfully')
        return Response(status=status.HTTP_200_OK)





class OwnerDetailsView(GenericAPIView) :
    serializer_class = OwnerDetailsSerializer
    def get(self,request,uid) :
        owner = get_object_or_404(Owner, id=uid)
        serializer = self.serializer_class(owner)
        return Response(serializer.data,status=status.HTTP_200_OK)



class TotalRevenueView(APIView):
    def get(self, request):
        selected_view = request.GET.get('view', 'monthly')
        venue_id = request.GET.get('venue_id')  # Get venue_id from query params
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
    


class GetBookingsStatusView(APIView)  :
    def get(self, request) :
        venue = request.GET.get('venue_id')
        print('veneu id ',venue)
        confirmed_count = Booking.objects.filter(venue=venue,status='Booking Confirmed').count()
        completed_count = Booking.objects.filter(venue=venue,status='Booking Completed').count()
        cancelled_count = Booking.objects.filter(venue=venue,status='Booking Canceled').count()
        total_revenue = Booking.objects.filter(venue=venue,status='Booking Completed').aggregate(total_revenue=Sum('total_price'))['total_revenue'] or 0

        data = [
            {"label": "Confirmed", "value": confirmed_count},
            {"label": "Completed", "value": completed_count},
            {"label": "Canceled", "value": cancelled_count},
            {"total_revenue":total_revenue}
        ]

        return Response(data,status=status.HTTP_200_OK)    
    
#==========================================

class OwnerAndVenueDetailsView(GenericAPIView) :
    serializer_class = OwnerAndVenueDetailsSerializer
    

    def get(self,request,uid) :
        owner = get_object_or_404(Owner, id=uid)
        serializer = self.serializer_class(owner,context={'request': request})
        return Response(serializer.data,status=status.HTTP_200_OK)
        


class UpdateOwnerView(GenericAPIView) :
    serializer_class = UpdateOwnerSerializer
    def put(self, request,uid) :
        owner = get_object_or_404(Owner, id=uid)
        serializer = self.serializer_class(owner, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class ChangeOwnerPassword(GenericAPIView) :
    def post(self, request, uid) :
        owner = get_object_or_404(Owner, id=uid)
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        print(old_password)
        print(new_password)
        if not old_password or not new_password :
            return Response({'message':'Old password and New password are required'},status=status.HTTP_400_BAD_REQUEST)
        if not owner.check_password(old_password) :
             return Response({'message':'Incorrect old password'},status=status.HTTP_400_BAD_REQUEST)
        owner.password = make_password(new_password)
        owner.save()
        return Response({'message':'Password changed successfully'},status=status.HTTP_200_OK)



# class VerifyOwerOtp(GenericAPIView) :
#     def post(self, request) :
#         opt_code = request.data.get('otp')
#         email = request.data.get('email')

#         try :
#             owner = Owner.objects.get(email=email)
#             owner_code_obj = OneTimePasswordForOwner.objects.get(owner=owner)
#             owner = owner_code_obj.owner
#             if not owner.is_verified :
#                 owner.is_verified = True
#                 owner.save()
#                 return Response({'message':'account email verified successfully'},status=status.HTTP_200_OK)
#             return Response({
#                      'message' : 'OTP is invlid user already verified'
#                      },status=status.HTTP_204_NO_CONTENT) 
#         except OneTimePasswordForOwner.DoesNotExist :
#             Response({'message':'OTP not provided '},status=status.HTTP_400_BAD_REQUEST)


   
class VerifyOwerOtp(GenericAPIView) :
    def post(self, request) :
        otp_code = request.data.get('otp')
        email = request.data.get('email')
        print(email,otp_code)
        try :
            owner = Owner.objects.get(email=email)
            otp_entry = OneTimePasswordForOwner.objects.get(owner=owner)

            decrypted_otp_code = decrypt_otp(otp_entry.code)
            print(decrypted_otp_code)
            if decrypted_otp_code == otp_code :
                print(otp_code)

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


class OwnerPasswordResetRequestView(GenericAPIView):
    serializer_class = OwnerPasswordResetSerializer
    def post(self, request) :
        serializer = self.serializer_class(data= request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':"a link has been sent to your email to reset password"},status=status.HTTP_200_OK)  


class OwnerPasswordResetConfirmView(GenericAPIView):
    def get(self, request, uidb64, token) :
        try :
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = Owner.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token) :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            # return Response({'success':True,'message':'credentials is valid','uidb64':uidb64,'token':token},status=status.HTTP_200_OK)
            reset_url = f"http://localhost:5173/owner/set-new-passwod?uidb64={uidb64}&token={token}"
            return redirect(reset_url)

        except DjangoUnicodeDecodeError :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)


class OwnerSetNewPasswordView(GenericAPIView):
    serializer_class = OwnerSetNewPasswordSerializer
    def patch(self, request) :
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message':'password reset successfully '},status=status.HTTP_200_OK)

# ================== VENUE MANAGEMENT =================

# class  VenueRegisterView(GenericAPIView) :
#     serializer_class = RegisterVenueSerializer
#     def post(self, request) :
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid(raise_exception=True) :
#             serializer.save()
#             print(serializer.data)
#             return Response({'data':serializer.data,
#                              'message':'Your Venue is Registerd waiting for admin approval'},
#                                status=status.HTTP_201_CREATED)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


class VenueDetailsView(GenericAPIView):
    serializer_class = VenueDetailsSerializer
    def get(self, request, uid):
        venue = get_object_or_404(Venue, owner=uid)
        serializer = self.serializer_class(venue)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateVenueView(GenericAPIView) :
    serializer_class = UpdateVenueSerializer
    def put(self, request,vid) :
        venue = get_object_or_404(Venue, id=vid)
        serializer = self.serializer_class(venue, data=request.data, partial=True)    
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


#============  FACILITIES ============

class AddFacilitiesView(GenericAPIView):
    serializer_class = AddFacilitiesSerializer
    def post(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        data = request.data.copy()
        data['venue'] = venue.id
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            print(serializer.data)
            return Response({'data':serializer.data},status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetFacilitiesView(GenericAPIView) :
    serializer_class= GetFacilitiesSerializer
    def get(self, request, vid) :
        facilities = Facility.objects.filter(venue=vid)
        serializer = self.serializer_class(facilities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateFacilitiesView(GenericAPIView) :
    serializer_class = UpdateFacilitiesSerializer

    def put(self, request, vid) :
        print(vid)
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
    
    
class BlockFacilityView(GenericAPIView) :
    def post(self, request, vid) :
        facility_id = request.data.get('facility_id')
        venue = get_object_or_404(Venue, id=vid)
        facility = get_object_or_404(Facility, id=facility_id, venue=venue)
        facility.is_active = False
        facility.save()
        return Response({"message": "Facility blocked successfully"}, status=status.HTTP_200_OK)


class UnblockFacilityView(GenericAPIView) :
    def post(self, request, vid) :
        facility_id = request.data.get('facility_id')
        venue = get_object_or_404(Venue, id=vid)
        facility = get_object_or_404(Facility , id=facility_id, venue=venue)
        facility.is_active = True
        facility.save()
        return Response(status=status.HTTP_200_OK)    


#================ VENUE PHOTOS ==============

class AddVenuePhotoView(APIView) :
    def post(self, request, vid) :
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
        if serializer.is_valid() :
            serializer.save()
            return Response({"message": "Banner added successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ShowAllVenuePhotosView(APIView) :
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        banner_details = VenueImage.objects.filter(venue=venue).order_by('-id')
        serializer = BannerDetailsSerializer(banner_details, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlockVenuePhotoView(APIView) :
    def post(self, request, bid) :
        banner_obj = get_object_or_404(VenueImage, id=bid)
        banner_obj.is_active = False 
        banner_obj.save()
        return Response(status=status.HTTP_200_OK)
    

class UnblockVenuePhotoView(APIView) :
    def post(self, request, bid) :
        banner_obj = get_object_or_404(VenueImage, id=bid)
        banner_obj.is_active = True 
        banner_obj.save()
        return Response(status=status.HTTP_200_OK)



# ============= EVENTS ============


class GetAllEventsDetails(GenericAPIView) :
    serializer_class = EventSerializer
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        events = Event.objects.filter(venue=venue).order_by('-id')
        serializer = self.serializer_class(events, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)



class AddEventView(GenericAPIView) :
    serializer_class = CreatingEventSerializer
    def post(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        print(request.data)
        event_photo = request.FILES.get('event_photo')
        event_name  = request.data.get('event_name')
        data = {
            'event_photo': event_photo,
            'event_name': event_name,
            'venue': venue.id
        }
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            return Response({"message": "New event added successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, staus=status.HTTP_400_BAD_REQUEST)
    

class UpdateEventView(GenericAPIView) :
    serializer_class = UpdateEventSerializer
    def patch(self, request, vid) :
        event_id = request.data.get('event_id')
        venue = get_object_or_404(Venue, id=vid) 
        event = Event.objects.filter(id=event_id, venue=venue)
        data = request.data.copy()
        data['venue'] = venue.id
        serializer = self.serializer_class(isinstance=event, data=data, many=True)
        if serializer.is_valid(raise_exception=True) :
            return Response({"message":"Event details updated successfully"}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class BlockEventView(APIView) :
    def patch(self, request, vid) :
        event_id = request.data.get('event_id')
        venue = get_object_or_404(Venue, id=vid)
        event_obj = get_object_or_404(Event, id=event_id, venue=venue)
        event_obj.is_active = False
        event_obj.save()
        return Response({"message":"Event is blocked successfully"})
    

class UnblockEventView(APIView) :
    def patch(self, request, vid) :
        event_id = request.data.get('event_id')
        venue = get_object_or_404(Venue, id=vid)
        event_obj = get_object_or_404(Event, id=event_id, venue=venue)
        event_obj.is_active = True
        event_obj.save()
        return Response({"message":"Event is unblocked successfully"})

#============== BOOKING PACKAGES ===========


class GetAllBookingPackagesView(GenericAPIView):
    serializer_class = BookingPackagesSerializer
    def get(self, request, vid):
        venue = get_object_or_404(Venue, id=vid)
        booking_packages = BookingPackages.objects.filter(venue=venue)
        serializer = self.serializer_class(booking_packages,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class AddBookingPackageView(GenericAPIView) :
    serializer_class = BookingPackagesSerializer

    def post(self, request, vid) :
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
                    # time_slots.append([f"{start_time} to {end_time}",True])
                    time_slots.append({"start_time":start_time, "end_time":end_time, "is_active":True})

                TimeSlots.objects.create(
                        booking_package=booking_package,
                        time_slots=time_slots
                    )
                    
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UpdateBookingPackageView(GenericAPIView) :
    serializer_class = BookingPackagesSerializer

    def put(self, request, vid):
        pid= request.data['package_id']
        venue = get_object_or_404(Venue, id=vid)
        booking_package = get_object_or_404(BookingPackages, id=pid, venue=venue)
        print(booking_package)
        data = request.data.copy()
        data['venue'] = booking_package.venue.id
        
        serializer = self.serializer_class(booking_package, data=data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlockBookingPackageView(APIView) :
    def patch(self, request, vid) :
        pid = request.data.get('package_id')
        venue = get_object_or_404(Venue, id=vid)
        booking_package_obj = get_object_or_404(BookingPackages, id=pid, venue=venue)
        booking_package_obj.is_active = False
        booking_package_obj.save()
        return Response({"message":"Event is blocked successfully"},status=status.HTTP_200_OK)


class UnblockBookingPackagesView(APIView) :
    def patch(self, request, vid) :
        pid = request.data.get('package_id')
        venue = get_object_or_404(Venue, id=vid)
        booking_package_obj = get_object_or_404(BookingPackages, id=pid, venue=venue)
        booking_package_obj.is_active = True
        booking_package_obj.save()
        return Response({"message":"Event is unblocked successfully"},status=status.HTTP_200_OK)

#============= PACKAGE TIME SLOTES ===============

class GetPackageTimeSlotes(GenericAPIView):
    serializer_class = BookingPackageTimeSlotesSerializer

    def get(self, request, vid):
        venue = get_object_or_404(Venue, id=vid)
        package_id = request.query_params.get('packageId')
        booking_package = get_object_or_404(BookingPackages, id=package_id,venue=venue)

        time_slots = TimeSlots.objects.filter(booking_package=booking_package)

        serializer = self.serializer_class(time_slots,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    


class BlockOrUnblockBookingPackageTimeSlote(APIView):
    def put(self, request, vid):
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
            {"updated_slot": {
                    "start_time": start_time,
                    "end_time": end_time,
                    "is_active": is_active
                }},status=status.HTTP_200_OK)
        

    

#============== BOOKING ============


class OwnerPagination(PageNumberPagination):
    page_size = 2
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

    def get(self, request, vid):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        venue = get_object_or_404(Venue, id=vid)
        all_bookings = Booking.objects.filter(venue=venue).order_by('-id')

        if start_date and end_date:
            all_bookings = all_bookings.filter(date__range=[start_date, end_date])

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(all_bookings, request)

        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



class GetSingleBookingDetailsView(GenericAPIView) :
    serializer_class = AllBookingDetailsSerializer
    def get(self, request, b_id):
        booking_obj = Booking.objects.filter(id=b_id)
        serializer = self.serializer_class(booking_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CancellingBookingView(GenericAPIView) :
    def post(self, request, bid) :
        cancel_reason = request.data.get('reason')
        booking_obj = get_object_or_404(Booking, id=bid)
        booking_obj.cancel_reason = cancel_reason
        booking_obj.status = 'Booking Canceled'
        booking_obj.save()
        return Response(status=status.HTTP_200_OK)


class UpdateBookingStatusview(APIView):
    def post(self, request, b_id):
        booking_obj = get_object_or_404(Booking, id=b_id)
        booking_obj.status = 'Booking Completed'
        booking_obj.save()
        return Response(status=status.HTTP_200_OK)