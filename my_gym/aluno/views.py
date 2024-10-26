from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from aluno.filters import AlunoFilter
from aluno.models import Aluno, AlunoAcademia, AlunoPlano
from aluno.serializers import AlunoSerializer


class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    filterset_class = AlunoFilter

    def create(self, request, *args, **kwargs):
        instance = super().create(request, *args, **kwargs)

        AlunoAcademia.objects.create(
            aluno_id=instance.data['id'],
            academia_id=request.data['id_academia'])

        AlunoPlano.objects.create(
            aluno_id=instance.data['id'],
            plano_id=request.data['id_plano']
        )

        return instance

    def update(self, request, *args, **kwargs):
        return super().update(
            request, *args, **kwargs)
