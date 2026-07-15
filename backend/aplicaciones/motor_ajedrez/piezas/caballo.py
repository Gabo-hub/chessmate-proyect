from .base import Pieza, ColorPieza
from typing import List, Tuple

class Caballo(Pieza):

    def __init__(self, color: ColorPieza, posicion: Tuple[int, int]):
        super().__init__(color, posicion)
        self._simbolo = 'C'
        self._nombre_griego = 'Centauro'

    def obtener_movimientos_validos(self, tablero: 'Tablero') -> List[Tuple[int, int]]:
        movimientos = []
        fila, columna = self._posicion
        movimientos_l = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]
        for cambio_fila, columna_cambio in movimientos_l:
            nueva_fila = fila + cambio_fila
            nueva_columna = columna + columna_cambio
            nueva_posicion = (nueva_fila, nueva_columna)
            if self._es_posicion_valida(nueva_posicion, tablero):
                pieza_destino = tablero.obtener_pieza_en(nueva_posicion)
                if pieza_destino is None or pieza_destino.color != self.color:
                    movimientos.append(nueva_posicion)
        return movimientos

    def simbolo(self) -> str:
        return 'C'

    def nombre_griego(self) -> str:
        return self._nombre_griego