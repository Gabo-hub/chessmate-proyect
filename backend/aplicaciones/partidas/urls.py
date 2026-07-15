from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import vistas
from . import vistas_mapas
router = DefaultRouter()
router.register('partidas', vistas.VistaConjuntoPartida)
urlpatterns = [path('', include(router.urls)), path('mapas/tablero/<str:tema>/', vistas_mapas.obtener_mapa_tablero, name='mapa_tablero'), path('mapas/puzzle/<str:puzzle_id>/', vistas_mapas.obtener_mapa_puzzle, name='mapa_puzzle')]