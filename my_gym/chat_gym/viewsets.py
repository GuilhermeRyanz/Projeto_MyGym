from django.core.serializers import serialize
from django.shortcuts import render
from chat_gym.serializers import ChatSerializer

from rest_framework import viewsets

from chat_gym.models import Chats


class ChatViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing chat messages.
    """
    queryset = Chats.objects.all()
    serializer_class = ChatSerializer
    filterset_fields = ['user', 'timestamp']

    # Add any additional methods or customizations here

# Create your views here.
