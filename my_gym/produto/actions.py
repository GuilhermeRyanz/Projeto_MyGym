from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from django.db import transaction

from produto.models import Produto


class LoteActions:

    @staticmethod
    def cal_unit_price(quantidade, preco_total):
        """
        Calculate the unit price of the product based on the total price and quantity.
        """
        if quantidade > 0:
            preco_unitario = quantidade * preco_total
        else:
            raise ValueError("Quantidade deve ser maior que zero.")

        return preco_unitario

    @transaction.atomic
    def baixar_estoque(produto: Produto, quantidade: int):
        if quantidade <= 0:
            raise ValidationError("A quantidade a ser removida deve ser positiva.")

        total_em_estoque = produto.lote_produto.aggregate(total=Sum('quantidade'))['total'] or 0

        if quantidade > total_em_estoque:
            raise ValidationError("Quantidade insuficiente em estoque.")

        lotes = produto.lote_produto.filter(quantidade__gt=0).order_by('-data_entrada')

        restante = quantidade
        for lote in lotes:
            if restante <= 0:
                break

            if lote.quantidade >= restante:
                lote.quantidade -= restante
                lote.save()
                restante = 0
            else:
                restante -= lote.quantidade
                lote.quantidade = 0
                lote.save()

        produto.quantidade_estoque = produto.lote_produto.aggregate(total=Sum('quantidade'))['total'] or 0
        produto.save()
