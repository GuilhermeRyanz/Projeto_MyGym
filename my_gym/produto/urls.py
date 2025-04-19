from rest_framework import routers

from produto import viewsets

router = routers.DefaultRouter()

router.register('produtos', viewsets.ProdutoViewSet)

router.register('lotes', viewsets.LoteViewSet, basename='lotes')

urlpatterns = router.urls