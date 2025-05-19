from datetime import timedelta

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action


from produto.filters import ProdutoFilter
from produto.models import Produto, LoteProduto
from produto.serializers import ProdutoSerializer, LoteSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all().filter()
    serializer_class = ProdutoSerializer
    filterset_class = ProdutoFilter


    def get_queryset(self):
        return Produto.objects.filter(
            academia__usuarioacademia__usuario=self.request.user,
            active=True
        )

class LoteViewSet(viewsets.ModelViewSet):
    queryset = LoteProduto.objects.all()
    serializer_class = LoteSerializer

# from datetime import timedelta
#
# from django.db.models import Sum, Case, When, Value, BooleanField, F
# from django.utils import timezone
# from django_filters.rest_framework import DjangoFilterBackend
# from django.shortcuts import render
# from rest_framework import viewsets
# from rest_framework.decorators import action
#
#
# from produto.filters import ProdutoFilter
# from produto.models import Produto, LoteProduto
# from produto.serializers import ProdutoSerializer, LoteSerializer
# from venda.models import ItemVenda
#
#
# class ProdutoViewSet(viewsets.ModelViewSet):
#     queryset = Produto.objects.all().filter()
#     serializer_class = ProdutoSerializer
#     filterset_class = ProdutoFilter
#
#
#     def get_queryset(self):
#         data_limite = timezone.now() - timedelta(days=30)
#         academia_id = self.request.query_params.get('academia')
#         vendas = ItemVenda.objects.filter(
#             venda__data_venda__gte=data_limite,
#             venda__academia=academia_id,
#             active=True
#         ).values('produto_id').annotate(total_vendido=Sum('quantidade')).order_by('total_vendido')
#
#         bottom_vendidos = [v['produto_id'] for v in vendas[:5]]
#
#         return Produto.objects.filter(
#             academia__usuarioacademia__usuario=self.request.user,
#             active=True
#         ).annotate(
#             is_baixo_estoque=Case(
#                 is_baixo_estoque=Case(
#                     When (quantidade_estoque__lte=F('estoque_minimo'), then=Value(True)),
#                     default=Value(False),
#                     output_field=BooleanField()
#                 ),
#                 is_bottom_vendido=Case(
#                     When(id__in=bottom_vendidos, then=Value(True)),
#                     default=Value(False),
#                     output_field=BooleanField()
#                 )
#             )
#         )
#
#
# class LoteViewSet(viewsets.ModelViewSet):
#     queryset = LoteProduto.objects.all()
#     serializer_class = LoteSerializer
#
