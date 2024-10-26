from operator import truediv

from rest_framework import serializers

from academia.models import Academia, UsuarioAcademia
from usuario.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'tipo_usuario']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        usuario = Usuario(
            username=validated_data['username'],
            email=validated_data['email'],
            tipo_usuario=validated_data['tipo_usuario']
        )
        usuario.set_password(validated_data['password'])
        usuario.save()
        return usuario

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Esse e-mail já está cadastrado.")

        return value

class FuncionarioSerializer(serializers.ModelSerializer):
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all(), write_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password','tipo_usuario','academia']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        academia = validated_data.pop('academia')

        user = Usuario.objects.create(**validated_data)

        UsuarioAcademia.objects.create(usuario=user, academia=academia )

        return user


