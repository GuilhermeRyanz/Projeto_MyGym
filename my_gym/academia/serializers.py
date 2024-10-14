from rest_framework import serializers
from academia.models import Academia, Frequencia
from aluno.models import Aluno


class AcademiaSerializer(serializers.ModelSerializer):

    id = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100, required=True)
    endereco = serializers.CharField(max_length=100, required=False)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    email = serializers.EmailField(allow_blank=True)


    class Meta:
        model = Academia
        fields = ['id', 'nome', 'endereco', 'telefone', 'email',]


class FrequenciaSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    id_academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())
    id_aluno = serializers.PrimaryKeyRelatedField(queryset=Aluno.objects.all())
    data = serializers.DateField(read_only=True)

    class Meta:
        model = Frequencia
        fields = ['id', 'id_academia', 'id_aluno', 'data']