from django_filters import rest_framework as filters
from plano import models

class PlanoFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='academia', lookup_expr='exact' )
    active = filters.BooleanFilter(field_name='active', lookup_expr='exact')
    plano = filters.NumberFilter(field_name='plano', lookup_expr='exact')
    search = filters.CharFilter(method='filter_busca', label='search')

    def filter_busca(self, queryset, name, value):
        if value:
            return queryset.filter(nome__icontains=value)
        return queryset

    class Meta:
        model = models.Plano
        fields = ['id','nome', 'preco', 'descricao', 'duracao', 'desconto', 'academia', 'active', 'plano']