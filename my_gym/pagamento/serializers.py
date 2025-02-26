from datetime import datetime
from rest_framework import serializers

from aluno.models import AlunoPlano
from pagamento.models import Pagamento


class PagamentoSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    data_pagamento = serializers.DateField(read_only=True)
    data_vencimento = serializers.DateField(read_only=True)
    aluno_plano = serializers.PrimaryKeyRelatedField(queryset=AlunoPlano.objects.all())
    aluno_nome = serializers.CharField(source='aluno_plano.aluno.nome', read_only=True)
    academia_nome = serializers.CharField(source='aluno_plano.plano.academia', read_only=True)
    tipo_pagamento = serializers.ChoiceField(choices=Pagamento.TipoPagamento.choices)
    valor = serializers.FloatField(read_only=True)
    plano_nome = serializers.CharField(source='aluno_plano.plano.nome', read_only=True)

    class Meta:
        model = Pagamento
        fields = ['id', 'data_pagamento', 'data_vencimento', 'aluno_plano', 'aluno_nome', 'academia_nome' , 'tipo_pagamento', 'valor', 'plano_nome']

    def validate(self, data):

        aluno_plano = data['aluno_plano']
        if not aluno_plano.plano.active:
            raise serializers.ValidationError("O plano atual não está mais disponível")

        ultimo_pagamento = Pagamento.objects.filter(aluno_plano=data['aluno_plano']).order_by('-data_pagamento').first()
        if ultimo_pagamento and ultimo_pagamento.data_vencimento >= datetime.now().date():
            raise serializers.ValidationError(f"O pagamento está adiantado. Aguarde a data do proximo vencimento: {ultimo_pagamento.data_vencimento}",)
        return data
