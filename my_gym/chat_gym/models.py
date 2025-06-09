from django.db import models
from core.models import ModelBase
from usuario.models import Usuario
from academia.models import Aluno

class Questions(ModelBase):
    question = models.TextField()
    answer = models.TextField(null=True, blank=True)
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='questions'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        db_table = 'questions'