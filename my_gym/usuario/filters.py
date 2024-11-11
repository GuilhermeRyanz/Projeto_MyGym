from django_filters import rest_framework as filters

from usuario.models import Usuario


class UsuarioFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='usuarioacademia__academia', lookup_expr='exact' )
    class Meta:
        model = Usuario
        fields = ['id','nome',]
