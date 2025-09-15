from rest_framework.response import Response
from rest_framework import status
from .utils import decode_base64_file, description_for_regular_bookingpackages
from .serializers import OwnerRegisterSerializer, RegisterVenueSerializer, CreatingEventSerializer, CreatingFacilitySerializer, AddVenuePhotoSerializer
from .models import BookingPackages






def decode_files(owner_data, venue_data):
    id_proof_base64 = owner_data.get('id_proof')
    venue_license_base64 = venue_data.get('venue_license')
    venue_terms_and_conditions = venue_data.get('terms_conditions')

    if id_proof_base64:
        owner_data['id_proof'] = decode_base64_file(id_proof_base64)
    if venue_license_base64:
        venue_data['venue_license'] = decode_base64_file(venue_license_base64)
    if venue_terms_and_conditions:
        venue_data['terms_and_conditions'] = decode_base64_file(venue_terms_and_conditions, 'pdf')



def create_owner(owner_data):
    serializer = OwnerRegisterSerializer(data=owner_data)
    if serializer.is_valid():
        return serializer.save()
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def create_venue(venue_data, owner):
    venue_data['owner'] = owner.id
    serializer = RegisterVenueSerializer(data=venue_data)
    if serializer.is_valid():
        return serializer.save()
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def create_facilities(facilities, venue):
    for facility_data in facilities:
        serializer = CreatingFacilitySerializer(data={
            'facility': facility_data.get('facility'),
            'price': facility_data.get('price', 'FREE'),
            'venue': venue.id,
        })
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def create_events(events, venue):
    for event_data in events:
        try:
            event_photo_file = decode_base64_file(event_data.get('image'))
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CreatingEventSerializer(data={
            'event_name': event_data.get('name'),
            'event_photo': event_photo_file,
            'venue': venue.id,
        })
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


def create_venue_images(venue_images, venue):
    for venue_photo in venue_images:
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def create_default_booking_package(venue):
    booking_package_description = description_for_regular_bookingpackages(
        venue.dining_seat_count,
        venue.auditorium_seat_count
    )
    BookingPackages.objects.create(
        package_name='regular',
        venue=venue,
        price=venue.price,
        price_for_per_hour='Not Allowed',
        air_condition=venue.condition,
        extra_price_for_aircondition=venue.extra_ac_price,
        description=booking_package_description
    )
