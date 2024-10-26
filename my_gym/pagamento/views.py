from django.shortcuts import render
from rest_framework import viewsets, permissions
from pagamento import models, serializers

class PagamentoViewSet(viewsets.ModelViewSet):
    queryset = models.Pagamento.objects.all()
    serializer_class = serializers.PagamentoSerializer