from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer


from academia.models import UsuarioAcademia
from aluno.models import AlunoPlano, Aluno
from aluno.serializers import AlunoSerializer
from produto.models import LoteProduto
from produto.serializers import ProdutoSerializer
from usuario.serializers import UsuarioSerializer
from venda.models import ItemVenda, Venda


class ItemVendaSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ItemVenda
        fields = ['produto', 'quantidade', 'preco_unitario']
        expandable_fields = {
            'produto': ProdutoSerializer,
        }

    def validate(self, data):
        produto = data['produto']
        quantidade = data['quantidade']

        estoque_total = sum(
            lote.quantidade
            for lote in LoteProduto.objects.filter(produto=produto, quantidade__gt=0)
        )

        if quantidade > estoque_total:
            raise serializers.ValidationError(f"Estoque insuficiente para o produto '{produto.nome}'.")

        return data


class VendaSerializer(FlexFieldsModelSerializer):
    itens = ItemVendaSerializer(many=True)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Aluno.objects.all(), allow_null=True)
    valor_total = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)

    def create(self, validated_data):
        request = self.context.get('request')
        itens_data = validated_data.pop('itens')
        academia = validated_data['academia']
        vendedor = request.user.usuario
        cliente = validated_data.get('cliente')

        try:
            if not UsuarioAcademia.objects.get(active=True, academia=academia, usuario=vendedor):
                raise serializers.ValidationError("Usuário não possui credenciais para a academia.")
        except ObjectDoesNotExist:
            raise serializers.ValidationError("Usuário não possui vínculo com a academia.")

        total = 0
        for item_data in itens_data:
            produto = item_data['produto']
            quantidade = item_data['quantidade']
            preco_unitario = item_data.get('preco_unitario') or produto.preco
            subtotal = preco_unitario * quantidade
            total += subtotal

        if cliente:
            alunoPlano = AlunoPlano.objects.filter(aluno=cliente).select_related('plano').first()
            if alunoPlano and alunoPlano.plano and alunoPlano.plano.desconto:
                desconto = alunoPlano.plano.desconto or 0
                total -= total * (desconto / 100)

        total = round(total, 2)

        venda = Venda.objects.create(
            **validated_data,
            vendedor=vendedor,
            valor_total=total,
        )

        for item_data in itens_data:
            produto = item_data['produto']
            quantidade = item_data['quantidade']
            preco_unitario = item_data.get('preco_unitario') or produto.preco

            self._descontar_estoque(produto, quantidade)

            ItemVenda.objects.create(
                venda=venda,
                produto=produto,
                quantidade=quantidade,
                preco_unitario=preco_unitario,
            )

        return venda

    def _descontar_estoque(self, produto, quantidade):
        lotes = LoteProduto.objects.filter(produto=produto, quantidade__gt=0).order_by('data_validade')
        restante = quantidade

        for lote in lotes:
            if restante == 0:
                break
            if lote.quantidade <= restante:
                restante -= lote.quantidade
                lote.quantidade = 0
            else:
                lote.quantidade -= restante
                restante = 0
            lote.save()

        if restante > 0:
            raise serializers.ValidationError(f"Estoque insuficiente para o produto '{produto.nome}'.")

    class Meta:
        model = Venda
        fields = ['id', 'academia', 'vendedor', 'cliente', 'valor_total', 'data_venda', 'itens']
        expandable_fields = {
            'cliente': AlunoSerializer,
            'vendedor': UsuarioSerializer,
            'itens': (ItemVendaSerializer, {'many': True}),
        }