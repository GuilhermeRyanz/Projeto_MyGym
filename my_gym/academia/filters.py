from django.db.models import Q
from django_filters import rest_framework as filters

from academia import models


class AcademiaFilter(filters.FilterSet):
    id_usuario = filters.NumberFilter(field_name='usuarioacademia__usuario', lookup_expr='exact')

    class Meta:
        model = models.Academia
        fields = ['id', 'id_usuario', 'nome']


class FrequenciaFilter(filters.FilterSet):
    data_inicio = filters.DateFilter(field_name='data', lookup_expr='gte')
    data_fim = filters.DateFilter(field_name='data', lookup_expr='lte')
    academia = filters.NumberFilter(field_name='academia__id')
    aluno = filters.NumberFilter(field_name='aluno__id')

    class Meta:
        model = models.Frequencia
        fields = ['data_inicio', 'data_fim', 'academia', 'aluno']


class GastoFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='academia__id')
    search = filters.CharFilter(method="filter_busca")
    data_after = filters.DateTimeFilter(field_name='data', lookup_expr='gte')
    data_before = filters.DateTimeFilter(field_name='data', lookup_expr='lte')
    active = filters.BooleanFilter(field_name='active', lookup_expr='exact')

    def filter_busca(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(tipo__icontains=value) | Q(descricao__icontains=value)
            )
        return queryset

    class Meta:
        model = models.Gasto
        fields = ['academia', 'tipo', 'descricao', 'data', 'active']