from django.shortcuts import render
from rest_framework import viewsets, permissions

from core.permissions import AcademiaPermissionMixin
from pagamento import models, serializers

class PagamentoViewSet(AcademiaPermissionMixin,viewsets.ModelViewSet):
    queryset = models.Pagamento.objects.all()
    serializer_class = serializers.PagamentoSerializer
    permission_classes = [permissions.IsAuthenticated,]
