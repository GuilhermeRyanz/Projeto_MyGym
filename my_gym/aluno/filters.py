from django.db.models import Q, Exists, OuterRef
from django.utils import timezone
from django_filters import rest_framework as filters

from aluno.models import Aluno, AlunoPlano


class AlunoFilter(filters.FilterSet):
    ativo = filters.NumberFilter(method='ativos_e_inativos')
    email = filters.CharFilter(field_name='email', lookup_expr='exact')

    def ativos_e_inativos(self, queryset, name, value):
        return self.queryset.annotate(
            has_plan=Exists(AlunoPlano.objects.filter(aluno=OuterRef('id'))),
        ).filter(
            Q(alunos_plano__active=True, alunos_plano__plano__academia__id=value) | Q(has_plan=False)
        )

    class Meta:
        model = Aluno
        fields = ['id', 'matricula', 'nome', 'email']


class AlunoPlanoFilter(filters.FilterSet):
    academia = filters.NumberFilter(field_name='plano__academia__id', lookup_expr='exact')
    aluno = filters.NumberFilter(field_name='aluno__id', lookup_expr='exact')
    nome = filters.CharFilter(field_name='aluno__nome', lookup_expr='icontains')
    matricula = filters.CharFilter(field_name='aluno__matricula', lookup_expr='icontains')
    vencido = filters.BooleanFilter(field_name='data_vencimento', lookup_expr='lte')
    plano = filters.NumberFilter(field_name='plano__id', lookup_expr='exact')
    active = filters.BooleanFilter(field_name='active', lookup_expr='exact')
    expired = filters.BooleanFilter(method='filter_expired')

    def filter_expired(self, queryset, name, value):
        if value:
            return queryset.filter(data_vencimento__lte=timezone.now())
        return queryset

    search = filters.CharFilter(method='filter_busca', label='search')

    def filter_busca(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(aluno__nome__icontains=value) | Q(aluno__matricula__icontains=value)
            )
        return queryset

    class Meta:
        model = AlunoPlano
        fields = ['active', 'academia', 'aluno', ]
