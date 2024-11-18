from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from aluno.filters import AlunoFilter
from aluno.models import Aluno, AlunoPlano
from aluno.serializers import AlunoSerializer, AlunoPlanoSerializer
from core.permissions import AcademiaPermissionMixin
from plano.models import Plano
from rest_framework.decorators import action


class AlunoViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    filterset_class = AlunoFilter

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        aluno_id = response.data['id']
        aluno = Aluno.objects.get(id=aluno_id)

        plano_id = request.data.get('plano')
        if plano_id and Plano.objects.filter(id=plano_id).exists():
            AlunoPlano.objects.create(
                aluno=aluno,
                plano_id=plano_id
            )
        else:
            return Response({'error': 'Plano inválido ou não encontrado'}, status=status.HTTP_400_BAD_REQUEST)

        return response

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)


class AlunoPlanoViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = AlunoPlano.objects.all()
    serializer_class = AlunoPlanoSerializer

    @action(detail=True, methods=['post'])
    def alterar_plano(self, request, pk=None):

        aluno = Aluno.objects.get(id=pk)
        plano_id = request.data.get('novo_plano')

        try:
            novo_plano = Plano.objects.get(id=plano_id, active=True)
        except Plano.DoesNotExist:
            return Response({'error': 'Plano não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        aluno_plano_ativo = AlunoPlano.objects.filter(aluno=aluno, active=True).first()
        if aluno_plano_ativo:
            aluno_plano_ativo.active = False
            aluno_plano_ativo.save()

        aluno_plano_existente = AlunoPlano.objects.filter(aluno=aluno, plano=novo_plano).first()
        if aluno_plano_existente:
            aluno_plano_existente.active = True
            aluno_plano_existente.save()
            return Response(
                {'status': 'Aluno recadastrado no plano', 'plano': AlunoPlanoSerializer(aluno_plano_existente).data},
                status=status.HTTP_200_OK)

        nova_associacao = AlunoPlano.objects.create(
            aluno=aluno,
            plano=novo_plano
        )

        return Response({'status': 'Aluno cadastrado em plano', 'plano': AlunoPlanoSerializer(nova_associacao).data},
                        status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def desativar_aluno(self, request, pk=None):
        try:
            aluno = Aluno.objects.get(id=pk)

            try:
                aluno_plano = AlunoPlano.objects.get(aluno=aluno, active=True)

                aluno_plano.active = False
                aluno_plano.save()

                return Response(
                    {
                        'status': 'Aluno desativado com sucesso!',
                        'aluno_plano': AlunoPlanoSerializer(aluno_plano).data
                    },
                    status=status.HTTP_200_OK
                )

            except AlunoPlano.DoesNotExist:
                return Response(
                    {'erro': "Aluno não possui um plano ativo para ser desativado."},
                    status=status.HTTP_404_NOT_FOUND
                )

        except Aluno.DoesNotExist:
            return Response(
                {'erro': "Aluno não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
