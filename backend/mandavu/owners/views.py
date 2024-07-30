from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password

from .serializers import *
from .models import *
from .utils import sent_otp_to_owner

# Create your views here.



class RegisterOwnerView(GenericAPIView) :
    serializer_class = OwnerRegisterSerializer

    def post(self, request) :
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            owner = serializer.data
            sent_otp_to_owner(owner['email'])
            return Response({
                'data':owner,
                'message':f"hi thanks for singing up a OTP has be sent to your email"
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoginOwnerView(GenericAPIView) :
    serializer_class = OwnerLoginSerializer
    def post(self, request) :
        serializer = self.serializer_class(data=request.data, context={'request':request})
        if serializer.is_valid(raise_exception=True) :
            response_data = serializer.validated_data
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

class  VenueRegisterView(GenericAPIView) :
    serializer_class = RegisterVenueSerializer
    def post(self, request) :
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            print(serializer.data)
            return Response({'data':serializer.data,
                             'message':'Your Venue is Registerd waiting for admin approval'},
                               status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


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



class AddFacilitiesView(GenericAPIView):
    serializer_class = AddFacilitiesSerializer
    def post(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        facilities = Facility.objects.filter(venue=venue)
        serializer = self.serializer_class(facilities, data=request.data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            print(serializer.data)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    