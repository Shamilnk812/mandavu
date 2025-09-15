from django.db import models
from users.models import Booking
# Create your models here.


class PlatformFee(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    fee_collected = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


