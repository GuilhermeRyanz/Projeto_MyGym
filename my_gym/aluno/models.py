from django.core.validators import RegexValidator
from django.db import models
from core.models import ModelBase
from academia.models import Academia
from plano.models import Plano
from django.core import validators


# Create your models here.

class Aluno(ModelBase):
    nome = models.CharField(
        db_column='nome',
        max_length=100,
        null= False,
    )

    telefone = models.CharField(
        db_column='telefone',
        max_length=100,
        null= True,
        validators=[RegexValidator(regex=r'^\+?[0-9]*$', message="Insira um número de telefone válido.")]
    )

    email = models.EmailField(
        db_column='e-mail',
        null= True,
        validators=[validators.EmailValidator(message="Insira um e-mail válido.")]
    )

    id_academia = models.ForeignKey(
        Academia,
        db_column='id_academia',
        on_delete=models.CASCADE,
    )

    id_plano = models.ForeignKey(Plano, db_column='id_plano', on_delete=models.CASCADE, related_name='alunos')



    def __str__(self):
        return self.nome

