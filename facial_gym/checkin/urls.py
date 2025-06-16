# checkin/urls.py

from django.urls import path
from .views import FacialDataUploadView, FacialRecognitionView

urlpatterns = [
    # Rota para o upload dos dados faciais que criamos.
    # A URL final será: /api/upload/
    path('upload/', FacialDataUploadView.as_view(), name='facial-data-upload'),

    # Futuramente, você pode adicionar outras rotas aqui, como a de verificação do check-in.
    # Exemplo: path('verify/', SuaViewDeCheckin.as_view(), name='facial-verify'),
    path('recognize/', FacialRecognitionView.as_view(), name='facial-recognition'),
]