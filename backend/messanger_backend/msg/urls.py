from django.urls import path, include

from rest_framework import routers

from .views import ChatViewSet, MessageViewSet, chat_list, chat_detail, chat_messages


router = routers.DefaultRouter()
router.register(r'chatinggggrouter', ChatViewSet)
router.register(r'message', MessageViewSet)
urlpatterns = [
    # path('', include(router.urls)),
    path('chat_list/', chat_list),
    path('chat_list/<int:pk>/', chat_detail),
    path('chat_list/<int:pk>/messages/', chat_messages),
    path('api-auth/', include('rest_framework.urls')),
]