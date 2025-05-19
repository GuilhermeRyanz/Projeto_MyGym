from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from datetime import date

from aluno import models
from aluno.models import Aluno
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
        fields = ['active', 'id', 'nome', 'email', 'telefone', 'matricula', "data_nascimento",]

    def validate_data_nascimento(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("A data de nascimento não pode ser no futuro.")
        return value

    def update(self, instance, validated_data):
        email = validated_data.get('email')

        if email and instance.email != email:
            if Aluno.objects.filter(email=email).exclude(id=instance.id).exists():
                raise serializers.ValidationError(
                    {"email": "Já existe um aluno cadastrado com esse email"}
                )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance




class AlunoPlanoSerializer(FlexFieldsModelSerializer):
    plano = serializers.PrimaryKeyRelatedField(
        queryset=plano_models.Plano.objects.all(),
        required=True
    )

    class Meta:
        model = models.AlunoPlano
        fields = ['id', 'aluno', 'active', 'created_at', 'plano', 'data_vencimento']
        expandable_fields = {'aluno': AlunoSerializer, 'plano': PlanoSerializer}

    def create(self, validated_data):
        models.AlunoPlano.objects.filter(
            aluno_id=validated_data['aluno'],
            plano__academia=validated_data['plano'].academia,
            active=True
        ).update(active=False)
        return super().create(validated_data)
