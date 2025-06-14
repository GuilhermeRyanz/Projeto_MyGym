from datetime import datetime, timedelta

from django.db.models import Count
from django.db.models.functions import ExtractWeekDay, ExtractHour
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from academia import models, serializers, filters, actions, managers
from academia.filters import FrequenciaFilter
from academia.models import Frequencia, Academia, Gasto, Exercice
from academia.serializers import FrequenciaSerializer, GastoSerializer
from core.permissions import AcademiaPermissionMixin


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

    @action(detail=True, methods=['POST'], permission_classes=[permissions.IsAuthenticated, ])
    def desativar_academia(self, request, pk=None):
        academia = models.Academia.objects.get(pk=pk)
        rs = actions.AcademiaActions.disable(academia)
        return Response(rs.data, status=rs.status_code)



    @action(detail=False, methods=['GET'], permission_classes=[permissions.IsAuthenticated, ])
    def month_balance(self, request):
        rs = managers.DashBoardsManagers.get_month_balance(request)
        return Response(rs.data, status=rs.status_code)

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

    @action(detail=True, methods=['POST'], permission_classes=[permissions.IsAuthenticated])
    def disable(self, request, pk=None):
        gasto = self.get_object()

        if not gasto.active:
            return Response({"status": "gasto já está desativado"}, status=400)

        gasto.active = False
        gasto.save()

        # Se for um gasto de produto, desative o lote correspondente
        if gasto.tipo == 'produtos':
            from produto.models import LoteProduto

            try:
                partes = gasto.descricao.split(" uni. de ")
                if len(partes) == 2:
                    quantidade = int(partes[0])
                    nome_produto = partes[1]

                    lote = LoteProduto.objects.filter(
                        produto__nome=nome_produto,
                        quantidade=quantidade,
                        preco_unitario__gt=0,
                        active=True
                    ).order_by('-created_at').first()

                    if lote:
                        lote.active = False
                        lote.produto.quantidade_estoque -= quantidade
                        lote.produto.save()
                        lote.save()
            except Exception as e:
                # (Opcional) Log do erro
                print("Erro ao tentar desativar lote relacionado ao gasto:", e)

        return Response({"status": "gasto desativado"})


class ExerciceViewSets(viewsets.ModelViewSet):
    queryset = Exercice.objects.all()
    serializer_class = serializers.ExerciceSerializer
    filters
    permission_classes = [permissions.IsAuthenticated, ]