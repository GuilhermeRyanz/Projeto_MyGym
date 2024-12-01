from rest_framework import routers
from academia import views

router = routers.DefaultRouter()

router.register('academias', views.AcademiaViewSet)
router.register('frequencias', views.FrequenciaViewSet)

router.register('frequenciaDiaHora', views.FrequenciaDiaHoraViewSet, basename='frequencia_dia_hora')




urlpatterns = router.urls