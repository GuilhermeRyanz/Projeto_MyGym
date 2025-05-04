from django.db import models
from academia.models import Academia
from core.models import ModelBase

from django.db import models
from academia.models import Academia
from core.models import ModelBase


class DiasSemana(models.IntegerChoices):
    SEGUNDA = 1, "Segunda-feira"
    TERCA = 2, "Terça-feira"
    QUARTA = 3, "Quarta-feira"
    QUINTA = 4, "Quinta-feira"
    SEXTA = 5, "Sexta-feira"
    SABADO = 6, "Sábado"
    DOMINGO = 7, "Domingo"

def dias_semana_default():
    return [
        DiasSemana.SEGUNDA,
        DiasSemana.TERCA,
        DiasSemana.QUARTA,
        DiasSemana.QUINTA,
        DiasSemana.SEXTA,
        DiasSemana.SABADO,
        DiasSemana.DOMINGO,
    ]



class Plano(ModelBase):
    nome = models.CharField(
        db_column='nome',
        max_length=100
    )

    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        db_column='preco',
        null=False
    )

    descricao = models.TextField(
        default='Acesso total à academia por um mês',
        db_column='descricao'
    )

    duracao = models.IntegerField(
        default=1,
        db_column='duracao'
    )

    beneficios = models.JSONField(default=list , blank=True)

    desconto = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True)

    academia = models.ForeignKey(
        Academia,
        on_delete=models.CASCADE,
        db_column='academia',
        related_name='planos'
    )

    dias_permitidos = models.JSONField(
        default=dias_semana_default,
        db_column="dias_permitidos",
        help_text="Lista de dias da semana em que o plano pode ser usado"
    )

    class Meta:
        db_table = 'plano'

    def __str__(self):
        return f"{self.nome} - {self.academia.nome}"