from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from academia.models import Academia
from plano.models import Plano


class PlanoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    preco = serializers.DecimalField(max_digits=10, decimal_places=2)
    descricao = serializers.CharField(default="Acesso total áacademia por um mes")
    duracao = serializers.IntegerField(default=1)
    # tipo_acesso = serializers.CharField(default="Total")
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())

    class Meta:
        model = Plano
        fields = ['active', 'id', 'nome', 'preco', 'descricao', 'duracao', 'academia']

    def validate_user_permission(self):
        request = self.context.get('request')
        if request.user.usuario.tipo_usuario == "A":
            raise ValidationError("Tipo de usuario invalido")


    def create(self, validated_data):
        self.validate_user_permission()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self.validate_user_permission()
        return super().update(instance, validated_data)
