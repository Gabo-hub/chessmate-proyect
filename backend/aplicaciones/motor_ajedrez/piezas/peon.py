from .base import Pieza, ColorPieza
from typing import List, Tuple

class Peon(Pieza):

    def __init__(self, color: ColorPieza, posicion: Tuple[int, int]):
        super().__init__(color, posicion)
        self._simbolo = 'P'
        self._nombre_griego = 'Hoplita' if color == ColorPieza.BLANCA else 'Esqueleto'

    def obtener_movimientos_validos(self, tablero: 'Tablero') -> List[Tuple[int, int]]:
        movimientos = []
        fila, columna = self._posicion
        direccion = -1 if self.color == ColorPieza.BLANCA else 1
        nueva_fila = fila + direccion
        nueva_posicion = (nueva_fila, columna)
        if self._es_posicion_valida(nueva_posicion, tablero) and tablero.obtener_pieza_en(nueva_posicion) is None:
            movimientos.append(nueva_posicion)
            if not self._ha_movido:
                posicion_doble = (fila + 2 * direccion, columna)
                if self._es_posicion_valida(posicion_doble, tablero) and tablero.obtener_pieza_en(posicion_doble) is None:
                    movimientos.append(posicion_doble)
        captura_izquierda = (nueva_fila, columna - 1)
        if self._es_posicion_valida(captura_izquierda, tablero):
            pieza_captura = tablero.obtener_pieza_en(captura_izquierda)
            if pieza_captura is not None and pieza_captura.color != self.color:
                movimientos.append(captura_izquierda)
        captura_derecha = (nueva_fila, columna + 1)
        if self._es_posicion_valida(captura_derecha, tablero):
            pieza_captura = tablero.obtener_pieza_en(captura_derecha)
            if pieza_captura is not None and pieza_captura.color != self.color:
                movimientos.append(captura_derecha)
        return movimientos

    def simbolo(self) -> str:
        return 'P'

    def nombre_griego(self) -> str:
        return self._nombre_griego