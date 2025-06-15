from rest_framework import routers
from aluno import viewsets
from aluno.viewsets import WorkOutPlanViewSet, WorkoutDayViewSet, WorkoutExerciseViewSet

router = routers.DefaultRouter()
router.register('alunos', viewsets.AlunoViewSet)
router.register('alunoPlano', viewsets.AlunoPlanoViewSet)
router.register(r'workoutPlan', WorkOutPlanViewSet)
router.register(r'days', WorkoutDayViewSet)
router.register(r'workoutExercise', WorkoutExerciseViewSet)
urlpatterns = router.urls
