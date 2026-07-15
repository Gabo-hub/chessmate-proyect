from .base import Pieza, ColorPieza
from typing import List, Tuple

class Alfil(Pieza):

    def __init__(self, color: ColorPieza, posicion: Tuple[int, int]):
        super().__init__(color, posicion)
        self._simbolo = 'A'
        self._nombre_griego = 'Oráculo' if color == ColorPieza.BLANCA else 'Hermes'

    def obtener_movimientos_validos(self, tablero: 'Tablero') -> List[Tuple[int, int]]:
        movimientos = []
        fila, columna = self._posicion
        direcciones = [(-1, -1), (-1, 1), (1, -1), (1, 1)]
        for cambio_fila, columna_cambio in direcciones:
            nueva_fila = fila + cambio_fila
            nueva_columna = columna + columna_cambio
            while self._es_posicion_valida((nueva_fila, nueva_columna), tablero):
                posicion_actual = (nueva_fila, nueva_columna)
                pieza_destino = tablero.obtener_pieza_en(posicion_actual)
                if pieza_destino is None:
                    movimientos.append(posicion_actual)
                elif pieza_destino.color != self.color:
                    movimientos.append(posicion_actual)
                    break
                else:
                    break
                nueva_fila += cambio_fila
                nueva_columna += columna_cambio
        return movimientos

    def simbolo(self) -> str:
        return 'A'

    def nombre_griego(self) -> str:
        return self._nombre_griego