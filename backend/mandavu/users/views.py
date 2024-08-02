from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import OneTimePassword
from .utils import sent_otp_to_user,encrypt_otp,decrypt_otp
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str,DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password




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

            # if user_code_obj.is_expired() :
            #     return Response({'message': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

          
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
            return Response({'success':True,'message':'credentials is valid','uidb64':uidb64,'token':token},status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError :
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)



class SetNewPassword(GenericAPIView) :
    serializer_class= SetNewPasswordSerializer

    def patch(self, request) :
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message':'password reset successfully '},status=status.HTTP_200_OK)