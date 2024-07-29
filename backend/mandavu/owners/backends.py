from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import Owner  

class OwnerEmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            owner = Owner.objects.get(email=email)
            if check_password(password, owner.password):
                return owner
        except Owner.DoesNotExist:
            return None

    def get_user(self, owner_id):
        try:
            return Owner.objects.get(pk=owner_id)
        except Owner.DoesNotExist:
            return None
