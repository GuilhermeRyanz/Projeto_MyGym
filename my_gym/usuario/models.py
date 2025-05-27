from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token


class Usuario(AbstractUser):

    class TipoUsuario(models.TextChoices):
        DONO = 'D', 'Dono'
        GERENTE = 'G', 'Gerente'
        ATENDENTE = 'A', 'Atendente'
        MEMBRO = 'M', 'Membro'


    nome = models.CharField(
        max_length=100,
        null=False,
        db_column='nome'
    )


    tipo_usuario = models.CharField(
        max_length=1,
        choices=TipoUsuario.choices,
        db_column='tipo_usuario'
    )


    def __str__(self):
        return self.username

    class Meta:
        db_table = 'usuario'

