from operator import truediv

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from academia.models import Academia, UsuarioAcademia
from usuario.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'tipo_usuario']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        usuario = Usuario(
            username=validated_data['username'],
            tipo_usuario=validated_data['tipo_usuario']
        )
        usuario.set_password(validated_data['password'])
        usuario.save()
        return usuario


class FuncionarioSerializer(serializers.ModelSerializer):
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all(), write_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password','tipo_usuario','academia']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        academia = validated_data.pop('academia')

        user = Usuario.objects.create(**validated_data)

        UsuarioAcademia.objects.create(usuario=user, academia=academia )

        return user


