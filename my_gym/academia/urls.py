from rest_framework import routers
from academia import viewsets

router = routers.DefaultRouter()

router.register('academias', viewsets.AcademiaViewSet)
router.register('frequencias', viewsets.FrequenciaViewSet)

router.register('frequenciaDiaHora', viewsets.FrequenciaDiaHoraViewSet, basename='frequencia_dia_hora')




urlpatterns = router.urls