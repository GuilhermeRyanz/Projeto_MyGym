from django.shortcuts import render
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions

from core.permissions import AcademiaPermissionMixin
from plano import models, serializers, filters

# Create your views here.

class PlanoViewSet(viewsets.ModelViewSet, AcademiaPermissionMixin):
    queryset = models.Plano.objects.all()
    serializer_class = serializers.PlanoSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_class = filters.PlanoFilter