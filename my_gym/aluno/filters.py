from django_filters import rest_framework as filters
from aluno.models import Aluno, AlunoPlano


class AlunoFilter(filters.FilterSet):
    nome_aluno = filters.CharFilter(field_name='alunos_plano__aluno__nome', lookup_expr='icontains')
    academia = filters.NumberFilter(field_name='alunos_plano__plano__academia__id', lookup_expr='exact')
    matricula = filters.CharFilter(field_name='matricula', lookup_expr='exact')
    nome_plano = filters.CharFilter(field_name='alunos_plano__plano__nome', lookup_expr='icontains')
    active = filters.BooleanFilter(field_name='alunos_plano__active', lookup_expr='exact')

    class Meta:
        model = Aluno
        fields = ['id', 'matricula', 'nome', 'active']
