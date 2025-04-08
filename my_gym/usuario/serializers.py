from django.db import IntegrityError
from rest_framework import serializers
from academia.models import Academia, UsuarioAcademia
from usuario.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    academia = serializers.PrimaryKeyRelatedField(queryset=Academia.objects.all(), write_only=True, required=False)
    username = serializers.EmailField(max_length=100, )
    nome = serializers.CharField(max_length=100)
    data_de_contratacao = serializers.SerializerMethodField()


    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'username', 'password', 'tipo_usuario', 'academia', 'data_de_contratacao']

        extra_kwargs = {'password': {'write_only': True}}

    def get_data_de_contratacao(self, obj):
        request = self.context.get('request')
        if not request:
            return None

        try:
            usuario_academia = UsuarioAcademia.objects.get(usuario=obj, active=True)
            data = usuario_academia.data_contratacao
            return data.strftime("%d/%m/%Y")
        except UsuarioAcademia.DoesNotExist:
            return None

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
                raise serializers.ValidationError("email", "Este email já está sendo utilizado.")
            raise serializers.ValidationError(f"Erro inesperado: {str(e)}")

        return usuario

    def update(self, instance, validated_data):

        request = self.context.get('request')

        usuario = self.instance

        if usuario.tipo_usuario == Usuario.TipoUsuario.DONO:
            raise serializers.ValidationError("Erro tipo dono não pode ser alterado.")

        try:

            if request.user.usuario.tipo_usuario == Usuario.TipoUsuario.ATENDENTE:
                raise serializers.ValidationError("error","Esse tipo de usuario nao pode editar outros")

            instance.username = validated_data.get('username', instance.username)

            if 'password' in validated_data:
                instance.set_password(validated_data['password'])

            if 'tipo_usuario' in validated_data:
                instance.tipo_usuario = validated_data.get('tipo_usuario', instance.tipo_usuario)

            if "nome" in validated_data:
                instance.nome = validated_data.get('nome', instance.nome)

            instance.save()

        except IntegrityError as e:
            if 'auth_user_username_key' in str(e):
                raise serializers.ValidationError("Este email já está sendo utilizado.")
            raise serializers.ValidationError(f"Erro inesperado: {str(e)}")

        return instance
