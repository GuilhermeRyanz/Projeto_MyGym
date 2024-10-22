from django_filters import rest_framework as filters
from plano import models

class PlanoFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='id_academia', lookup_expr='exact' )
    class Meta:
        model = models.Plano
        fields = ['id','nome']
