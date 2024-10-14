from django.db import models
from academia.models import Academia
from core.models import ModelBase

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

    tipo_acesso = models.CharField(
        max_length=50,
        db_column='tipo_Acesso',
        default='total'
    )

    id_academia = models.ForeignKey(
        Academia,
        on_delete=models.CASCADE,
        db_column='id_academia',
        related_name='planos'
    )

    class Meta:
        verbose_name = "plano"
        verbose_name_plural = "planos"

    def __str__(self):
        return f"{self.nome} - {self.id_academia.nome}"