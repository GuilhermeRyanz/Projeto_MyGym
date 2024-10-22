from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from usuario import serializers
from usuario.models import Usuario


# Create your views here.

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UsuarioSerializer

class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(tipo_usuario='F')
    serializer_class = serializers.FuncionarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()