from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework import viewsets

from produto.models import Produto
from produto.serializers import ProdutoSerializer, LoteSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


class LoteViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = LoteSerializer

