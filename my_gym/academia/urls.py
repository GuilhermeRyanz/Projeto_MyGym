from rest_framework import routers
from academia import views

router = routers.DefaultRouter()

router.register('Academias', views.AcademiaViewSet)
router.register('frequencias', views.FrequenciaViewSet)

urlpatterns = router.urls