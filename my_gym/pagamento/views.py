from rest_framework import viewsets, permissions
from django.db.models import Sum, F
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from core.permissions import AcademiaPermissionMixin
from pagamento import models, serializers
from pagamento.models import Pagamento
from plano.filters import PlanoFilter


class PagamentoViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Pagamento.objects.all()
    serializer_class = serializers.PagamentoSerializer
    permission_classes = [permissions.IsAuthenticated, ]


class PagamentosMensaisPorPlano(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Pagamento.objects.all()
    serializer_class = serializers.PagamentoSerializer
    permission_classes = [permissions.IsAuthenticated, ]
    filterset_class = PlanoFilter

    def list(self, request, *args, **kwargs):
        academia_id = request.query_params.get('academia')
        if not academia_id:
            return Response({"error": " Academia é obrigatório "}, status=400)

        mes = request.query_params.get('month')

        pagamentos = (
            Pagamento.objects.filter(
                aluno_plano__plano__academia=academia_id,
                data_pagamento__year=mes.split('-')[0],
                data_pagamento__month=mes.split('-')[1],
            )
            .values(planos=F('aluno_plano__plano__nome'))
            .annotate(total=Sum('valor'))
            .order_by('aluno_plano__plano__nome')
        )
        total_sum = pagamentos.aggregate(total_sum=Sum('total'))['total_sum']

        return Response(
            {"month": mes,
             "data": list(pagamentos),
             "total": total_sum})
