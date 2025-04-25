from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework import viewsets

from produto.filters import ProdutoFilter
from produto.models import Produto, LoteProduto
from produto.serializers import ProdutoSerializer, LoteSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    filterset_class = ProdutoFilter


    def get_queryset(self):
        return Produto.objects.filter(
            academia__usuarioacademia__usuario=self.request.user,
            active=True
        )

class LoteViewSet(viewsets.ModelViewSet):
    queryset = LoteProduto.objects.all()
    serializer_class = LoteSerializer

