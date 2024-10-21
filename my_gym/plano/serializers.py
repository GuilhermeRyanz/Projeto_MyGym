from rest_framework import serializers

from plano.models import Plano
from academia.models import Academia

class PlanoSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    preco  = serializers.DecimalField(max_digits=10, decimal_places=2)
    descricao = serializers.CharField(default="Acesso total áacademia por um mes")
    duracao =serializers.IntegerField(default=1)
    tipo_acesso = serializers.CharField(default="Total")
    id_academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())

    class Meta:
        model = Plano
        fields = ['id', 'nome', 'preco', 'descricao', 'duracao', 'tipo_acesso', 'id_academia']
