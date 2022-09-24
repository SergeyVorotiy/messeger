from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class ChatModel(models.Model):
    chatName = models.CharField(max_length=128, default='New chat')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    recipient = models.ManyToManyField(User, through='RecipientChat')
    message = models.ForeignKey('Message', on_delete=models.CASCADE)


class RecipientChat(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(ChatModel, on_delete=models.CASCADE)


class Message(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
