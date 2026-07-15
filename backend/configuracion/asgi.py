import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.ajustes.desarrollo')
django.setup()
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from aplicaciones.partidas.enrutamiento import urlpatterns as enrutamiento_websocket
aplicacion_http = get_asgi_application()
application = ProtocolTypeRouter({'http': aplicacion_http, 'websocket': AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter(enrutamiento_websocket)))})