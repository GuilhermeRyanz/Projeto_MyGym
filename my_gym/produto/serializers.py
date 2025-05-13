from django.db.models import Sum
from rest_flex_fields import FlexFieldsModelSerializer

import produto
from my_gym.service import upload_data_to_minio
from produto.actions import LoteActions
from produto.models import Produto, LoteProduto
from rest_framework import serializers

class LoteSerializer(serializers.ModelSerializer):

    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())
    foto_url = serializers.URLField(source='foto', read_only=True)
    preco_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    preco_unitario = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    quantidade = serializers.IntegerField(required=True)

    def create(self, validated_data):
        quantidade = validated_data.get('quantidade')
        preco_total = validated_data.get('preco_total')

        if quantidade and preco_total:
            try:
                preco_unitario = LoteActions.cal_unit_price(preco_total, quantidade)
                validated_data['preco_unitario'] = preco_unitario
            except Exception:
                raise serializers.ValidationError("Erro ao calcular o preço unitário.")
        else:
            raise serializers.ValidationError(
                "Quantidade e preço de custo são obrigatórios para calcular o preço unitário.")

        return super().create(validated_data)


    class Meta:
        model = LoteProduto
        fields = '__all__'

class ProdutoSerializer(FlexFieldsModelSerializer):
    quantidade_estoque = serializers.SerializerMethodField()

    foto = serializers.ImageField(write_only=True, required=False)
    foto_url = serializers.URLField(source='foto', read_only=True)

    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'descricao', 'preco', 'foto', 'foto_url', 'categoria',
            'academia', 'data_cadastro', 'quantidade_estoque', 'created_at', 'modified_at',
            'marca'
        ]
        expandable_fields = {
            'lotes': (LoteSerializer, {'source': 'lote_produto', 'many': True}),
        }

    def get_quantidade_estoque(self, obj):
        return obj.lote_produto.aggregate(
            total=Sum('quantidade')
        )['total'] or 0

    def create(self, validated_data):
        request = self.context.get('request')
        foto_send = request.FILES.get('foto')

        if foto_send:
            foto_url = upload_data_to_minio(foto_send, foto_send.name, "data-media")
            validated_data['foto'] = foto_url
        else:
            validated_data['foto'] = None

        return super().create(validated_data)

    def update(self, instance, validated_data):

        request = self.context.get('request')
        foto_send = request.FILES.get('foto')

        if foto_send:
            foto_url = upload_data_to_minio(foto_send, instance.nome, "data-media")
            validated_data['foto'] = foto_url
        else:
            validated_data['foto'] = None

        return super().update(instance, validated_data)
