from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q,Sum
from django.db.models.functions import Extract
from users.models import Booking,CustomUser

from owners.models import Owner,Venue,BookingPackages
from users.serializers import UserDetailsSerializer
from .serializers import *
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .utils import *
from django.db.models.functions import Extract, TruncDay, TruncWeek, TruncMonth, TruncYear
from datetime import datetime, timedelta


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



#--------------- ADMIN DASHBOARD ------------


class CustomPagination(PageNumberPagination):
    page_size = 8
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



class GetAllBookingDetailsview(GenericAPIView):
    serializer_class = GetAllBookingDetailsSerializer
    pagination_class = CustomPagination

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        page = request.query_params.get('page', 1)

        bookings = Booking.objects.all()
        
        if start_date and end_date:
            bookings = bookings.filter(date__range=[start_date, end_date])

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(bookings, request)
        serializer = self.serializer_class(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    




class GetAllBookingsStatusView(APIView)  :
    def get(self, request) :
        confirmed_count = Booking.objects.filter(status='Booking Confirmed').count()
        completed_count = Booking.objects.filter(status='Booking Completed').count()
        cancelled_count = Booking.objects.filter(status='Booking Canceled').count()
        data = [
            {"label": "Confirmed", "value": confirmed_count},
            {"label": "Completed", "value": completed_count},
            {"label": "Canceled", "value": cancelled_count},
        ]

        return Response(data,status=status.HTTP_200_OK)


class GetAllUsersCountView(APIView) :
    def get(self, request) :

        total_users_count = CustomUser.objects.filter(is_superuser=False, is_verified=True).count()
        end_users_count = CustomUser.objects.filter(is_user=True, is_verified=True).count()
        owners_count = CustomUser.objects.filter(is_owner=True, is_verified=True).count()
        end_users_percentage = (end_users_count / total_users_count * 100) if total_users_count else 0
        owners_percentage = (owners_count / total_users_count * 100) if total_users_count else 0
        total_revenue = Booking.objects.filter(status='Booking Completed').aggregate(total_revenue=Sum('total_price'))['total_revenue'] or 0

        data ={
            'allusers':total_users_count,
            'users_count':end_users_count,
            'owners_count':owners_count,
            'users_percentage':end_users_percentage,
            'owners_percentage':owners_percentage,
            'total_revenue': total_revenue,
        }

        return Response(data,status=status.HTTP_200_OK)




class GetTotalRevenueView(APIView):
    def get(self, request):
        selected_view = request.GET.get('view', 'monthly')
        revenue_data = None

        now = datetime.now()
        
        if selected_view == 'daily':
            start_date = now - timedelta(days=7)
            revenue_data = Booking.objects.filter(
                status='Booking Completed',
                created_at__gte=start_date
            ).annotate(
                day=TruncDay('created_at')
            ).values('day').annotate(
                total_revenue=Sum('total_price')
            ).order_by('day')

        elif selected_view == 'weekly':
            start_date = now - timedelta(weeks=7)
            revenue_data = Booking.objects.filter(
                status='Booking Completed',
                created_at__gte=start_date
            ).annotate(
                week=TruncWeek('created_at')
            ).values('week').annotate(
                total_revenue=Sum('total_price')
            ).order_by('week')

        elif selected_view == 'monthly':
            start_date = now.replace(day=1) - timedelta(days=7*30)
            revenue_data = Booking.objects.filter(
                status='Booking Completed',
                created_at__gte=start_date
            ).annotate(
                month=TruncMonth('created_at')
            ).values('month').annotate(
                total_revenue=Sum('total_price')
            ).order_by('month')

        elif selected_view == 'yearly':
            start_date = now.replace(month=1, day=1) - timedelta(days=7*365)
            revenue_data = Booking.objects.filter(
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



#============== User handling =============



class UserListView(GenericAPIView):
    # permission_classes = [IsAdminUser]
    serializer_class = UserDetailsSerializer
    pagination_class = CustomPagination

    def get(self, request,):
        search_query = request.GET.get('search', '')
        page = request.query_params.get('page', 1)

        if search_query:
            users = User.objects.filter(
                Q(is_verified=True) & ( 
                    Q(first_name__icontains=search_query) |
                    Q(last_name__icontains=search_query) |
                    Q(email__icontains=search_query)
                )
            ).order_by('id')

        else:
            users = User.objects.filter(is_verified=True).order_by('id')

        
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(users, request)
        serializer = self.serializer_class(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    



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
    pagination_class = CustomPagination
    def get(self, request) :
        search_query = request.GET.get('search', '')
        page = request.query_params.get('page', 1)

        if search_query:
            owners = Owner.objects.filter(
                Q(is_verified=True) & Q(is_superuser=False) & ( 
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query)
            )
        ).order_by('id')

        else:
            owners = Owner.objects.filter(is_verified=True,is_superuser=False).order_by('id')
        

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(owners, request)
        serializer = self.serializer_class(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    


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

class VenueListView(GenericAPIView):
    serializer_class = VenueDetailsSeriallizer
    pagination_class = CustomPagination

    def get(self, request):
        search_query = request.GET.get('search', '')
        page = request.query_params.get('page', 1)

        if search_query:
            venues = Venue.objects.filter(convention_center_name__icontains=search_query)
        else:
            venues = Venue.objects.all()

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(venues, request)
        serializer = self.serializer_class(result_page, many=True)

        return paginator.get_paginated_response(serializer.data) 




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
        




# VENEU BOOKING PACKAGE  APPROVALS AND REJECTIONS


class VeneuBookingPackageApproval(APIView):

    def put(self, request, vid):
        venue = get_object_or_404(Venue, id=vid)
        pkg_id = request.data.get("pkg_id")
        print("package id is ",pkg_id)
        booking_package_obj = get_object_or_404(BookingPackages, venue=venue, id=pkg_id)
        booking_package_obj.is_verified = True
        booking_package_obj.is_rejected = False
        booking_package_obj.is_editable = True
        booking_package_obj.save()

        send_venue_booking_package_approval_email(venue, booking_package_obj.package_name)

        return Response({"package_name":booking_package_obj.package_name} ,status=status.HTTP_200_OK)




class VeneuBookingPackageRejection(APIView):

    def put(self, request, vid):
        venue = get_object_or_404(Venue, id=vid)
        pkg_id = request.data.get("pkg_id")
        rejection_reason = request.data.get("rejection_reason")
        booking_package_obj = get_object_or_404(BookingPackages, venue=venue, id=pkg_id)
        booking_package_obj.is_verified = False
        booking_package_obj.is_rejected = True
        booking_package_obj.is_editable = False
        booking_package_obj.rejection_reason = rejection_reason
        booking_package_obj.save()

        booking_package_name = booking_package_obj.package_name
        send_venue_booking_package_rejection_email(venue,booking_package_name,rejection_reason )

        return Response({"packag_name":booking_package_name} ,status=status.HTTP_200_OK)




        
