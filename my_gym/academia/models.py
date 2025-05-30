from django.db import models
from aluno.models import Aluno
from core.models import ModelBase
from usuario.models import Usuario
from django.contrib.auth.models import User


# Create your models here.

class Academia(ModelBase):
    nome = models.CharField(
        db_column='name',
        max_length=100,
        null=False,
    )

    endereco = models.CharField(
        db_column='endereco',
        max_length=200,
        null=False,
    )

    telefone = models.CharField(
        db_column='telefone',
        max_length=100,
        null=True,
    )

    email = models.EmailField(
        db_column='email',
        null=True,
        unique=True,
    )

    def __str__(self):
        return self.nome

    class Meta:
        db_table = 'academia'


class Frequencia(ModelBase):

    academia = models.ForeignKey(
        Academia, on_delete=models.CASCADE,
        db_column='academia',
    )

    aluno = models.ForeignKey(
        Aluno, on_delete=models.CASCADE,
        db_column='aluno',
    )

    data = models.DateTimeField(
        db_column='data',
        auto_now_add=True,
        null=False,
    )

    class Meta:
        db_table = 'frequencia'


class UsuarioAcademia(ModelBase):

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='usuario'
    )
    academia = models.ForeignKey(
        Academia,
        on_delete=models.CASCADE,
        db_column='academia'
    )

    tipo_usuario = models.CharField(
        max_length=1,
        choices=Usuario.TipoUsuario.choices,
        db_column='tipo_usuario'
    )

    class Meta:
        db_table = 'usuario_academia'
