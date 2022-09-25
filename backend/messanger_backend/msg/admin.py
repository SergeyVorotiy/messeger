from django.contrib import admin

from .models import ChatModel, MessageModel


admin.site.register(ChatModel)
admin.site.register(MessageModel)
