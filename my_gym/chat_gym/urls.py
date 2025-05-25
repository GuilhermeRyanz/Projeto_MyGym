from rest_framework import routers
from chat_gym import viewsets

router = routers.DefaultRouter()

router.register('quest', viewsets.QuestionView)

urlpatterns = router.urls