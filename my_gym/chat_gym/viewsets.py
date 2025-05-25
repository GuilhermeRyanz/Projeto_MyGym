from cherrypy.lib.cptools import allow
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from chat_gym.behaviors import ChatBehavior

from chat_gym.models import Questions
from chat_gym.serializers import QuestionSerializer
from core.permissions import AcademiaPermissionMixin


class QuestionView(viewsets.ModelViewSet):
    queryset = Questions.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def ask_gestor(self, request):
        behavior = ChatBehavior(request)
        result = behavior.ask_gestor()
        return Response({'result': result})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def ask_persona(self, request):
        behavior = ChatBehavior(request)
        result = behavior.ask_persona()
        return Response({'result': result})