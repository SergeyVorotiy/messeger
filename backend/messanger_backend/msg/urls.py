from django.urls import path, include

from rest_framework import routers

from .views import ChatViewSet, MessageViewSet, chat_list


router = routers.DefaultRouter()
router.register(r'chat', ChatViewSet)
router.register(r'message', MessageViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('get_chats/', chat_list),
    path('api-auth/', include('rest_framework.urls')),
]