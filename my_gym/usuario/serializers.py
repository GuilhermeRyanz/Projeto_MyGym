from rest_framework import serializers
from usuario.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password','tipo_usuario']
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