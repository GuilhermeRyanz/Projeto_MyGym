from datetime import timedelta
from math import trunc

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from produto import actions
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

    @action(detail=False, methods=['post'],permission_classes = [IsAuthenticated])
    def baixar_estoque(self, request, pk=None):
        produto = self.get_object()
        quantidade = int(request.data.get('quantidade', 0))

        try:
            actions.LoteActions.baixar_estoque(produto, quantidade)
            return Response({'quantidade_estoque': produto.quantidade_estoque})
        except ValidationError as e:
            return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

