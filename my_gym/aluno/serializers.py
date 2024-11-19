from rest_framework import serializers
from aluno.models import Aluno, AlunoPlano
from plano.models import Plano
from rest_flex_fields import FlexFieldsModelSerializer

from plano.serializers import PlanoSerializer


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    matricula = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(allow_blank=True)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    data_nascimento = serializers.DateField(allow_null=True)

    class Meta:
        model = Aluno
        fields = ['active', 'id', 'nome', 'email', 'telefone', 'matricula', "data_nascimento",]


class AlunoPlanoSerializer(FlexFieldsModelSerializer):

    class Meta:
        model = AlunoPlano
        fields = ['id', 'aluno', 'active', 'created_at', 'plano']
        expandable_fields = {'aluno': AlunoSerializer, 'plano': PlanoSerializer}

    def validate(self, data):

        if data['active']:
            if AlunoPlano.objects.filter(aluno=data['aluno'], active=True).exists():
                raise serializers.ValidationError("O aluno já possui um plano ativo.")
        return data
