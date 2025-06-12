from decimal import Decimal

from django.db.models import Sum
from rest_framework import status
from rest_framework.response import Response

from academia.models import Gasto
from pagamento.models import Pagamento
from venda.models import ItemVenda


class DashBoardsManagers:
    @staticmethod
    def get_month_balance(request):
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
            venda__active=True
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
                'total': float(total_mensalidades),
                'detalhamento': [
                    {
                        'aluno_plano__plano__nome': item['aluno_plano__plano__nome'],
                        'total': float(item['total'])
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
                'total': float(total_mensalidades + total_vendas - total_gastos)
            }
        })


