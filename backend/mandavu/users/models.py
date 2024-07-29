from django.db import models
from django.contrib.auth.models import AbstractBaseUser ,PermissionsMixin
from django.utils.translation import gettext_lazy as _ 
from .managers import UserManager
from rest_framework_simplejwt.tokens import RefreshToken


class CustomUser(AbstractBaseUser) :
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email      = models.EmailField(max_length=225,unique=True)
    is_superuser = models.BooleanField(default=False)
    is_verified  = models.BooleanField(default=False)
    is_staff     = models.BooleanField(default=False)
    is_active    = models.BooleanField(default=True)
    is_user      = models.BooleanField(default=False)
    is_owner     = models.BooleanField(default=False)
    date_joined  = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD  ='email'
    REQUIRED_FIELDS = ['first_name','last_name']
    
    objects = UserManager()

    def has_perm(self, perm, obj = None):
        return True
    
    def has_module_perms(self,app_label):
        return True
    
    def token(self) :
        refresh = RefreshToken.for_user(self)
        return{
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        }
    


class User(CustomUser) :
    # def token(self) :
    #     refresh = RefreshToken.for_user(self)
    #     return{
    #         'refresh':str(refresh),
    #         'access':str(refresh.access_token)
    #     }
    

    def __str__(self) -> str:
        return self.email

# class User(AbstractBaseUser,PermissionsMixin) :
#     first_name = models.CharField(max_length=100)
#     last_name  = models.CharField(max_length=100)
#     email      = models.EmailField(max_length=225,unique=True)
#     is_superuser = models.BooleanField(default=False)
#     is_verified  = models.BooleanField(default=False)
#     is_staff     = models.BooleanField(default=False)
#     is_active    = models.BooleanField(default=True)
#     date_joined  = models.DateTimeField(auto_now_add=True)
    
#     USERNAME_FIELD  ='email'
#     REQUIRED_FIELDS = ['first_name','last_name']
    
#     objects = UserManager()
    
#     def __str__(self):
#         return self.email
    
#     @property
#     def get_full_name(self) :
#         return f"{self.first_name} {self.last_name}"
    
#     def token(self) :
#         refresh = RefreshToken.for_user(self)
#         return{
#             'refresh':str(refresh),
#             'access':str(refresh.access_token)
#         }
        


class OneTimePassword(models.Model) :
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    code = models.CharField(max_length=6,unique=True)

    def __str__(self) :
        return f"{self.user.first_name}-OTP"
    