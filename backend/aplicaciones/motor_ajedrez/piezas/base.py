from abc import ABC, abstractmethod
from typing import List, Tuple, Optional
from enum import Enum

class ColorPieza(Enum):
    BLANCA = 'blanca'
    NEGRA = 'negra'

class Pieza(ABC):

    def __init__(self, color: ColorPieza, posicion: Tuple[int, int]):
        if not (0 <= posicion[0] < 8 and 0 <= posicion[1] < 8):
            raise ValueError(f'Posición inválida: {posicion}. Los valores deben estar entre 0 y 7.')
        self._color = color
        self._posicion = posicion
        self._ha_movido = False
        self._simbolo = ''
        self._nombre_griego = ''

    @property
    def color(self) -> ColorPieza:
        return self._color

    @property
    def posicion(self) -> Tuple[int, int]:
        return self._posicion

    @property
    def fila(self) -> int:
        return self._posicion[0]

    @property
    def columna(self) -> int:
        return self._posicion[1]

    @property
    def ha_movido(self) -> bool:
        return self._ha_movido

    @abstractmethod
    def obtener_movimientos_validos(self, tablero: 'Tablero') -> List[Tuple[int, int]]:
        pass

    @abstractmethod
    def simbolo(self) -> str:
        pass

    @abstractmethod
    def nombre_griego(self) -> str:
        pass

    def mover_a(self, nueva_posicion: Tuple[int, int]) -> None:
        if not (0 <= nueva_posicion[0] < 8 and 0 <= nueva_posicion[1] < 8):
            raise ValueError(f'Posición inválida: {nueva_posicion}')
        self._posicion = nueva_posicion
        self._ha_movido = True

    def _es_posicion_valida(self, posicion: Tuple[int, int], tablero: 'Tablero') -> bool:
        fila, columna = posicion
        return 0 <= fila < 8 and 0 <= columna < 8

    def _obtener_posiciones_camino(self, inicio: Tuple[int, int], fin: Tuple[int, int], tablero: 'Tablero') -> List[Tuple[int, int]]:
        posiciones = []
        diferencia_fila = fin[0] - inicio[0]
        columna_diferencia = fin[1] - inicio[1]
        paso_fila = 1 if diferencia_fila > 0 else -1 if diferencia_fila < 0 else 0
        paso_columna = 1 if columna_diferencia > 0 else -1 if columna_diferencia < 0 else 0
        posicion_actual = (inicio[0] + paso_fila, inicio[1] + paso_columna)
        while posicion_actual != fin:
            posiciones.append(posicion_actual)
            posicion_actual = (posicion_actual[0] + paso_fila, posicion_actual[1] + paso_columna)
        return posiciones

    def __str__(self) -> str:
        return f'{self.simbolo()} {self._color.value}'

    def __repr__(self) -> str:
        return f'{self.__class__.__name__}({self._color.value}, {self._posicion})'