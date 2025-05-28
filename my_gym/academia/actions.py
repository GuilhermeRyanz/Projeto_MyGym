from django.utils import timezone
from rest_framework import serializers

from aluno.models import AlunoPlano
from pagamento.models import Pagamento
from plano.models import DiasSemana

class AcademiaActions:

    @staticmethod
    def CheckInAluno(aluno, academia):
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

        today = timezone.now().weekday() + 1

        if today not in alunos_plano.plano.dias_permitidos:
            dias_permitidos = [DiasSemana(dia).label for dia in alunos_plano.plano.dias_permitidos]
            raise serializers.ValidationError(
                f"Dia não permitido para este plano. Dias permitidos: {', '.join(dias_permitidos)}"
            )