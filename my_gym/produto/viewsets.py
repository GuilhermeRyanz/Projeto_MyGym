from datetime import timedelta
from math import trunc

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from produto.filters import ProdutoFilter, LoteFilter
from produto.models import Produto, LoteProduto
from produto.serializers import ProdutoSerializer, LoteSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all().filter()
    serializer_class = ProdutoSerializer
    filterset_class = ProdutoFilter
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Produto.objects.filter(
            academia__usuarioacademia__usuario=self.request.user,
            active=True
        )

class LoteViewSet(viewsets.ModelViewSet):
    queryset = LoteProduto.objects.all()
    serializer_class = LoteSerializer
    filterset_class = LoteFilter
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LoteProduto.objects.filter(
            produto__academia__usuarioacademia=self.request.user,
            active=True
        )