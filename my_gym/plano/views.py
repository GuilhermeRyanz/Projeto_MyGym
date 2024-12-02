from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from core.permissions import AcademiaPermissionMixin
from plano import models, serializers, filters


# Create your views here.

class PlanoViewSet(AcademiaPermissionMixin,viewsets.ModelViewSet):
    queryset = models.Plano.objects.all()
    serializer_class = serializers.PlanoSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_class = filters.PlanoFilter

    # def perform_create(self, serializer):
    #     super().perform_create(serializer)

    def get_queryset(self):
        return models.Plano.objects.filter(
            academia__usuarioacademia__usuario=self.request.user
        )

    @action(detail=True, methods=['post'])
    def desativar(self, request, pk=None):

        if request.user.usuario.tipo_usuario == "A":
            return Response({'erro': 'Seu cargo não tem permissão para desativar planos.'},status=403)

        try:
            plano = self.get_object()
            plano.active = False
            plano.save()
            return Response({'status': 'plano desativado com sucesso'}, status=200)
        except models.Plano.DoesNotExist:
            return Response({'erro': 'Plano não encontrado'}, status=404)
        except Exception as e:
            return Response({'erro': str(e)}, status=500)