from datetime import datetime, timedelta
from decimal import Decimal
from pickle import FALSE

from django.db.models import Count, Sum, F, ExpressionWrapper, DecimalField
from django.db.models.functions import ExtractWeekDay, ExtractHour
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from academia import models, serializers, filters
from academia.filters import FrequenciaFilter
from academia.models import Frequencia, Academia, Gasto
from academia.serializers import FrequenciaSerializer, GastoSerializer
from aluno.models import AlunoPlano
from core.permissions import AcademiaPermissionMixin
from rest_framework.decorators import action
from rest_framework import status
from venda.models import Venda, ItemVenda

from pagamento.models import Pagamento
from plano.models import Plano


class AcademiaViewSet(viewsets.ModelViewSet):
    queryset = models.Academia.objects.all()
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = filters.AcademiaFilter
    serializer_class = serializers.AcademiaSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return models.Academia.objects.filter(
            usuarioacademia__usuario=self.request.user,
            usuarioacademia__active=True
        )

    @action(detail=True, methods=['POST'])
    def desativar_academia(self, request, pk=None):
        try:
            academia = models.Academia.objects.get(pk=pk)

            try:
                usuario_academia = models.UsuarioAcademia.objects.filter(academia=academia, active=True)
                usuario_academia.update(active=False)
                planos = Plano.objects.filter(academia=academia, active=True)
                for plano in planos:
                    aluno_plano = AlunoPlano.objects.filter(plano=plano, active=True)
                    aluno_plano.update(active=False)
                    plano.active = False
                    plano.save()

                return Response(
                    {
                        'status': 'Academia desativada',
                    },
                    status=status.HTTP_200_OK
                )
            except models.Academia.DoesNotExist:
                return Response({'erro': "Academia não existe"})

        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def month_balance(self, request):
        data = request.query_params.get("data")
        academia = request.query_params.get("academia")

        try:
            mes = int(data.split('-')[1])
            ano = int(data.split('-')[0])
        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        def to_decimal(value):
            return Decimal('0') if value is None else Decimal(str(value))

        pagamentos = Pagamento.objects.filter(
            aluno_plano__plano__academia__id=academia,
            data_pagamento__year=ano,
            data_pagamento__month=mes,
        )
        total_mensalidades = to_decimal(pagamentos.aggregate(total=Sum('valor'))['total'])
        detalhamento_mensalidades = pagamentos.values(
            'aluno_plano__plano__nome'
        ).annotate(
            total=Sum('valor')
        )

        itens_venda = ItemVenda.objects.filter(
            venda__academia__id=academia,
            venda__data_venda__year=ano,
            venda__data_venda__month=mes,
        )
        total_vendas = to_decimal(itens_venda.aggregate(total=Sum('total'))['total'])
        detalhamento_vendas = itens_venda.values(
            'produto__categoria'
        ).annotate(
            total=Sum('total')
        )

        gastos = Gasto.objects.filter(
            academia__id=academia,
            data__year=ano,
            data__month=mes,
        )
        total_gastos = to_decimal(gastos.aggregate(total=Sum('valor'))['total'])
        detalhamento_gastos = gastos.values(
            'tipo'
        ).annotate(
            total=Sum('valor')
        )

        return Response({
            'mensalidades': {
                'total': float(total_mensalidades),  # Convert to float for JSON serialization
                'detalhamento': [
                    {
                        'aluno_plano__plano__nome': item['aluno_plano__plano__nome'],
                        'total': float(item['total'])  # Convert to float for JSON
                    } for item in detalhamento_mensalidades
                ]
            },
            'vendas': {
                'total': float(total_vendas),
                'detalhamento': [
                    {
                        'produto__categoria': item['produto__categoria'],
                        'total': float(item['total'])
                    } for item in detalhamento_vendas
                ]
            },
            'gastos': {
                'total': float(total_gastos),
                'detalhamento': [
                    {
                        'tipo': item['tipo'],
                        'total': float(item['total'])
                    } for item in detalhamento_gastos
                ]
            },
            'balanço mensal': {
                'total': float(total_mensalidades + total_vendas - total_gastos)  # Ensure Decimal math
            }
        })
class FrequenciaViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Frequencia.objects.all()
    serializer_class = serializers.FrequenciaSerializer
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = filters.FrequenciaFilter
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return models.Academia.objects.filter(
            usuarioacademia__usuario=self.request.user
        )


class FrequenciaDiaHoraViewSet(viewsets.ModelViewSet):
    queryset = Frequencia.objects.all()
    serializer_class = FrequenciaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = FrequenciaFilter
    permissions_class = [permissions.IsAuthenticated, ]

    def get_queryset(self):

        academia_id = self.request.query_params.get('academia')

        academias = Academia.objects.filter(usuarioacademia__usuario=self.request.user)

        return Frequencia.objects.filter(academia__in=academias, academia=academia_id)

    def list(self, request, *args, **kwargs):
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        if not data_inicio or not data_fim:
            return Response({'error': 'Datas de início e fim são obrigatórias.'}, status=400)

        if data_inicio > data_fim:
            return Response({'error': 'A data de início não pode ser maior que a data de fim.'}, status=400)

        try:
            data_inicio = datetime.strptime(data_inicio, '%Y-%m-%d')
            data_fim = datetime.strptime(data_fim, '%Y-%m-%d') + timedelta(days=1)
        except ValueError:
            return Response({'error': 'Formato de data inválido. Use AAAA-MM-DD.'}, status=400)

        frequencias = self.get_queryset().filter(data__range=[data_inicio, data_fim])

        dias_semana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

        alunos_por_dia = (
            frequencias.annotate(dia_semana=ExtractWeekDay('data'))
            .values('dia_semana')
            .annotate(total=Count('id'))
        )

        alunos_por_dia_dict = {dia: 0 for dia in dias_semana}
        for item in alunos_por_dia:
            dia_semana = dias_semana[item['dia_semana'] - 1]
            alunos_por_dia_dict[dia_semana] = item['total']

        alunos_por_hora = (
            frequencias.annotate(hora=ExtractHour('data'))
            .values('hora')
            .annotate(total=Count('id'))
        )

        alunos_por_hora_dict = {f"{hora:02d}:00": 0 for hora in range(24)}
        for item in alunos_por_hora:
            hora = f"{item['hora']:02}:00"
            alunos_por_hora_dict[hora] = item['total']

        return Response({
            'alunos_por_dia': alunos_por_dia_dict,
            'alunos_por_hora': alunos_por_hora_dict
        })


class GastoViewSets(viewsets.ModelViewSet):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer
    filterset_class = filters.GastoFilter
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return Gasto.objects.filter(
            academia__usuarioacademia__usuario=self.request.user,
            academia__usuarioacademia__active=True
        )
