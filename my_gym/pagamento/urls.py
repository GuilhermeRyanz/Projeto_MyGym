from rest_framework import routers
from pagamento import views

router = routers.DefaultRouter()

router.register('pagamentos', views.PagamentoViewSet)

router.register( 'pagamentosPlano', views.PagamentosMensaisPorPlano, basename='Pagamento_Planos')

urlpatterns = router.urls