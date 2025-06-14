from rest_framework import status
from rest_framework.response import Response

from aluno import models, params_serializer
from aluno.serializers import AlunoPlanoSerializer


class AlunoActions:
    @staticmethod
    def disable(aluno, academia):
        try:
            aluno_plano = models.AlunoPlano.objects.get(aluno=aluno, active=True,
                                                        plano__academia=academia)

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
                status=status.HTTP_404_NOT_)


class AlunoPlanoActions:

    @staticmethod
    def alter_plan(request):
        try:
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
        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)
