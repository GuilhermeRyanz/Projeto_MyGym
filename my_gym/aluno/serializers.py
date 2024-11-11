
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from aluno.models import Aluno, AlunoPlano
from plano.serializers import PlanoSerializer


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    matricula = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(allow_blank=True)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    data_nascimento = serializers.DateField(allow_null=True)
    plano = serializers.SerializerMethodField()

    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'email', 'telefone', 'matricula',"data_nascimento", "plano"]


    def get_plano(self, obj):
        aluno_plano = AlunoPlano.objects.filter(aluno=obj).first()
        return PlanoSerializer(aluno_plano.plano).data if aluno_plano else None
