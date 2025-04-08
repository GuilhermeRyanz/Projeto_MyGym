from rest_framework import routers

from produto import views

router = routers.DefaultRouter()

router.register('produtos', views.ProdutoViewSet)

urlpatterns = router.urls