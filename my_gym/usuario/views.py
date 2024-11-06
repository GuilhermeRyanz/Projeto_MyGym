from django.contrib.auth import authenticate
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from academia.models import UsuarioAcademia
from usuario import serializers
from usuario.models import Usuario
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer
    permission_classes = [permissions.AllowAny]

class FuncionarioViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FuncionarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Usuario.objects.filter(Q(tipo_usuario='A') | Q(tipo_usuario='G'))

    def perform_create(self, serializer):
        tipo_usuario = self.request.data.get('tipo_usuario')
        academia_id = self.request.data.get('academia')

        if tipo_usuario not in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
            raise serializers.ValidationError("Tipo de usuário inválido para funcionário.")

        funcionario = serializer.save(tipo_usuario=tipo_usuario)

        if academia_id and tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:

            if not UsuarioAcademia.objects.filter(usuario=funcionario, academia_id=academia_id).exists():
                UsuarioAcademia.objects.create(
                    usuario=funcionario,
                    academia_id=academia_id,
                    tipo_usuario=tipo_usuario
                )



class ObtainAuthToken(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        usuario = get_object_or_404(Usuario, username=username)

        if usuario.check_password(password):
            token, created = Token.objects.get_or_create(user=usuario)
            tipo_usuario = usuario.tipo_usuario

            if tipo_usuario == Usuario.TipoUsuario.DONO:
                return Response({
                    'token': token.key,
                    'redirect_url': '/home/dono/',
                    'academias': None,
                    'user_id': usuario.id,
                    'username': usuario.username,
                    'tipo_usuario': usuario.tipo_usuario
                })
            elif tipo_usuario in [Usuario.TipoUsuario.ATENDENTE, Usuario.TipoUsuario.GERENTE]:
                usuario_academia = UsuarioAcademia.objects.filter(usuario=usuario).first()
                if usuario_academia:
                    academia_id = usuario_academia.academia.id
                    return Response({
                        'token': token.key,
                        'redirect_url': f'/home/{tipo_usuario.lower()}/',
                        'academia_id': academia_id
                    })
                else:
                    return Response({'error': 'Nenhuma academia associada ao usuário.'}, status=400)
            else:
                return Response({'error': 'Tipo de usuário não reconhecido.'}, status=400)

        return Response({'error': 'Credenciais inválidas'}, status=400)