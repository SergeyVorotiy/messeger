from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

from .views import chat_list, chat_detail, chat_messages, user_list, change_user


urlpatterns = [
    path('chat_list/', chat_list),
    path('chat_list/<int:pk>/', chat_detail),
    path('chat_list/<int:pk>/messages/', chat_messages),
    path('chenge_user/', change_user),
    path('api-auth/', include('rest_framework.urls')),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('user_list/', user_list),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)