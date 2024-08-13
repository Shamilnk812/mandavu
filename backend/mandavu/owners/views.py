from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password

from .serializers import *
from .models import *
from users.models import Booking
from .utils import sent_otp_to_owner,decode_base64_file
import base64
from django.core.files.base import ContentFile

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

        sent_otp_to_owner(owner['email'])        

        return Response({
            'message': 'Owner, Venue, Facilities, and Events registered successfully, OTP sent to owner email.',
            'owner': owner_serializer.data,
            'venue': venue_serializer.data,
        }, status=status.HTTP_201_CREATED)




class LoginOwnerView(GenericAPIView) :
    serializer_class = OwnerLoginSerializer
    def post(self, request) :
        serializer = self.serializer_class(data=request.data, context={'request':request})
        if serializer.is_valid(raise_exception=True) :
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



class VerifyOwerOtp(GenericAPIView) :
    def post(self, request) :
        opt_code = request.data.get('otp')
        try :
            owner_code_obj = OneTimePasswordForOwner.objects.get(code=opt_code)
            owner = owner_code_obj.owner
            if not owner.is_verified :
                owner.is_verified = True
                owner.save()
                return Response({'message':'account email verified successfully'},status=status.HTTP_200_OK)
            return Response({
                     'message' : 'OTP is invlid user already verified'
                     },status=status.HTTP_204_NO_CONTENT) 
        except OneTimePasswordForOwner.DoesNotExist :
            Response({'message':'OTP not provided '},status=status.HTTP_400_BAD_REQUEST)




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
    

#============== BOOKING ============

class AllBookingDetailsView(GenericAPIView) :
    serializer_class = AllBookingDetailsSerializer
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        all_bookings = Booking.objects.filter(venue=venue)
        serializer = self.serializer_class(all_bookings, many=True)
        print(serializer.data)
        return Response(serializer.data,status=status.HTTP_200_OK)


class CancellingBookingView(GenericAPIView) :
    def post(self, request, bid) :
        cancel_reason = request.data.get('reason')
        booking_obj = get_object_or_404(Booking, id=bid)
        booking_obj.cancel_reason = cancel_reason
        booking_obj.status = 'Booking Canceled'
        booking_obj.save()
        return Response(status=status.HTTP_200_OK)
