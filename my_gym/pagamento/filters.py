from django_filters import rest_framework as filters
from pagamento.models import Pagamento


class PagamentoFilter(filters.FilterSet):
    aluno = filters.CharFilter(field_name='aluno', lookup_expr='exact')
    academia = filters.CharFilter(field_name='academia', lookup_expr='exact')



    class Meta:
        model = Pagamento
        fields = ['aluno_plano__aluno__id']