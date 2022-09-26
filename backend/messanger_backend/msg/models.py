import datetime

from django.contrib.auth.models import User
from django.db import models

class MessageModel(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey('ChatModel', on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        str = '{'
        str += f'date: {self.date},' \
               f'author: {self.author.username},' \
               f'text: {self.text},' \
               f'chat: {self.chat.chat_name}'
        str += '}'
        return str


class ChatModel(models.Model):
    chat_name = models.CharField(max_length=120, default='new chat')
    author = models.ForeignKey(User, related_name='author', on_delete=models.CASCADE)
    messages = models.ManyToManyField('MessageModel', blank=True)
    recipients = models.ManyToManyField(User, related_name='recipients')
    last_message_date = models.DateTimeField(auto_now_add=True)

    def update_date(self):
        self.last_message_date = datetime.datetime.now()
        self.save()

    def new_message(self, author, text):
        message = MessageModel.objects.create(author=author, text=text, chat=self)
        self.messages.add(message)
        self.update_date()
        self.save()
        return message

    def __str__(self):
        str = '{'
        str += f'chat_name: {self.chat_name},' \
               f'author: {self.author.username},' \
               f'recipients: {self.recipients.all()},' \
               f'last_message_date: {self.last_message_date}'
        str += '}'
        return str

    class Meta:
        ordering = ['-last_message_date']
