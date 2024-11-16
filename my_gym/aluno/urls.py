from rest_framework import routers
from aluno import views

router = routers.DefaultRouter()

router.register('alunos', views.AlunoViewSet)

router.register('alunoPlano', views.AlunoPlanoViewSet)

urlpatterns = router.urls
