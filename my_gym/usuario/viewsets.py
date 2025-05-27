from rest_framework.decorators import action
from usuario import params_serializer
from django.db.models import Case, When, Value, IntegerField
from rest_framework.exceptions import NotFound, PermissionDenied


from django.core.exceptions import PermissionDenied, ValidationError
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from usuario import serializers
from usuario.models import Usuario
from academia.models import UsuarioAcademia
from core.auth import get_tokens_for_user
from usuario import filters


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by(
        Case(
            When(tipo_usuario='D', then=Value(0)),
            default=Value(1),
            output_field=IntegerField()
        ),
        'nome'
    )
    serializer_class = serializers.UsuarioSerializer
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = filters.UsuarioFilter

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'])
    def desativar_usuario(self, request, pk=None):

        if request.user.tipo_usuario == "A":
            return Response(
                {'erro': 'Seu cargo não tem permissão para desativar outros usuários.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:

            usuario_academia = UsuarioAcademia.objects.get(academia__usuarioacademia__usuario=request.user, usuario_id=pk)

            usuario_academia.active = False
            usuario_academia.save()

            return Response(
                {
                    'status': 'usuario desativado',
                },
                status=status.HTTP_200_OK
            )

        except UsuarioAcademia.DoesNotExist:
            return Response({'erro': "Usuario não esta ligado a essa academia."}, status=403)

    @action(detail=False, methods=['post'])
    def alterar_academia(self, request, *args, **kwargs):

        ps = params_serializer.AlterarAcademiaParamSerializer(data=request.data)
        ps.is_valid(raise_exception=True)
        academia, usuario = ps.validated_data.values()

        if usuario.tipo_usuario == Usuario.TipoUsuario.DONO:
            raise PermissionDenied(
                "usuario do tipo dono não pode ter sua academia alterada"
            )


        UsuarioAcademia.objects.filter(
            usuario=usuario,
            active=True
        ).update(active=False)

        UsuarioAcademia.objects.update_or_create(
            usuario=usuario,
            academia=academia,
            defaults={
                'active': True,
                'tipo_usuario': request.data['tipo_usuario'],
            }
        )

        if "password" in request.data:
            usuario.set_password(request.data["password"])
        if "tipo_usuario" in request.data:
            usuario.tipo_usuario = request.data["tipo_usuario"]
        if "nome" in request.data:
            usuario.nome = request.data["nome"]

        usuario.save()


        return Response(data={'status': 'Usuario vinculado a academia'}, status=status.HTTP_200_OK)


class AuthTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            usuario = get_object_or_404(Usuario, username=username)
        except Exception as e:
            raise NotFound("Usuário não encontrado.")

        if not usuario.check_password(password):
            raise PermissionDenied("Credenciais inválidas")

        tokens = get_tokens_for_user(usuario)
        access_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
        tipo_usuario = usuario.tipo_usuario

        if tipo_usuario == Usuario.TipoUsuario.DONO:
            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'email': usuario.username,
                'name': usuario.nome,
                'tipo_usuario': usuario.tipo_usuario
            })
        elif tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
            usuario_academia = UsuarioAcademia.objects.filter(usuario=usuario, active=True).first()
            if usuario_academia:
                academia = usuario_academia.academia.id
                academia_nome = usuario_academia.academia.nome
                return Response({
                    'access_token': access_token,
                    'email': usuario.username,
                    'refresh_token': refresh_token,
                    'name': usuario.nome,
                    'academia': academia,
                    'academia_nome': academia_nome,
                    'tipo_usuario': usuario.tipo_usuario,
                })
            else:
                raise PermissionDenied("Usuário não possui vínculo ativo com nenhuma academia.")

        else:
            return PermissionDenied('Tipo de usuário não reconhecido.')
