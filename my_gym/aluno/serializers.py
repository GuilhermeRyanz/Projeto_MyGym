
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from aluno.models import Aluno
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

