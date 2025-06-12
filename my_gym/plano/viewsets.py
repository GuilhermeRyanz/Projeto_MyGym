from datetime import timedelta
import pandas as pd

# from chat import Chat

from django.db.models import F, Count, Sum
from django.utils.timezone import now
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from aluno.filters import AlunoPlanoFilter
from aluno.models import AlunoPlano
from core.permissions import AcademiaPermissionMixin
from plano import models, serializers, filters


class PlanoViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Plano.objects.all()
    serializer_class = serializers.PlanoSerializer
    filterset_class = filters.PlanoFilter

    @action(detail=True, methods=['post'])
    def desativar(self, request, pk=None):

        if request.user.tipo_usuario == "A":
            return Response({'erro': 'Seu cargo não tem permissão para desativar planos.'}, status=403)

        try:
            plano = self.get_object()
            plano.active = False
            plano.save()
            return Response({'status': 'plano desativado com sucesso'}, status=200)
        except models.Plano.DoesNotExist:
            return Response({'erro': 'Plano não encontrado'}, status=404)
        except Exception as e:
            return Response({'erro': str(e)}, status=500)

    @action(detail=False, methods=['get'])
    def novosAlunosPorPlano(self, request):
        academia_id = request.query_params.get('academia', None)

        if academia_id is None:
            return Response({"detail": "Academia não fornecida."}, status=400)

        data_limite = now() - timedelta(days=30)

        novos_alunos = (
            AlunoPlano.objects.filter(
                modified_at__gte=data_limite,
                active=True,
                plano__academia__id=academia_id
            )
            .values(plano_nome=F('plano__nome'))
            .annotate(novos_alunos=Count('id'))
            .order_by('-novos_alunos')
        )

        total_sum = novos_alunos.aggregate(total_sum=Sum('novos_alunos'))['total_sum']

        return Response({"novos_alunos": novos_alunos, "total_sum": total_sum})


class PlanosAlunosAtivosViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = AlunoPlanoFilter
    serializer_class = serializers.PlanosAlunosAtivosSerializer
    queryset = AlunoPlano.objects.all()

    def list(self, request, *args, **kwargs):
        academia_id = request.query_params.get('academia')
        if not academia_id:
            return Response({"error": "O parâmetro 'academia' é obrigatório na URL."}, status=400)

        planos = (
            AlunoPlano.objects.filter(active=True, plano__active=True, plano__academia__id=academia_id)
            .values('plano__nome')
            .annotate(total_alunos=Count('aluno'))
            .order_by('-total_alunos')
        )

        total_sum = planos.aggregate(total_sum=Sum('total_alunos'))['total_sum']

        data = [{'plano': plano['plano__nome'], 'alunos_ativos': plano['total_alunos']} for plano in planos]
        return Response({"planos": data, "total_sum": total_sum})