from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from academia.models import Academia
from aluno.models import AlunoPlano
from plano.models import Plano


class PlanoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    preco = serializers.DecimalField(max_digits=10, decimal_places=2)
    descricao = serializers.CharField(default="Acesso total áacademia por um mes")
    duracao = serializers.IntegerField(default=1)
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


class PlanosAlunosAtivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlunoPlano
        fields = '__all__'

    def validate(self, data):

        request = self.context.get('request')

        if request and request.user.usuario.tipo_usuario not in ["G", "D"]:
            raise ValidationError({"academia": "Tipo de usuário inválido para essa funcionalidade."})

        academia = request.query_params.get('academia')
        if not academia:
            raise ValidationError({"academia": "O parâmetro 'academia' é obrigatório na URL."})

        return data
