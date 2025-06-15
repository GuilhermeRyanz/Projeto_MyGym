from django.db import models
from sqlalchemy import false

from academia.models import Academia
from core.models import ModelBase
from cloudinary.models import CloudinaryField


class Produto(ModelBase):
    CATEGORIA = [
        ('SUPLEMENTO', 'suplemento'),
        ('ACESSORIO', 'acessorio'),
        ('ROUPA', 'roupa'),
        ('BEBIDA', 'bebida'),
        ('ALIMENTO', 'alimento'),
        ('OUTROS', 'outros'),
        ('EQUIPAMENTO', "equipamento")
    ]

    marca = models.CharField(max_length=200, null=True, blank=True)
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    foto = models.URLField('foto', blank=True, null=True)
    academia = models.ForeignKey( Academia , on_delete=models.CASCADE, null=False)
    data_cadastro = models.DateField(auto_now_add=True)
    quantidade_estoque = models.PositiveIntegerField(default=0)
    estoque_minimo = models.PositiveIntegerField(default=0)

    categoria = models.CharField(
        max_length=100,
        choices=CATEGORIA,
        default="outros")

    def __str__(self):
        return self.nome, self.categoria


    class Meta:
        db_table = 'produto'

class LoteProduto(ModelBase):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name="lote_produto")
    quantidade = models.PositiveIntegerField()
    data_entrada = models.DateTimeField(auto_now_add=True)
    preco_total = models.DecimalField(max_digits=10, decimal_places=2)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Lote de {self.produto.nome} - Validade {self.data_validade}"

    class Meta:
        db_table = 'lote_produto'
