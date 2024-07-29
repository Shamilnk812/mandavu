from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from owners.models import Owner
from .serializers import *

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


class UserListView(GenericAPIView) :
    serializer_class = UserListSerializer
    def get(self, request) :
        users  = User.objects.filter(is_superuser=False)
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class UserListView(APIView):
#     # permission_classes = [IsAdminUser]

#     def get(self, request, format=None):
#         search_query = request.GET.get('search', '')
#         if search_query:
#             users = User.objects.filter(
#                 Q(first_name__icontains=search_query) |
#                 Q(last_name__icontains=search_query) |
#                 Q(email__icontains=search_query)
#             )
#         else:
#             users = User.objects.all()

#         user_list = [
#             {
#                 'id': user.id,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'email': user.email,
#                 'date_joined': user.date_joined,
#                 'is_active': user.is_active,
#             }
#             for user in users
#         ]
#         return Response(user_list, status=status.HTTP_200_OK)
    


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