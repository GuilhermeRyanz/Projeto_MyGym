from django.db import models
from aluno.models import Aluno
from core.models import ModelBase
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
    )

    id_usuario = models.ForeignKey(
        User,
        db_column='id_usuario',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.nome

class Frequencia(ModelBase):

    id_academia = models.ForeignKey(
        Academia, on_delete=models.CASCADE,
        db_column='id_academia',
    )

    id_aluno = models.ForeignKey(
        Aluno, on_delete=models.CASCADE,
        db_column='id_aluno',
    )

    data = models.DateTimeField(
        db_column='data',
        auto_now_add=True,
        null=False,
    )

