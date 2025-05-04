from django_filters import rest_framework as filters

from venda.models import Venda


class VendaFilter(filters.FilterSet):

    academia = filters.NumberFilter(field_name='academia__id', lookup_expr='exact')
    vendedor = filters.NumberFilter(field_name='vendedor__id', lookup_expr='exact')

    search = filters.CharFilter(method='search_filter', label='Search' )

    def search_filter(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q
            )




    class Meta:
        model = Venda