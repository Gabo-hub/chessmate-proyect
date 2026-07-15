from typing import Dict
from .tablero import Tablero
from .piezas.base import ColorPieza

class EvaluadorAjedrez:
    VALORES_PIEZAS = {'P': 100, 'C': 320, 'A': 330, 'T': 500, 'D': 900, 'R': 20000}
    TABLAS_POSICIONALES = {'P': [[0, 0, 0, 0, 0, 0, 0, 0], [50, 50, 50, 50, 50, 50, 50, 50], [10, 10, 20, 30, 30, 20, 10, 10], [5, 5, 10, 25, 25, 10, 5, 5], [0, 0, 0, 20, 20, 0, 0, 0], [5, -5, -10, 0, 0, -10, -5, 5], [5, 10, 10, -20, -20, 10, 10, 5], [0, 0, 0, 0, 0, 0, 0, 0]], 'C': [[-50, -40, -30, -30, -30, -30, -40, -50], [-40, -20, 0, 0, 0, 0, -20, -40], [-30, 0, 10, 15, 15, 10, 0, -30], [-30, 5, 15, 20, 20, 15, 5, -30], [-30, 0, 15, 20, 20, 15, 0, -30], [-30, 5, 10, 15, 15, 10, 5, -30], [-40, -20, 0, 5, 5, 0, -20, -40], [-50, -40, -30, -30, -30, -30, -40, -50]], 'A': [[-20, -10, -10, -10, -10, -10, -10, -20], [-10, 0, 0, 0, 0, 0, 0, -10], [-10, 0, 5, 10, 10, 5, 0, -10], [-10, 5, 5, 10, 10, 5, 5, -10], [-10, 0, 10, 10, 10, 10, 0, -10], [-10, 10, 10, 10, 10, 10, 10, -10], [-10, 5, 0, 0, 0, 0, 5, -10], [-20, -10, -10, -10, -10, -10, -10, -20]], 'T': [[0, 0, 0, 0, 0, 0, 0, 0], [5, 10, 10, 10, 10, 10, 10, 5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [0, 0, 0, 5, 5, 0, 0, 0]], 'D': [[-20, -10, -10, -5, -5, -10, -10, -20], [-10, 0, 0, 0, 0, 0, 0, -10], [-10, 0, 5, 5, 5, 5, 0, -10], [-5, 0, 5, 5, 5, 5, 0, -5], [0, 0, 5, 5, 5, 5, 0, -5], [-10, 5, 5, 5, 5, 5, 0, -10], [-10, 0, 5, 0, 0, 0, 0, -10], [-20, -10, -10, -5, -5, -10, -10, -20]], 'R': [[-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30], [-20, -30, -30, -40, -40, -30, -30, -20], [-10, -20, -20, -20, -20, -20, -20, -10], [20, 20, 0, 0, 0, 0, 20, 20], [20, 30, 10, 0, 0, 10, 30, 20]]}

    def __init__(self):
        pass

    def evaluar(self, tablero: Tablero) -> float:
        puntuacion = 0
        for fila in range(8):
            for columna in range(8):
                posicion = (fila, columna)
                pieza = tablero.obtener_pieza_en(posicion)
                if pieza is not None:
                    valor = self.VALORES_PIEZAS.get(pieza.simbolo(), 0)
                    simbolo = pieza.simbolo()
                    if simbolo in self.TABLAS_POSICIONALES:
                        tabla = self.TABLAS_POSICIONALES[simbolo]
                        if pieza.color == ColorPieza.NEGRA:
                            valor += tabla[7 - fila][columna]
                        else:
                            valor += tabla[fila][columna]
                    if pieza.color == ColorPieza.BLANCA:
                        puntuacion += valor
                    else:
                        puntuacion -= valor
        puntuacion += self._evaluar_seguridad_rey(tablero, ColorPieza.BLANCA)
        puntuacion -= self._evaluar_seguridad_rey(tablero, ColorPieza.NEGRA)
        puntuacion += self._evaluar_movilidad(tablero)
        return puntuacion

    def _evaluar_seguridad_rey(self, tablero: Tablero, color: ColorPieza) -> int:
        rey = tablero.obtener_rey(color)
        if rey is None:
            return 0
        seguridad = 0
        if tablero.esta_en_jaque(color):
            seguridad -= 50
        fila_rey, columna_rey = rey.posicion
        for columna in range(max(0, columna_rey - 1), min(8, columna_rey + 2)):
            pieza = tablero.obtener_pieza_en((fila_rey + 1, columna))
            if pieza is not None and pieza.simbolo() == 'P' and (pieza.color == color):
                seguridad += 10
        return seguridad

    def _evaluar_movilidad(self, tablero: Tablero) -> int:
        movimientos_blancas = self._contar_movimientos(tablero, ColorPieza.BLANCA)
        movimientos_negras = self._contar_movimientos(tablero, ColorPieza.NEGRA)
        return (movimientos_blancas - movimientos_negras) * 5

    def _contar_movimientos(self, tablero: Tablero, color: ColorPieza) -> int:
        piezas = tablero.obtener_todas_las_piezas(color)
        total_movimientos = 0
        for pieza in piezas:
            movimientos = pieza.obtener_movimientos_validos(tablero)
            total_movimientos += len(movimientos)
        return total_movimientos