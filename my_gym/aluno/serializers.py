
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from academia.models import Academia
from aluno.models import Aluno
from plano.models import Plano
from datetime import datetime


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    matricula = serializers.CharField(max_length=100, required=False)  # Altere para required=False
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(allow_blank=True)
    telefone = serializers.CharField(max_length=100, allow_blank=True)


    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'email', 'telefone', 'matricula',]

    def validate_email(self, value):
        if Aluno.objects.filter(email=value).exists():
            raise ValidationError("Este email já está cadastrado.")
        return value

    def create(self, validated_data):
        # Obtenha o ano atual
        ano_atual = datetime.now().year

        # Crie a matrícula personalizada
        aluno = Aluno(**validated_data)
        aluno.matricula = f"MAT-{ano_atual}-{aluno.id}"
        aluno.save()
        return aluno