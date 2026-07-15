from .base import Pieza, ColorPieza
from typing import List, Tuple

class Rey(Pieza):

    def __init__(self, color: ColorPieza, posicion: Tuple[int, int]):
        super().__init__(color, posicion)
        self._simbolo = 'R'
        if color == ColorPieza.BLANCA:
            self._nombre_griego = 'Zeus'
        else:
            self._nombre_griego = 'Hades'

    def obtener_movimientos_validos(self, tablero: 'Tablero') -> List[Tuple[int, int]]:
        movimientos = []
        fila, columna = self._posicion
        direcciones = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
        for cambio_fila, columna_cambio in direcciones:
            nueva_fila = fila + cambio_fila
            nueva_columna = columna + columna_cambio
            nueva_posicion = (nueva_fila, nueva_columna)
            if self._es_posicion_valida(nueva_posicion, tablero):
                pieza_destino = tablero.obtener_pieza_en(nueva_posicion)
                if pieza_destino is None or pieza_destino.color != self.color:
                    movimientos.append(nueva_posicion)
        movimientos_enroque = self._verificar_enroque(tablero)
        movimientos.extend(movimientos_enroque)
        return movimientos

    def _verificar_enroque(self, tablero: 'Tablero') -> List[Tuple[int, int]]:
        movimientos_enroque = []
        if self._ha_movido:
            return movimientos_enroque
        fila = self._posicion[0]
        for columna_torre in [0, 7]:
            pieza_torre = tablero.obtener_pieza_en((fila, columna_torre))
            if pieza_torre is not None and pieza_torre.simbolo() == 'T' and (pieza_torre.color == self.color) and (not pieza_torre.ha_movido):
                columna_inicio = min(self._posicion[1], columna_torre) + 1
                columna_fin = max(self._posicion[1], columna_torre)
                hay_obstaculo = False
                for columna in range(columna_inicio, columna_fin):
                    if tablero.obtener_pieza_en((fila, columna)) is not None:
                        hay_obstaculo = True
                        break
                if not hay_obstaculo:
                    columna_enroque = 6 if columna_torre == 7 else 2
                    movimientos_enroque.append((fila, columna_enroque))
        return movimientos_enroque

    def simbolo(self) -> str:
        return 'R'

    def nombre_griego(self) -> str:
        return self._nombre_griego