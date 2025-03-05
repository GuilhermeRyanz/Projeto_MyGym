from email.policy import default

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from academia.models import Academia
from aluno.models import AlunoPlano
from plano.models import Plano, TipoBeneficio, Beneficio, DiasSemana

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from academia.models import Academia
from aluno.models import AlunoPlano
from plano.models import Plano, TipoBeneficio, Beneficio


class BeneficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficio
        fields = ['id', 'tipo_beneficio', 'descricao', 'desconto_percentual']

    def validate(self, data):
        tipo_beneficio = data.get('tipo_beneficio')
        desconto_percentual = data.get('desconto_percentual')

        if tipo_beneficio == TipoBeneficio.DESCONTO:
            if desconto_percentual is None:
                raise ValidationError("O desconto percentual é obrigatório quando o tipo de benefício é 'Desconto'.")
            if desconto_percentual < 0 or desconto_percentual > 100:
                raise ValidationError("O desconto percentual deve ser entre 0 e 100.")

        return data


class PlanoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    preco = serializers.DecimalField(max_digits=10, decimal_places=2)
    descricao = serializers.CharField(default="Acesso total à academia por um mês")
    duracao = serializers.IntegerField(default=1)
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())
    dias_permitidos = serializers.ListField(
        child=serializers.ChoiceField(choices=DiasSemana.choices),
        required=False
    )
    beneficios = BeneficioSerializer(many=True, required=False)

    class Meta:
        model = Plano
        fields = ['id', 'nome', 'preco', 'descricao', 'duracao', 'beneficios', 'academia', 'dias_permitidos']

    def validate_user_permission(self):
        request = self.context.get('request')
        if request.user.usuario.tipo_usuario == "A":
            raise ValidationError("Tipo de usuário inválido")

    def create(self, validated_data):
        self.validate_user_permission()

        beneficios_data = validated_data.pop('beneficios', [])
        plano = Plano.objects.create(**validated_data)

        for beneficio_data in beneficios_data:
            beneficio = Beneficio.objects.create(**beneficio_data)
            plano.beneficios.add(beneficio)

        return plano

    def update(self, instance, validated_data):
        beneficios_data = validated_data.pop('beneficios', [])
        instance = super().update(instance, validated_data)

        if beneficios_data:
            instance.beneficios.clear()
            for beneficio_data in beneficios_data:
                beneficio = Beneficio.objects.create(**beneficio_data)
                instance.beneficios.add(beneficio)

        return instance


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
