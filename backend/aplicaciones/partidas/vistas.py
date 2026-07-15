from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .modelos import Partida, Movimiento
from .serializadores import PartidaSerializer, MovimientoSerializer
from .servicios import ServicioPartida

class VistaConjuntoPartida(viewsets.ModelViewSet):
    queryset = Partida.objects.all()
    serializer_class = PartidaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from django.db import models
        usuario = self.request.user
        return Partida.objects.filter(models.Q(jugador_blanco=usuario) | models.Q(jugador_negro=usuario))

    def create(self, request, *args, **kwargs):
        dificultad = request.data.get('dificultad', 'campeon')
        modo_juego = request.data.get('modo_juego', 'vs_ia')
        tema = request.data.get('tema', 'olimpo')
        servicio = ServicioPartida()
        partida = servicio.crear_partida(usuario=request.user, dificultad=dificultad, modo_juego=modo_juego, tema=tema)
        serializer = self.get_serializer(partida)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def mover(self, request, pk=None):
        partida = get_object_or_404(Partida, pk=pk)
        if partida.turno_actual == 'blancas' and partida.jugador_blanco != request.user:
            return Response({'error': 'No es tu turno'}, status=status.HTTP_400_BAD_REQUEST)
        if partida.turno_actual == 'negras' and partida.jugador_negro != request.user:
            return Response({'error': 'No es tu turno'}, status=status.HTTP_400_BAD_REQUEST)
        movimiento_uci = request.data.get('movimiento')
        if not movimiento_uci:
            return Response({'error': 'Movimiento no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        servicio = ServicioPartida()
        resultado = servicio.ejecutar_movimiento(partida, movimiento_uci)
        if resultado['exito']:
            return Response(resultado)
        else:
            return Response({'error': resultado.get('error', 'Movimiento inválido')}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def abandonar(self, request, pk=None):
        partida = get_object_or_404(Partida, pk=pk)
        if partida.jugador_blanco != request.user and partida.jugador_negro != request.user:
            return Response({'error': 'No eres jugador de esta partida'}, status=status.HTTP_403_FORBIDDEN)
        if partida.jugador_blanco == request.user:
            resultado = 'negras_ganan'
        else:
            resultado = 'blancas_ganan'
        partida.finalizar(resultado)
        return Response({'mensaje': 'Partida abandonada', 'resultado': resultado})

    @action(detail=True, methods=['get'])
    def movimientos(self, request, pk=None):
        partida = get_object_or_404(Partida, pk=pk)
        movimientos = Movimiento.objects.filter(partida=partida).order_by('numero_movimiento')
        serializer = MovimientoSerializer(movimientos, many=True)
        return Response(serializer.data)