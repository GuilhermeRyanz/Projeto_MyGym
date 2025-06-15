from datetime import timedelta

from django.db.models import F, Count, Sum
from django.utils.timezone import now
from rest_framework.response import Response

from aluno.models import AlunoPlano


class PlanoManagers:

    @staticmethod
    def new_member_per_plan(request):
        academia_id = request.query_params.get('academia', None)

        if academia_id is None:
            return Response({"detail": "Academia não fornecida."}, status=400)

        data_limite = now() - timedelta(days=30)

        novos_alunos = (
            AlunoPlano.objects.filter(
                modified_at__gte=data_limite,
                active=True,
                plano__academia__id=academia_id
            )
            .values(plano_nome=F('plano__nome'))
            .annotate(novos_alunos=Count('id'))
            .order_by('-novos_alunos')
        )

        total_sum = novos_alunos.aggregate(total_sum=Sum('novos_alunos'))['total_sum']

        return Response({"novos_alunos": novos_alunos, "total_sum": total_sum})