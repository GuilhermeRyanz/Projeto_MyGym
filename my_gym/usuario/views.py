from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from usuario import serializers

# Create your views here.

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UsuarioSerializer