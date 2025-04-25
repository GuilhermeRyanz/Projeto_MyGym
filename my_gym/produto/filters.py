from django.db.models import Q, Exists, OuterRef
from django_filters import rest_framework as filters

class ProdutoFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='academia__id', lookup_expr='exact')
    nome = filters.CharFilter(field_name='nome', lookup_expr='icontains')
    categoria = filters.CharFilter(field_name='categoria', lookup_expr='icontains')

    search = filters.CharFilter(method='filter_busca', label='search')

    def filter_busca(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(nome__icontains=value) | Q(categoria__icontains=value)
            )
        return queryset
