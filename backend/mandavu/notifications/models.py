from django.db import models
from users.models import CustomUser
from owners.models import Venue


class Notification(models.Model) :
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.CharField(max_length=225)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    link = models.URLField(null=True, blank=True)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE,null=True, blank=True)

    def __str__(self) :
        return f'Notification for {self.user.first_name} {self.user.last_name}'
    

    def mark_as_read(self) :
        self.is_read = True
        self.save()

    class Meta:
        ordering = ['-timestamp']    