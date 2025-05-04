from rest_framework import routers

from venda import viewsets

router = routers.DefaultRouter()

router.register('vendas', viewsets.VendaViewSet)

urlpatterns = router.urls