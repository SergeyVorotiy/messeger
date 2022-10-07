from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import UserWithAvatar

class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = UserWithAvatar
        fields = ('username', 'email', 'avatar')

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = UserWithAvatar
        fields = ('username', 'email', 'avatar')