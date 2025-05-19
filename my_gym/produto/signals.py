# seu_app/signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.db import transaction
from .models import LoteProduto, Produto

@receiver(post_delete, sender=LoteProduto)
def delete_lote(sender, instance, **kwargs):
    with transaction.atomic():
        produto = instance.produto
        nova_quantidade = produto.quantidade_estoque - instance.quantidade
        if nova_quantidade < 0:
            raise Exception("Quantidade de estoque insuficiente.")
        produto.quantidade_estoque = nova_quantidade
        produto.save()