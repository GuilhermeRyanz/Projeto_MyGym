from os import error

from django.core.exceptions import PermissionDenied
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets, permissions
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
    queryset = Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = filters.UsuarioFilter

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [permissions.IsAuthenticated()]

    #
    # def perform_create(self, serializer):
    #
    #     tipo_usuario = self.request.data.get('tipo_usuario')
    #     if tipo_usuario:
    #         usuario = serializer.save(tipo_usuario=tipo_usuario)
    #
    #         if tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
    #             academia_id = self.request.data.get('academia')
    #             if academia_id:
    #                 UsuarioAcademia.objects.get_or_create(usuario=usuario, academia_id=academia_id, tipo_usuario=tipo_usuario)
    #             else:
    #                 raise PermissionDenied ("Academia Necessaria para cadastrar funcionarios")
    #
    #         return usuario




class AuthTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        usuario = get_object_or_404(Usuario, username=username)

        if not usuario.check_password(password):
            raise PermissionDenied("Credenciais inválidas")

        tokens = get_tokens_for_user(usuario)
        access_token = tokens['access_token']
        tipo_usuario = usuario.tipo_usuario

        if tipo_usuario == Usuario.TipoUsuario.DONO:
            return Response({
                'access_token': access_token,
                'email': usuario.username,
                'name': usuario.nome,
                'tipo_usuario': usuario.tipo_usuario
            })
        elif tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
            usuario_academia = UsuarioAcademia.objects.filter(usuario=usuario).first()
            if usuario_academia:
                academia = usuario_academia.academia.id
                academia_nome = usuario_academia.academia.nome
                return Response({
                    'access_token': access_token,
                    'email': usuario.username,
                    'name': usuario.nome,
                    'academia': academia,
                    'academia_nome': academia_nome,
                    'tipo_usuario': usuario.tipo_usuario,
                })
            else:
                return Response({'error': 'Nenhuma academia associada ao usuário.'}, status=400)
        else:
            return Response({'error': 'Tipo de usuário não reconhecido.'}, status=400)