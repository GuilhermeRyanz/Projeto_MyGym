from rest_framework import routers
from usuario import viewsets

router = routers.DefaultRouter()

router.register('usuarios', viewsets.UsuarioViewSet)

urlpatterns = router.urls