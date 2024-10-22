from django.db import models
from django.contrib.auth.models import User


class Usuario(User):

    class TipoUsuario(models.TextChoices):
        DONO = 'D', 'Dono'
        GERENTE = 'G', 'Gerente'
        FUNCIONARIO = 'F', 'Funcionário'

    tipo_usuario = models.CharField(
        max_length=1,
        choices=TipoUsuario.choices,
        default=TipoUsuario.DONO,
        db_column='tipo_usuario'
    )

    def __str__(self):
        return f"{self.username} ({self.get_tipo_usuario_display()})"

    class Meta:
        db_table = 'usuario'