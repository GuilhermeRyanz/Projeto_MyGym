from attr.setters import validate
from rest_framework import serializers

from academia.actions import AcademiaActions
from academia.models import Academia, Frequencia, Gasto
from aluno.models import Aluno, AlunoPlano
from academia.models import UsuarioAcademia
from pagamento.models import Pagamento
from django.utils import timezone

from plano.models import dias_semana_default, DiasSemana


class AcademiaSerializer(serializers.ModelSerializer,):

    id = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100, required=True)
    endereco = serializers.CharField(max_length=100, required=False)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    email = serializers.EmailField(allow_blank=True)



    class Meta:
        model = Academia
        fields = "__all__"

    def create(self, validated_data):
        request = self.context.get('request')
        academia = super().create(validated_data)
        UsuarioAcademia.objects.create(
            academia=academia,
            usuario=request.user,
            tipo_usuario=request.user.tipo_usuario,
        )
        return academia


    def validate_email(self, value):
        if self.instance:
            if Academia.objects.filter(email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Já existe uma academia com esse email cadastrado")
        else:
            if Academia.objects.filter(email=value).exists():
                raise serializers.ValidationError("Já existe uma academia com esse email cadastrado")
        return value


class FrequenciaSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())
    aluno = serializers.PrimaryKeyRelatedField(queryset=Aluno.objects.all())
    data = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Frequencia
        fields = "__all__"

    def validate(self, data):
        aluno = data['aluno']
        academia = data['academia']
        AcademiaActions.check_in_aluno(aluno, academia)
        return data


class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = '__all__'
