from rest_framework import routers
from usuario import views

router = routers.DefaultRouter()

router.register('usuarios', views.UsuarioViewSet)

router.register('funcionarios', views.FuncionarioViewSet)

urlpatterns = router.urls