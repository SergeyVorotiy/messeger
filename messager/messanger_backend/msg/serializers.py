from django.contrib.auth.models import User
from rest_framework import serializers

from .models import ChatModel, MessageModel, UserWithAvatar


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWithAvatar
        fields = [
            'id',
            'username',
            'avatar',
        ]


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatModel
        fields = [
            'id',
            'chat_name',
            'author',
            'recipients',
            'messages',
            'last_message_date',
        ]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = [
            'id',
            'date',
            'author',
            'chat',
            'text',
        ]
