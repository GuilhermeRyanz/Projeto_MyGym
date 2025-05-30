from django.db.models import Q, Exists, OuterRef
from django_filters import rest_framework as filters

from aluno.models import Aluno, AlunoPlano


class AlunoFilter(filters.FilterSet):
    # academia = filters.NumberFilter(field_name='alunos_plano__plano__academia__id', lookup_expr='exact')
    # active_plano = filters.BooleanFilter(widget=BooleanWidget(), field_name='alunos_plano__active', lookup_expr='exact')
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
