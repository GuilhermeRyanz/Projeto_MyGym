from rest_framework import serializers

from academia.models import Academia
from aluno.models import Aluno
from plano.models import Plano


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    nome = serializers.CharField(max_length=100)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    id_academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())
    id_plano = serializers.PrimaryKeyRelatedField(queryset=Plano.objects.all())

    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'telefone', 'id_academia', 'id_plano']