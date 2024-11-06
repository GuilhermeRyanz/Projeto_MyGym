from rest_framework import serializers
from academia.models import Academia, UsuarioAcademia
from usuario.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    # O campo academia será opcional para os donos
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all(), write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'tipo_usuario', 'academia']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        academia = validated_data.pop('academia', None)

        # Criação do usuário com os dados fornecidos
        usuario = Usuario(
            username=validated_data['username'],
            tipo_usuario=validated_data['tipo_usuario']
        )

        # Criptografando a senha antes de salvar
        usuario.set_password(validated_data['password'])
        usuario.save()

        # Se o usuário for um "Atendente" ou "Gerente", associar a uma academia
        if usuario.tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
            if academia is None:
                raise serializers.ValidationError("O campo 'academia' é obrigatório para usuários desse tipo.")
            # Criando a associação entre o usuário e a academia
            UsuarioAcademia.objects.create(usuario=usuario, academia=academia, tipo_usuario=usuario.tipo_usuario)

        return usuario


