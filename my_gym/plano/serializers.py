from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from academia.models import Academia
from aluno.models import AlunoPlano
from plano.models import Plano


class PlanoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    preco = serializers.DecimalField(max_digits=10, decimal_places=2)
    descricao = serializers.CharField(default="Acesso total à academia por um mês")
    duracao = serializers.IntegerField(default=1)
    beneficios = serializers.ListField(
        child= serializers.CharField(), required=False
    )
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())
    desconto = serializers.DecimalField(max_digits=10, decimal_places=2)
    dias_permitidos = serializers.ListField(
        child=serializers.IntegerField(
            min_value=1, max_value=7,        ),
        required=False
    )
    total_alunos = serializers.IntegerField(read_only=True)

    class Meta:
        model = Plano
        fields = ['id', 'nome', 'preco', 'descricao', 'duracao', 'beneficios', 'desconto', 'academia', 'dias_permitidos', 'total_alunos' ,'active']

    def validate_user_permission(self):
        request = self.context.get('request')
        if request.user.usuario.tipo_usuario == "A":
            raise ValidationError("Tipo de usuário inválido")


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
