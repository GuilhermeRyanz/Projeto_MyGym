from rest_framework import routers

from plano import views

router = routers.DefaultRouter()

router.register('plano', views.PlanoViewSet)

urlpatterns = router.urls