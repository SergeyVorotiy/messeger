from django.urls import path, include

from rest_framework import routers

from .views import ChatViewSet, MessageViewSet


router = routers.DefaultRouter()
router.register(r'chat', ChatViewSet)
router.register(r'message', MessageViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('auth-api/', include('rest-framework', namespace='rest_framework.urls'))
]