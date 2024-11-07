from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from aluno.filters import AlunoFilter
from aluno.models import Aluno, AlunoAcademia, AlunoPlano
from aluno.serializers import AlunoSerializer
from core.permissions import AcademiaPermissionMixin


class AlunoViewSet(AcademiaPermissionMixin,viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    filterset_class = AlunoFilter

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        aluno_id = response.data['id']
        aluno = Aluno.objects.get(id=aluno_id)


        academia_id = request.data.get('academia')
        plano_id = request.data.get('plano')

        AlunoAcademia.objects.create(
            aluno=aluno,
            academia_id=academia_id
        )

        AlunoPlano.objects.create(
            aluno=aluno,
            plano_id=plano_id
        )

        return response

    def update(self, request, *args, **kwargs):
        return super().update(
            request, *args, **kwargs)

