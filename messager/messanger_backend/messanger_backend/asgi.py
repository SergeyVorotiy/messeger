"""
ASGI config for websocketlerning project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path

from msg.routing import ws_urlpatterns

from msg.consumers import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocketlerning.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket':AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                    ws_urlpatterns,
            )
        )
    ),
})
