from rest_framework import routers
from plano import views

router = routers.DefaultRouter()

router.register('planos', views.PlanoViewSet)

urlpatterns = router.urls