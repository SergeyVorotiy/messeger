import datetime

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ChatModel, MessageModel
from .serializers import ChatSerializer, MessageSerializer


@login_required
@api_view(['GET', 'POST'])
def chat_list(request):
    if request.method == 'GET':
        list_of_chats = []
        for chat in ChatModel.objects.all():
            if request.user == chat.author or request.user in chat.recipients.all():
                list_of_chats.append(chat)
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


@api_view(['GET', 'PUT', 'DELETE'])
def chat_detail(request, pk):
    try:
        chat = ChatModel.objects.get(id=pk)
    except ChatModel.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if chat.author != request.user and request.user not in chat.recipients.all():
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        serializer = ChatSerializer(chat)
        
        return Response(serializer.data)
    elif request.method == 'DELETE':
        if chat.author == request.user:
            chat.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        data = request.data
        data['last_message_date'] = datetime.datetime.now()
        author = chat.author
        data['author'] = author.id
        serializer = ChatSerializer(chat, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def chat_messages(request, pk):
    chat = ChatModel.objects.get(id=pk)
    if request.method == 'GET':
        messages = MessageModel.objects.filter(chat=chat)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        author = request.user
        data['author'] = author.id
        data['chat'] = chat.id
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            message = chat.new_message(author=author, text=data['text'])
            serializer = MessageSerializer(instance=message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
