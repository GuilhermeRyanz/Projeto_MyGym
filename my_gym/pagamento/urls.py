from rest_framework import routers
from pagamento import viewsets

router = routers.DefaultRouter()

router.register('pagamentos', viewsets.PagamentoViewSet)

router.register( 'pagamentosPlano', viewsets.PagamentosMensaisPorPlano, basename='Pagamento_Planos')

urlpatterns = router.urls