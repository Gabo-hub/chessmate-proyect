from rest_framework import serializers
from .modelos import Partida, Movimiento

class MovimientoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movimiento
        fields = ['id', 'numero_movimiento', 'color', 'san', 'uci', 'fen_antes', 'fen_despues', 'evaluacion', 'profundidad', 'created_at']
        read_only_fields = ['id', 'created_at']

class PartidaSerializer(serializers.ModelSerializer):
    movimientos = MovimientoSerializer(many=True, read_only=True)

    class Meta:
        model = Partida
        fields = ['id', 'jugador_blanco', 'jugador_negro', 'estado', 'turno_actual', 'fen', 'dificultad', 'modo_juego', 'tema', 'movimientos', 'created_at', 'updated_at', 'finished_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'finished_at']

    def create(self, validated_data):
        usuario = self.context['request'].user
        partida = Partida(jugador_blanco=usuario, **validated_data)
        partida.save()
        return partida