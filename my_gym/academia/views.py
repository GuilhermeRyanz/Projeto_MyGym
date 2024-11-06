from django.shortcuts import render
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions

from academia import models, serializers, filters
from core.permissions import AcademiaPermissionMixin


# Create your views here.

from rest_framework import viewsets, permissions
from academia import models, serializers, filters
from django.shortcuts import get_object_or_404
from core.permissions import AcademiaPermissionMixin


class AcademiaViewSet( viewsets.ModelViewSet):
    queryset = models.Academia.objects.all()
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = filters.AcademiaFilter
    serializer_class = serializers.AcademiaSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return models.Academia.objects.filter(
            usuarioacademia__usuario=self.request.user
        )

    def perform_create(self, serializer):
        academia = serializer.save()

        models.UsuarioAcademia.objects.create(
            academia=academia,
            usuario=self.request.user,
            tipo_usuario=self.request.user.usuario.tipo_usuario
        )

        return academia


class FrequenciaViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Frequencia.objects.all()
    serializer_class = serializers.FrequenciaSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_class = filters.FrequenciaFilter
    permission_classes = [permissions.IsAuthenticated,]



    def perform_create(self, serializer):
        academia_id = self.request.data.get('academia')  # Ajuste: verificar o campo correto
        self.check_permission(academia_id)  # Verificação da permissão
        serializer.save()

    def perform_update(self, serializer):
        academia_id = self.request.data.get('academia')  # Ajuste: verificar o campo correto
        self.check_permission(academia_id)  # Verificação da permissão
        serializer.save()



