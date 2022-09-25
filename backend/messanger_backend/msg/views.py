from django.shortcuts import render

from rest_framework import viewsets

from .models import ChatModel, MessageModel
from .serializers import ChatSerializer, MessageSerializer


class ChatViewSet(viewsets.ModelViewSet):
    model = ChatModel
    serializer_class = ChatSerializer


class MessageViewSet(viewsets.ModelViewSet):
    model = MessageModel
    serializer_class = MessageSerializer
