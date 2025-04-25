from django.db import models

from academia.models import Academia
from core.models import ModelBase
from produto.models import Produto
from usuario.models import Usuario


class Venda(ModelBase):
    data_venda = models.DateTimeField(
        auto_now_add=True,
    )
    valor_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    vendedor = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True,)

    academia = models.ForeignKey(
        Academia, on_delete=models.SET_NULL, null=True,
    )

class ItemVenda(ModelBase):
    venda = models.ForeignKey(
        Venda, related_name='items', on_delete=models.SET_NULL, null=True)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, null=True)
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    def subtotal(self):
        return self.preco_unitario * self.quantidade

