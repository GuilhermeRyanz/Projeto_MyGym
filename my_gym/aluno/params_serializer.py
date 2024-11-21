from rest_framework import serializers
from aluno import models as aluno_models
from plano import models


class AlterarPlanoParamSerializer(serializers.Serializer):
    plano = serializers.PrimaryKeyRelatedField(
        queryset=models.Plano.objects.all(),
        required=True
    )
    aluno = serializers.PrimaryKeyRelatedField(
        queryset=aluno_models.Aluno.objects.all(),
        required=True
    )
