from django.shortcuts import render
from langchain_community.tools.connery.models import Action
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from venda.filters import VendaFilter
from venda.models import Venda, ItemVenda
from venda.serializers import VendaSerializer


# Create your views here.

class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.all().order_by('-id')
    serializer_class = VendaSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = VendaFilter


    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        venda = self.get_object()

        if hasattr(venda, 'cancelada') and venda.cancelada:
            return Response({"detail": "Venda já foi cancelada."}, status=status.HTTP_400_BAD_REQUEST)

        itens = venda.itens.all()

        for item in itens:
            prod = item.produto
            prod.quantidade_estoque += item.quantidade
            item.active = False
            item.save()
            prod.save()
            lote = item.lote
            if lote:
                lote.quantidade += item.quantidade
                lote.save()


        if hasattr(venda, 'active'):
            venda.active = False
            venda.save()
        else:
            venda.delete()

        return Response({"detail": "Venda cancelada e estoque revertido com sucesso."}, status=status.HTTP_200_OK)
