from django.contrib.admin import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from core.permissions import AcademiaPermissionMixin
from plano import models, serializers, filters
from rest_framework.response import Response


# Create your views here.

class PlanoViewSet(AcademiaPermissionMixin,viewsets.ModelViewSet):
    queryset = models.Plano.objects.all()
    serializer_class = serializers.PlanoSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_class = filters.PlanoFilter

    def perform_create(self, serializer):
        super().perform_create(serializer)

    @action(detail=True, methods=['post'])
    def desativar(self, request, pk=None):
        plano = self.get_object()
        plano.active = False
        plano.save()
        return Response({'status': 'plano desativado com sucesso'})
