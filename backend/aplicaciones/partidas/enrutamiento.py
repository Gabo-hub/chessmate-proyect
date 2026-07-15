from django.urls import re_path
from . import consumidores
urlpatterns = [re_path('partida/(?P<game_id>[0-9a-f-]+)/$', consumidores.ConsumidorPartida.as_asgi())]