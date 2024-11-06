from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class Usuario(User):

    class TipoUsuario(models.TextChoices):
        DONO = 'D', 'Dono'
        GERENTE = 'G', 'Gerente'
        ATENDENTE = 'A', 'Atendente'


    tipo_usuario = models.CharField(
        max_length=1,
        choices=TipoUsuario.choices,
        default=TipoUsuario.DONO,
        db_column='tipo_usuario'
    )

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)


    def __str__(self):
        return self.username

    class Meta:
        db_table = 'usuario'

