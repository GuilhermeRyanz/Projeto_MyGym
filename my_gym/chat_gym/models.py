from django.db import models


class Chats(models.Model):
    """
    Model to store chat messages.
    """
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.message[:20]}..."

# Create your models here.
