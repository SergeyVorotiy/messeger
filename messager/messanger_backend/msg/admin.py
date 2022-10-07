from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import ChatModel, MessageModel, UserWithAvatar
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = UserWithAvatar
    list_display = ['email', 'username', 'avatar']

admin.site.register(UserWithAvatar, CustomUserAdmin)

admin.site.register(ChatModel)
admin.site.register(MessageModel)
