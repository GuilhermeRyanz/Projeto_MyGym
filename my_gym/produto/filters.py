from attr.setters import validate
from django.db.models import Q, Exists, OuterRef
from django_filters import rest_framework as filters

from produto.models import Produto, LoteProduto


class ProdutoFilter(filters.FilterSet):

    academia = filters.NumberFilter(field_name='academia__id', lookup_expr='exact')
    nome = filters.CharFilter(field_name='nome', lookup_expr='icontains')
    categoria = filters.CharFilter(field_name='categoria', lookup_expr='icontains')

    search = filters.CharFilter(method='search_filter', label='search')

    def search_filter(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(nome__icontains=value) | Q(categoria__icontains=value)
            )
        return queryset

    class Meta:
        model = Produto
        fields = ['academia', 'nome', 'categoria']

class LoteFilter(filters.FilterSet):

    produto = filters.NumberFilter(field_name='produto__id', lookup_expr='exact')
    validade_after = filters.DateTimeFilter(field_name='validade', lookup_expr='lte')
    validade_before = filters.DateTimeFilter(field_name='validade', lookup_expr='gte')
    create_at_after = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    create_at_before = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = LoteProduto
        fields = "__all__"

