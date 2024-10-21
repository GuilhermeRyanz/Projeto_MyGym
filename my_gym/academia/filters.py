from django_filters import rest_framework as filters

from academia import models

class AcademiaFilter(filters.FilterSet):
    id_usuario = filters.NumberFilter(field_name='usarioacademia__id_usuario', lookup_expr='exact' )
    class Meta:
        model = models.Academia
        fields = ['id','id_usuario','nome']


class FrequenciaFilter(filters.FilterSet):
    data = filters.DateFilter(field_name='data', lookup_expr='exact' )
    class Meta:
        model = models.Frequencia
        fields = ['id','id_aluno','id_academia','data']