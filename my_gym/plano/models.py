from django.db import models
from academia.models import Academia
from core.models import ModelBase

from django.db import models
from academia.models import Academia
from core.models import ModelBase


class DiasSemana(models.TextChoices):
    SEGUNDA = "segunda", "Segunda-feira"
    TERCA = "terca", "Terça-feira"
    QUARTA = "quarta", "Quarta-feira"
    QUINTA = "quinta", "Quinta-feira"
    SEXTA = "sexta", "Sexta-feira"
    SABADO = "sabado", "Sábado"
    DOMINGO = "domingo", "Domingo"


class TipoBeneficio(models.TextChoices):
    DESCONTO = "desconto", "Desconto em produtos"
    OUTROS = "outros", "Outros"
    NENHUM = "nenhum", "Nenhum"


class Beneficio(ModelBase, models.Model):
    tipo_beneficio = models.CharField(
        choices=TipoBeneficio.choices,
        default=TipoBeneficio.NENHUM
    )

    descricao = models.CharField(
        blank=True,
        null=True,
        help_text="Descricao detalhada dobeneficio",
    )

    desconto_percentual = models.DecimalField(
        max_digits=5, decimal_places=2,
        blank=True, null=True,
        help_text="Percentual de desconto",
    )

    class Meta:
        db_table = "beneficio"

    def __str__(self):
        return f"{self.tipo_beneficio} - {self.descricao or 'Sem descrição'}"


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

    beneficios = models.ManyToManyField(
        Beneficio,
        related_name='planos',
        blank=True,
    )

    academia = models.ForeignKey(
        Academia,
        on_delete=models.CASCADE,
        db_column='academia',
        related_name='planos'
    )

    dias_permitidos = models.JSONField(
        default=[DiasSemana.SEGUNDA,
                 DiasSemana.TERCA,
                 DiasSemana.QUARTA,
                 DiasSemana.QUINTA,
                 DiasSemana.SEXTA,
                 DiasSemana.SABADO,
                 DiasSemana.DOMINGO],
        db_column="dias_permitidos",
        help_text="Lista de dias da semana em que o plano pode ser usado"
    )

    class Meta:
        db_table = 'plano'

    def __str__(self):
        return f"{self.nome} - {self.academia.nome}"