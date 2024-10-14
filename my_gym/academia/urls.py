from rest_framework import routers
from academia import views

router = routers.DefaultRouter()

router.register('Academia', views.AcademiaViewSet)
router.register('frequencia', views.FrequenciaViewSet)

urlpatterns = router.urls