from django.shortcuts import render
from rest_framework import viewsets, permissions
from aluno import models, serializers

# Create your views here.

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = models.Aluno.objects.all()
    serializer_class = serializers.AlunoSerializer