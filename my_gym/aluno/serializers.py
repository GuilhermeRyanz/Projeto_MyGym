
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from aluno.models import Aluno
from datetime import datetime


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    matricula = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(allow_blank=True)
    cpf = serializers.CharField(max_length=15)
    telefone = serializers.CharField(max_length=100, allow_blank=True)


    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'email', 'telefone',"cpf", 'matricula',]

    def validate_email(self, value):
        if Aluno.objects.filter(email=value).exists():
            raise ValidationError("Este email já está cadastrado.")
        return value

    def validate_cpf(self, value):
        if Aluno.objects.filter(cpf=value, active=True).exists():
            raise ValidationError("Esse cps já esta cadastrado.")
        return value

