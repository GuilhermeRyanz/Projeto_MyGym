from rest_framework import routers
from plano import viewsets

router = routers.DefaultRouter()

router.register('planos', viewsets.PlanoViewSet)

router.register('planosAlunosAtivos', viewsets.PlanosAlunosAtivosViewSet)

urlpatterns = router.urls