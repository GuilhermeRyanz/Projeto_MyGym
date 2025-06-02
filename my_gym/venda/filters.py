from boto3 import client
from django.db.models import Q
from django_filters import rest_framework as filters

from venda.models import Venda


class VendaFilter(filters.FilterSet):

    academia = filters.NumberFilter(field_name='academia__id', lookup_expr='exact')
    vendedor = filters.NumberFilter(field_name='vendedor__id', lookup_expr='exact')
    data = filters.DateRangeFilter(field_name='data_venda')

    search = filters.CharFilter(method='search_filter', label='Search' )

    def search_filter(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(itens__produto__nome__icontains=value) | Q(itens__produto__categoria__icontains=value) | Q(vendedor__nome__icontains=value) | Q(cliente__nome__icontains=value)
            )
        return queryset

    class Meta:
        model = Venda
        fields = ['academia', 'vendedor', 'cliente']