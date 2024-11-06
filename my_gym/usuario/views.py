from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from core.permissions import AcademiaPermissionMixin
from usuario import serializers
from usuario.models import Usuario
from academia.models import UsuarioAcademia


class UsuarioViewSet(AcademiaPermissionMixin,viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        tipo_usuario = self.request.data.get('tipo_usuario')
        if tipo_usuario:
            usuario = serializer.save(tipo_usuario=tipo_usuario)

            # Criar associação com a academia apenas para ATENDENTE ou GERENTE
            if tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
                academia_id = self.request.data.get('academia')
                if academia_id:
                    # Usar get_or_create para evitar duplicação de registros na tabela UsuarioAcademia
                    UsuarioAcademia.objects.get_or_create(usuario=usuario, academia_id=academia_id, tipo_usuario=tipo_usuario)
            return usuario


class AuthTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        usuario = get_object_or_404(Usuario, username=username)

        if usuario.check_password(password):
            refresh = RefreshToken.for_user(usuario)
            access_token = refresh.access_token

            tipo_usuario = usuario.tipo_usuario
            if tipo_usuario == Usuario.TipoUsuario.DONO:
                return Response({
                    'access_token': str(access_token),
                    'redirect_url': '/home/dono/',
                    'user_id': usuario.id,
                    'username': usuario.username,
                    'tipo_usuario': usuario.tipo_usuario
                })
            elif tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
                usuario_academia = UsuarioAcademia.objects.filter(usuario=usuario).first()
                if usuario_academia:
                    academia_id = usuario_academia.academia.id
                    return Response({
                        'access_token': str(access_token),
                        'redirect_url': f'/home/{tipo_usuario.lower()}/',
                        'academia_id': academia_id
                    })
                else:
                    return Response({'error': 'Nenhuma academia associada ao usuário.'}, status=400)
            else:
                return Response({'error': 'Tipo de usuário não reconhecido.'}, status=400)

        return Response({'error': 'Credenciais inválidas'}, status=400)
