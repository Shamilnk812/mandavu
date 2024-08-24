from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from owners.models import Owner,Venue
from .serializers import *
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .utils import *
# Create your views here.



class AdminLoginView(GenericAPIView) :
    serializer_class = AdminLoginSerializer

    def post(self, request) :
        serializer = self.serializer_class(data=request.data , context={'request':request})
        if serializer.is_valid(raise_exception=True) :
            return Response(serializer.data, status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class AdminLogoutView(GenericAPIView) :
    serializer_class = AdminLogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request) :
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    
    
#============== User handling =============


# class UserListView(GenericAPIView) :
#     serializer_class = UserListSerializer
#     def get(self, request) :
#         users  = User.objects.filter(is_superuser=False)
#         serializer = self.serializer_class(users, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


class UserListView(APIView):
    # permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        search_query = request.GET.get('search', '')
        if search_query:
            users = User.objects.filter(
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query)|
                Q(is_verified=True)
            )
        else:
            users = User.objects.filter(is_verified=True)

        user_list = [
            {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'date_joined': user.date_joined,
                'is_active': user.is_active,
            }
            for user in users
        ]
        return Response(user_list, status=status.HTTP_200_OK)
    


class BlockUserView(GenericAPIView) :
    def post(self, request,uid) :
        user = get_object_or_404(User, id=uid)
        user.is_active = False
        user.save()
        serializer = UserListSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)


class UnblockUserView(GenericAPIView) :
    def post(self, request,uid) :
        user = get_object_or_404(User, id=uid)
        user.is_active = True 
        user.save()
        serializer = UserListSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)


#============ Owner Handling ===============


class OwnerListView(GenericAPIView) :
    serializer_class = OwnerListSerializer
    def get(self, request) :
        owners = Owner.objects.filter(is_superuser=False)
        serializer = OwnerListSerializer(owners, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class BlockOwnerView(GenericAPIView) :
    def post(self, request,uid) :
        owner = get_object_or_404(Owner, id=uid)
        owner.is_active = False
        owner.save()
        serializer=OwnerListSerializer(owner)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
class UnblockOwnerView(GenericAPIView) :
    def post(self, request,uid) :
        owner = get_object_or_404(Owner, id=uid)
        owner.is_active = True
        owner.save()
        serializer = OwnerListSerializer(owner)
        return Response(serializer.data,status=status.HTTP_200_OK)    
    


#============= Venue Handling =================

class VenueListView(APIView):
    def get(self, request, format=None):
        search_query = request.GET.get('search', '')
        if search_query:
            venues = Venue.objects.filter(name__icontains=search_query)
        else:
            venues = Venue.objects.all()

        venue_list = [{
            'id': venue.id,
            'name': venue.convention_center_name,
            'is_verified': venue.is_verified,
            'is_active': venue.is_active,
            'created_at': venue.created_at,
            'is_rejected': venue.is_rejected
        } for venue in venues]
        print(venue_list)
        return Response(venue_list, status=status.HTTP_200_OK)    




class VenueVerifyView(APIView) :
    def post(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        venue.is_verified = True
        venue.save()
        send_approval_email(venue)
        print('venue approved ')
        return Response(status=status.HTTP_200_OK)


class RejectVenueView(APIView) :
    def post(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        reason = request.data.get('reason')
        if not reason:
            return Response({'error': 'Rejection reason is required'}, status=400)
        venue.is_rejected = True
        venue.save()
        send_rejection_email(venue, reason)

        return Response({'message': 'Venue rejected successfully'})
        



# class VenueUnVerifyView(APIView) :
#     def post(self, request, vid) :
#         venue = get_object_or_404(Venue, id=vid)
#         venue.is_verified = False
#         venue.save()
#         print('venue un approved ')
#         return Response(status=status.HTTP_200_OK)
    


class BlockVenueView(APIView) :
    def post(self,request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        venue.is_active = False
        venue.save()
        return Response(status=status.HTTP_200_OK)


class UnblockVenueView(APIView) :
    def post(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        venue.is_active = True
        venue.save()
        return Response(status=status.HTTP_200_OK)


class VenueDetailsView(APIView) :
    serializer_class = OwnerListSerializer
    def get(self, request, vid) :
        venue = get_object_or_404(Venue, id=vid)
        owner = get_object_or_404(Owner, venue=venue)
        serializer = self.serializer_class(owner, context={'request':request})
        return Response(serializer.data , status=status.HTTP_200_OK)
        
