from rest_framework import routers
from aluno import viewsets

router = routers.DefaultRouter()

router.register('alunos', viewsets.AlunoViewSet)

router.register('alunoPlano', viewsets.AlunoPlanoViewSet)

urlpatterns = router.urls
