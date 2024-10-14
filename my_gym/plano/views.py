from django.shortcuts import render
from rest_framework import viewsets, permissions
from plano import models, serializers

# Create your views here.

class PlanoViewSet(viewsets.ModelViewSet):
    queryset = models.Plano.objects.all()
    serializer_class = serializers.PlanoSerializer