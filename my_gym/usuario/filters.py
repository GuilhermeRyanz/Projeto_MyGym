from django_filters import rest_framework as filters
from django.db.models import Exists, OuterRef, Q

from academia.models import UsuarioAcademia
from usuario.models import Usuario


class UsuarioFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='usuarioacademia__academia', lookup_expr='exact' )
    email = filters.CharFilter(field_name='username', lookup_expr='icontains')
    active = filters.BooleanFilter(method="filter_ativos")

    search = filters.CharFilter(method='filter_busca', lookup_expr='search')

    def filter_busca(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(nome__icontains=value) | Q(username__icontains=value)
            )
        return queryset

    def filter_ativos(self, queryset, name, value):
        if value:
            return queryset.annotate(
                has_academia=Exists(
                    UsuarioAcademia.objects.filter(
                        usuario=OuterRef('id'),
                        academia=self.request.query_params.get('academia'),
                        active=True
                    )
                )
            ).filter(has_academia=True)

    class Meta:
        model = Usuario
        fields = ['id','nome',]

