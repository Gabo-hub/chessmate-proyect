from typing import Tuple
from .tablero import Tablero
from .piezas.base import ColorPieza

class ValidadorMovimientos:

    def __init__(self):
        pass

    def es_valido(self, tablero: Tablero, movimiento: 'Movimiento') -> bool:
        pieza = tablero.obtener_pieza_en(movimiento.origen)
        if pieza is None:
            return False
        movimientos_validos = pieza.obtener_movimientos_validos(tablero)
        if movimiento.destino not in movimientos_validos:
            return False
        return self._verificar_jaque_despues(tablero, pieza, movimiento.destino)

    def _verificar_jaque_despues(self, tablero: Tablero, pieza, destino: Tuple[int, int]) -> bool:
        posicion_original = pieza.posicion
        pieza_destino = tablero.obtener_pieza_en(destino)
        turno_anterior = tablero.turno_actual
        del tablero._casillas[posicion_original]
        pieza._posicion = destino
        tablero._casillas[destino] = pieza
        en_jaque = tablero.esta_en_jaque(pieza.color)
        del tablero._casillas[destino]
        pieza._posicion = posicion_original
        tablero._casillas[posicion_original] = pieza
        if pieza_destino:
            tablero._casillas[destino] = pieza_destino
        return not en_jaque

class Movimiento:

    def __init__(self, origen: Tuple[int, int], destino: Tuple[int, int]):
        self.origen = origen
        self.destino = destino