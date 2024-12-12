from rest_framework import serializers
from usuario import models as usuario_models
from academia import models


class AlterarAcademiaParamSerializer(serializers.Serializer):
    academia = serializers.PrimaryKeyRelatedField(
        queryset=models.Academia.objects.all(),
        required=True
    )
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=usuario_models.Usuario.objects.all(),
        required=True
    )
