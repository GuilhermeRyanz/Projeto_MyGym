from rest_framework import routers
from aluno import views

router = routers.DefaultRouter()

router.register('alunos', views.AlunoViewSet)

urlpatterns = router.urls
