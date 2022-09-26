from django.urls import path, include

from .views import chat_list, chat_detail, chat_messages


urlpatterns = [
    path('chat_list/', chat_list),
    path('chat_list/<int:pk>/', chat_detail),
    path('chat_list/<int:pk>/messages/', chat_messages),
    path('api-auth/', include('rest_framework.urls')),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]