from django_filters import rest_framework as filters

from academia import models

class AcademiaFilter(filters.FilterSet):
    id_usuario = filters.NumberFilter(field_name='usuarioacademia__usuario', lookup_expr='exact' )
    class Meta:
        model = models.Academia
        fields = ['id','id_usuario','nome']



class FrequenciaFilter(filters.FilterSet):
    data_inicio = filters.DateFilter(field_name='data', lookup_expr='gte')
    data_fim = filters.DateFilter(field_name='data', lookup_expr='lte')
    academia = filters.NumberFilter(field_name='academia__id')
    aluno = filters.NumberFilter(field_name='aluno__id')

    class Meta:
        model = models.Frequencia
        fields = ['data_inicio', 'data_fim', 'academia', 'aluno']