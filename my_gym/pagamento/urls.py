from rest_framework import routers
from pagamento import views

router = routers.DefaultRouter()

router.register('pagamentos', views.PagamentoViewSet)

urlpatterns = router.urls