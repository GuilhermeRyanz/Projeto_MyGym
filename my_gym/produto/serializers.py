from produto.models import Produto, LoteProduto
from rest_framework import serializers



class ProdutoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Produto
        fields = '__all__'


class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoteProduto
        fields = '__all__'

