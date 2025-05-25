from django.db import models

from core.models import ModelBase
from usuario.models import Usuario


class Session(ModelBase):

    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=255)

    class Meta:
        unique_together = ('user', 'session_id')

class Questions(models.Model):

    question = models.TextField()
    answer = models.TextField( null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return f"Question: {self.question[:20]}..."

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        db_table = 'questions'