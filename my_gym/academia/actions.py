from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.response import Response

from academia import models
from aluno.models import AlunoPlano
from pagamento.models import Pagamento
from plano.models import DiasSemana, Plano


class AcademiaActions:

    @staticmethod
    def check_in_aluno(aluno, academia):
        pagamento = Pagamento.objects.filter(
            aluno_plano__aluno_id=aluno,
            aluno_plano__active=True
        ).order_by('-data_vencimento').first()

        if pagamento:
            if pagamento.data_vencimento < timezone.now().date():
                raise serializers.ValidationError("Pagamento expirado!")
        else:
            raise serializers.ValidationError("Não há pagamentos válidos registrado para esse aluno no plano atual.")

        alunos_plano = AlunoPlano.objects.filter(
            aluno=aluno,
            active=True,
            plano__academia=academia
        ).first()

        if not alunos_plano:
            raise serializers.ValidationError("Aluno não possui plano na academia ativo")

        today = timezone.now().weekday()

        print(today)

        if today not in alunos_plano.plano.dias_permitidos:
            dias_permitidos = [DiasSemana(dia).label for dia in alunos_plano.plano.dias_permitidos]
            raise serializers.ValidationError(
                f"Dia não permitido para este plano. Dias permitidos: {', '.join(dias_permitidos)}"
            )

    @staticmethod
    def disable(academia):
            try:
                usuario_academia = models.UsuarioAcademia.objects.filter(academia=academia, active=True)
                usuario_academia.update(active=False)
                planos = Plano.objects.filter(academia=academia, active=True)
                for plano in planos:
                    aluno_plano = AlunoPlano.objects.filter(plano=plano, active=True)
                    aluno_plano.update(active=False)
                    plano.active = False
                    plano.save()

                return Response(
                    {
                        'status': 'Academia desativada',
                    },
                    status=status.HTTP_200_OK
                )
            except models.Academia.DoesNotExist:
                return Response({'erro': "Academia não existe"})