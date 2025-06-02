# from django.db.models import Sum
# from rest_framework import status
# from rest_framework.response import Response
#
# from academia.models import Gasto
# from pagamento.models import Pagamento
# from venda.models import ItemVenda
#
#
# class DashBoardsManagers():
#     def mont_balance(self, request):
#         data = request.query_params.get("data")
#         academia = request.query_params.get("academia")
#
#         try:
#             mes = int(data.split('-')[1])
#             ano = int(data.split('-')[0])
#         except Exception as e:
#             return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#
#         pagamentos = Pagamento.objects.filter(
#             aluno_plano__plano__academia__id=academia,
#             data_pagamento__year=ano,
#             data_pagamento__month=mes,
#         )
#         total_mensalidades = pagamentos.aggregate(total=Sum('valor'))['total'] or 0
#         detalhamento_mensalidades = pagamentos.values(
#             'aluno_plano__plano__nome'
#         ).annotate(
#             total=Sum('valor')
#         )
#
#         # VENDAS
#         itens_venda = ItemVenda.objects.filter(
#             venda__academia__id=academia,
#             venda__data_venda__year=ano,
#             venda__data_venda__month=mes,
#         )
#         total_vendas = itens_venda.aggregate(total=Sum('total'))['total'] or 0
#         detalhamento_vendas = itens_venda.values(
#             'produto__categoria'
#         ).annotate(
#             total=Sum('total')
#         )
#
#         gastos = Gasto.objects.filter(
#             academia__id=academia,
#             data__year=ano,
#             data__month=mes,
#         )
#         total_gastos = gastos.aggregate(total=Sum('valor'))['total'] or 0
#         detalhamento_gastos = gastos.values(
#             'tipo'
#         ).annotate(
#             total=Sum('valor')
#         )
#
#         return Response({
#             'mensalidades': {
#                 'total': total_mensalidades,
#                 'detalhamento': list(detalhamento_mensalidades)
#             },
#             'vendas': {
#                 'total': total_vendas,
#                 'detalhamento': list(detalhamento_vendas)
#             },
#             'gastos': {
#                 'total': total_gastos,
#                 'detalhamento': list(detalhamento_gastos)
#             }
#         })
