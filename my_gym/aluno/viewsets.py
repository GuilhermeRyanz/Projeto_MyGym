from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from aluno import params_serializer, models
from aluno.filters import AlunoPlanoFilter, AlunoFilter
from aluno.serializers import AlunoSerializer, AlunoPlanoSerializer
from core.permissions import AcademiaPermissionMixin


class AlunoViewSet(AcademiaPermissionMixin, viewsets.ModelViewSet):
    queryset = models.Aluno.objects.all()
    serializer_class = AlunoSerializer
    filterset_class = AlunoFilter


class AlunoPlanoViewSet(viewsets.ModelViewSet):
    queryset = models.AlunoPlano.objects.all()
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
                aluno_plano = models.AlunoPlano.objects.get(aluno=aluno, active=True, plano__academia=request.data['academia'])

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
