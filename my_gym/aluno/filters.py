from django_filters import rest_framework as filters
from aluno.models import Aluno

class AlunoFilter(filters.FilterSet):
    nome_aluno = filters.CharFilter(field_name='alunos_academia__id_aluno__nome', lookup_expr='icontains' )
    academia = filters.NumberFilter(field_name='alunos_academia__id_academia', lookup_expr='exact' )
    matricula = filters.CharFilter(field_name='matricula', lookup_expr='exact')
    nome_plano = filters.CharFilter(field_name='alunos_plano__id_plano__nome', lookup_expr='icontains')

    class Meta:
        Model = Aluno
        fields = ['id','matricula','nome']

