from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from aluno import params_serializer, models, actions
from aluno.filters import AlunoPlanoFilter, AlunoFilter, WorkoutPlanFilters
from aluno.models import Aluno
from aluno.serializers import AlunoSerializer, AlunoPlanoSerializer
from core.auth import get_tokens_for_user
from core.permissions import AcademiaPermissionMixin
from usuario.models import Usuario

from .models import WorkOutPlan, WorkoutDay, WorkoutExercise
from .serializers import WorkoutDaySerializer, WorkoutExerciseSerializer, WorkoutPlanSerializer


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
        rs = actions.AlunoPlanoActions.alter_plan(request)
        return Response(rs.data, status=rs.status_code)

    @action(detail=True, methods=['post'])
    def desativar_aluno(self, request, pk=None):
        aluno = models.Aluno.objects.get(id=pk)
        rs = actions.AlunoActions.disable(aluno, request.data['academia'])
        return Response(rs.data, status=rs.status_code)


class WorkOutPlanViewSet(viewsets.ModelViewSet):
    queryset = WorkOutPlan.objects.all().select_related('member_plan').prefetch_related('workout_days__exercises')
    serializer_class = WorkoutPlanSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = WorkoutPlanFilters


class WorkoutDayViewSet(viewsets.ModelViewSet):
    queryset = WorkoutDay.objects.all().select_related('workout_plan')
    serializer_class = WorkoutDaySerializer
    permission_classes = [IsAuthenticated]


class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    queryset = WorkoutExercise.objects.all().select_related('workout_day', 'exercise')
    serializer_class = WorkoutExerciseSerializer
    permission_classes = [IsAuthenticated]


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
