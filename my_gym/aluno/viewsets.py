from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from aluno import params_serializer, models
from aluno.filters import AlunoPlanoFilter, AlunoFilter
from aluno.models import Aluno
from aluno.serializers import AlunoSerializer, AlunoPlanoSerializer
from core.auth import get_tokens_for_user
from core.permissions import AcademiaPermissionMixin
from usuario.models import Usuario


class AlunoViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Aluno.objects.all()
    serializer_class = AlunoSerializer
    filterset_class = AlunoFilter


class AlunoPlanoViewSet(viewsets.ModelViewSet):
    queryset = models.AlunoPlano.objects.all().distinct()
    serializer_class = AlunoPlanoSerializer
    filterset_class = AlunoPlanoFilter

    def get_queryset(self):
        return models.AlunoPlano.objects.filter(
            plano__academia__usuarioacademia__usuario=self.request.user
        ).order_by('aluno__id', '-active').distinct("aluno__id")

    @action(detail=False, methods=['POST'])
    def alterar_plano(self, request, *args, **kwargs):
        ps = params_serializer.AlterarPlanoParamSerializer(data=request.data)
        ps.is_valid(raise_exception=True)
        plano, aluno = ps.validated_data.values()

        models.AlunoPlano.objects.filter(
            aluno=aluno,
            plano__academia=plano.academia,
            active=True
        ).update(active=False)

        models.AlunoPlano.objects.update_or_create(
            aluno=aluno,
            plano=plano,
            defaults={
                'active': True
            }
        )
        return Response(data={'status': 'Aluno cadastrado em plano'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def desativar_aluno(self, request, pk=None):
        try:
            aluno = models.Aluno.objects.get(id=pk)

            try:
                aluno_plano = models.AlunoPlano.objects.get(aluno=aluno, active=True,
                                                            plano__academia=request.data['academia'])

                aluno_plano.active = False
                aluno_plano.save()

                return Response(
                    {
                        'status': 'Aluno desativado com sucesso!',
                        'aluno_plano': AlunoPlanoSerializer(aluno_plano).data
                    },
                    status=status.HTTP_200_OK
                )

            except models.AlunoPlano.DoesNotExist:
                return Response(
                    {'erro': "Aluno não possui um plano ativo."},
                    status=status.HTTP_404_NOT_FOUND
                )

        except models.Aluno.DoesNotExist:
            return Response(
                {'erro': "Aluno não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AuthTokenViewAluno(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            usuario = get_object_or_404(Usuario, email=username)
        except Exception as e:
            raise NotFound("Usuário não encontrado.")

        user = usuario

        if not user.check_password(password):
            raise PermissionDenied("Credenciais inválidas")

        tokens = get_tokens_for_user(usuario)
        access_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
        return Response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'email': usuario.email,
            'name': usuario.nome,
        })
