from enum import unique

from django.db import IntegrityError
from rest_framework import serializers
from academia.models import Academia, UsuarioAcademia
from usuario.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all(), write_only=True, required=False)
    username = serializers.EmailField(max_length=100, )
    nome = serializers.CharField(max_length=100)

    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'username', 'password', 'tipo_usuario', 'academia']

        extra_kwargs = {'password': {'write_only': True}}

    def validate_academia(self, value):
        request_user = self.context['request'].user
        if not UsuarioAcademia.objects.filter(usuario=request_user.usuario, academia=value).exists():
            raise serializers.ValidationError("Você não tem permissão para associar um usuário a esta academia.")
        return value

    def create(self, validated_data):
        academia = validated_data.pop('academia', None)

        if validated_data['tipo_usuario'] in [Usuario.TipoUsuario.ATENDENTE,
                                              Usuario.TipoUsuario.GERENTE] and not academia:
            raise serializers.ValidationError("O campo 'academia' é obrigatório para usuários desse tipo.")

        try:
            usuario = Usuario(
                username=validated_data['username'],
                tipo_usuario=validated_data['tipo_usuario'],
                nome=validated_data['nome']
            )
            usuario.set_password(validated_data['password'])
            usuario.save()

            if usuario.tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
                UsuarioAcademia.objects.create(usuario=usuario, academia=academia, tipo_usuario=usuario.tipo_usuario)

        except IntegrityError as e:
            if 'auth_user_username_key' in str(e):
                raise serializers.ValidationError("Este email já está sendo utilizado.")
            raise serializers.ValidationError(f"Erro inesperado: {str(e)}")

        return usuario

    def update(self, instance, validated_data):

        request = self.context.get('request')

        if request.user.usuario.tipo_usuario == Usuario.TipoUsuario.ATENDENTE:
            raise serializers.ValidationError("Esse tipo de usuario nao pode editar outros")

        instance.username = validated_data.get('username', instance.username)

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        if 'tipo_usuario' in validated_data:
            instance.tipo_usuario = validated_data.get('tipo_usuario', instance.tipo_usuario)

        instance.save()

        return instance

    def delete(self, instance):
        request = self.context.get('request')
        user_type = request.user.usuario.tipo_usuario

        if user_type == Usuario.TipoUsuario.ATENDENTE:
            raise serializers.ValidationError("Esse tipo de usuário não pode apagar outros.")

        instance.delete()