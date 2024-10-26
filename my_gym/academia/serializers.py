from rest_framework import serializers
from academia.models import Academia, Frequencia
from aluno.models import Aluno
from pagamento.models import Pagamento
from django.utils import timezone


class AcademiaSerializer(serializers.ModelSerializer):

    id = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100, required=True)
    endereco = serializers.CharField(max_length=100, required=False)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    email = serializers.EmailField(allow_blank=True)


    class Meta:
        model = Academia
        fields = ['id', 'nome', 'endereco', 'telefone', 'email',]

    def validate_email(self, value):
        if Academia.objects.filter(email=value).exists():
            raise serializers.ValidationError("Já existe uma academia com esse email cadastrado")
        return  value



class FrequenciaSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all())
    aluno = serializers.PrimaryKeyRelatedField(queryset=Aluno.objects.all())
    data = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Frequencia
        fields = ['id', 'academia', 'aluno', 'data']

    def validate(self, data):
        aluno = data['aluno']
        academia = data['academia']

        pagamento = Pagamento.objects.filter(aluno=aluno, academia=academia).order_by('-data_vencimento').first()

        if pagamento:
            if pagamento.data_vencimento < timezone.now().date():
                raise serializers.ValidationError("Pagamento expirado!")
        else:
            raise serializers.ValidationError("Nenhum pagamento registrado para o aluno nesta academia.")

        return data