# gym_face/urls.py

from django.urls import path, include

urlpatterns = [
    # Delega todas as rotas que começam com 'api/' para o arquivo urls.py do app 'checkin'
    path('api/', include('checkin.urls')),
]