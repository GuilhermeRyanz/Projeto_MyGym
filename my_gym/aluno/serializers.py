from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

from aluno import models
from plano import models as plano_models
from plano.serializers import PlanoSerializer


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    matricula = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(allow_blank=False)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    data_nascimento = serializers.DateField(allow_null=True)

    class Meta:
        model = models.Aluno
        fields = ['active', 'id', 'nome', 'email', 'telefone', 'matricula', "data_nascimento", ]


class AlunoPlanoSerializer(FlexFieldsModelSerializer):
    plano = serializers.PrimaryKeyRelatedField(
        queryset=plano_models.Plano.objects.all(),
        required=True
    )

    class Meta:
        model = models.AlunoPlano
        fields = ['id', 'aluno', 'active', 'created_at', 'plano']
        expandable_fields = {'aluno': AlunoSerializer, 'plano': PlanoSerializer}

    def create(self, validated_data):
        models.AlunoPlano.objects.filter(
            aluno_id=validated_data['aluno'],
            plano__academia=validated_data['plano'].academia,
            active=True
        ).update(active=False)
        return super().create(validated_data)
