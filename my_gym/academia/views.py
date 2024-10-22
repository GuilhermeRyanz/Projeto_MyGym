from django.shortcuts import render
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions

from academia import models, serializers, filters

# Create your views here.

class AcademiaViewSet(viewsets.ModelViewSet):
    queryset = models.Academia.objects.all()
    filter_backends = [DjangoFilterBackend,]
    filterset_class = filters.AcademiaFilter
    serializer_class = serializers.AcademiaSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def create(self, request, *args, **kwargs):
        instance = super().create(request, *args, **kwargs)

        models.UsuarioAcademia.objects.create(
            academia_id=instance.data['id'],
            usuario_id=self.request.user.id
        )
        return instance


class FrequenciaViewSet(viewsets.ModelViewSet):
    queryset = models.Frequencia.objects.all()
    serializer_class = serializers.FrequenciaSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_class = filters.FrequenciaFilter
    permission_classes = [permissions.IsAuthenticated,]



