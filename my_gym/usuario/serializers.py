from rest_framework import serializers
from academia.models import Academia, UsuarioAcademia
from core.permissions import UsuarioPermission
from usuario.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    academia = serializers.PrimaryKeyRelatedField(
        queryset=Academia.objects.all(),
        write_only=True,
        required=False)
    nome = serializers.CharField(max_length=100)


    class Meta:
        model = Usuario
        fields = ['nome', 'id', 'username', 'password', 'tipo_usuario', 'academia']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_academia(self, value):

        request_user = self.context['request'].user
        if not UsuarioAcademia.objects.filter(usuario=request_user.usuario, academia=value).exists():
            raise serializers.ValidationError("Você não tem permissão para associar um usuário a esta academia.")
        return value

    def create(self, validated_data):
        academia = validated_data.pop('academia', None)

        if validated_data['tipo_usuario'] in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE] and not academia:
            raise serializers.ValidationError("O campo 'academia' é obrigatório para usuários desse tipo.")

        usuario = Usuario(
            username=validated_data['username'],
            tipo_usuario=validated_data['tipo_usuario'],
            nome=validated_data['nome']
        )
        usuario.set_password(validated_data['password'])
        usuario.save()

        if usuario.tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
            UsuarioAcademia.objects.create(usuario=usuario, academia=academia, tipo_usuario=usuario.tipo_usuario)

        return usuario



