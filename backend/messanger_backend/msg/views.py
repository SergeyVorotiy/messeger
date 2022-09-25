from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .models import ChatModel, MessageModel
from .serializers import ChatSerializer, MessageSerializer


class ChatViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = ChatModel.objects.all()
    serializer_class = ChatSerializer


class MessageViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = MessageModel.objects.all()
    serializer_class = MessageSerializer


@login_required
@api_view(['GET', 'POST'])
def chat_list(request):
    if request.method == 'GET':
        from_author_chats = ChatModel.objects.filter(author=request.user)
        for_user_chats = ChatModel.objects.filter(recipients=request.user)
        list_of_chats = list(from_author_chats)
        list_of_chats.extend(list(for_user_chats))
        serializer = ChatSerializer(list_of_chats, many=True)
        
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        user = User.objects.get(username=request.user.username)
        data['author'] = user.id
        serializer = ChatSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)