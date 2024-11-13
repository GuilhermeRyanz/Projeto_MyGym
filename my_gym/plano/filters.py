from django_filters import rest_framework as filters
from plano import models

class PlanoFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='academia', lookup_expr='exact' )
    active = filters.BooleanFilter(field_name='active', lookup_expr='exact')

    class Meta:
        model = models.Plano
        fields = ['id','nome']
