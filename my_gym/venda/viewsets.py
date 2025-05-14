from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from venda.filters import VendaFilter
from venda.models import Venda
from venda.serializers import VendaSerializer


# Create your views here.

class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.all().order_by('-id')
    serializer_class = VendaSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = VendaFilter