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
        nome = request.data.get('nome')
        telefone = request.data.get('telefone')
        email = request.data.get('email')
        id_academia = request.data.get('id_academia')
        id_plano = request.data.get('id_plano')

        aluno = Aluno(nome=nome, telefone=telefone, email=email)
        aluno.save()

        AlunoAcademia.objects.create(id_aluno=aluno, id_academia_id=id_academia)
        AlunoPlano.objects.create(id_aluno=aluno, id_plano_id=id_plano)

        serializer = self.get_serializer(aluno)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
