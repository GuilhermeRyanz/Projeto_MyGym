from django.db.models import Count
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from aluno.models import AlunoPlano
from core.permissions import AcademiaPermissionMixin
from plano import models, serializers, filters
from aluno.filters import AlunoPlanoFilter

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

class PlanosAlunosAtivosViewSet(AcademiaPermissionMixin,viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend,]
    filterset_class = AlunoPlanoFilter
    serializer_class = serializers.PlanosAlunosAtivosSerializer
    queryset = AlunoPlano.objects.all()

    def list(self, request, *args, **kwargs):

        academia_id = request.query_params.get('academia')
        if not academia_id:
            return Response({"error": "O parâmetro 'academia' é obrigatório na URL."}, status=400)

        planos = (
            AlunoPlano.objects.filter(active=True, plano__active=True,plano__academia__id=academia_id)
            .values('plano__nome')
            .annotate(total_alunos=Count('aluno'))
            .order_by('-total_alunos')
        )
        data = [{'plano': plano['plano__nome'], 'alunos_ativos': plano['total_alunos']} for plano in planos]
        return Response(data)