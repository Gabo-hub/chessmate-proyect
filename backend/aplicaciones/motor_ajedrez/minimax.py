from typing import Optional, Dict, List
from .tablero import Tablero
from .piezas.base import ColorPieza
from .evaluador import EvaluadorAjedrez

class MotorIA:
    CONFIGURACION_DIFFICULTY = {'humano': {'profundidad': 1, 'factor_aleatorio': 0.3}, 'campeon': {'profundidad': 2, 'factor_aleatorio': 0.1}, 'olympus': {'profundidad': 3, 'factor_aleatorio': 0.0}}

    def __init__(self, dificultad: str='campeon'):
        configuracion = self.CONFIGURACION_DIFFICULTY.get(dificultad, self.CONFIGURACION_DIFFICULTY['campeon'])
        self._profundidad_maxima = configuracion['profundidad']
        self._factor_aleatorio = configuracion['factor_aleatorio']
        self._evaluador = EvaluadorAjedrez()
        self._tabla_transposiciones: Dict[str, float] = {}

    def obtener_mejor_movimiento(self, tablero: Tablero) -> Optional[str]:
        movimientos_legales = self._obtener_movimientos_legales(tablero)
        if not movimientos_legales:
            return None
        mejor_movimiento = None
        mejor_puntuacion = float('-inf')
        for movimiento in movimientos_legales:
            pieza = tablero.obtener_pieza_en(movimiento['origen'])
            pieza_capturada = tablero.obtener_pieza_en(movimiento['destino'])
            turno_anterior = tablero.turno_actual
            del tablero._casillas[movimiento['origen']]
            pieza._posicion = movimiento['destino']
            tablero._casillas[movimiento['destino']] = pieza
            tablero._turno_actual = ColorPieza.NEGRA if tablero._turno_actual == ColorPieza.BLANCA else ColorPieza.BLANCA
            puntuacion = self._minimax(tablero, self._profundidad_maxima - 1, float('-inf'), float('inf'), False)
            del tablero._casillas[movimiento['destino']]
            pieza._posicion = movimiento['origen']
            tablero._casillas[movimiento['origen']] = pieza
            if pieza_capturada:
                tablero._casillas[movimiento['destino']] = pieza_capturada
            tablero._turno_actual = turno_anterior
            if self._factor_aleatorio > 0:
                import random
                puntuacion += random.uniform(-self._factor_aleatorio, self._factor_aleatorio) * 100
            if puntuacion > mejor_puntuacion:
                mejor_puntuacion = puntuacion
                mejor_movimiento = movimiento
        if mejor_movimiento:
            return self._a_uci(mejor_movimiento)
        return None

    def _minimax(self, tablero: Tablero, profundidad: int, alpha: float, beta: float, maximizando: bool) -> float:
        if profundidad == 0:
            return self._evaluar_posicion(tablero)
        movimientos_legales = self._obtener_movimientos_legales(tablero)
        if not movimientos_legales:
            if tablero.esta_en_jaque():
                return float('-99999') if maximizando else float('99999')
            return 0
        if maximizando:
            mejor_puntuacion = float('-inf')
            for movimiento in movimientos_legales:
                pieza = tablero.obtener_pieza_en(movimiento['origen'])
                turno_anterior = tablero.turno_actual
                pieza_capturada = tablero.obtener_pieza_en(movimiento['destino'])
                del tablero._casillas[movimiento['origen']]
                pieza._posicion = movimiento['destino']
                tablero._casillas[movimiento['destino']] = pieza
                tablero._turno_actual = ColorPieza.NEGRA if tablero._turno_actual == ColorPieza.BLANCA else ColorPieza.BLANCA
                puntuacion = self._minimax(tablero, profundidad - 1, alpha, beta, False)
                del tablero._casillas[movimiento['destino']]
                pieza._posicion = movimiento['origen']
                tablero._casillas[movimiento['origen']] = pieza
                if pieza_capturada:
                    tablero._casillas[movimiento['destino']] = pieza_capturada
                tablero._turno_actual = turno_anterior
                mejor_puntuacion = max(mejor_puntuacion, puntuacion)
                alpha = max(alpha, puntuacion)
                if beta <= alpha:
                    break
            return mejor_puntuacion
        else:
            mejor_puntuacion = float('inf')
            for movimiento in movimientos_legales:
                pieza = tablero.obtener_pieza_en(movimiento['origen'])
                turno_anterior = tablero.turno_actual
                pieza_capturada = tablero.obtener_pieza_en(movimiento['destino'])
                del tablero._casillas[movimiento['origen']]
                pieza._posicion = movimiento['destino']
                tablero._casillas[movimiento['destino']] = pieza
                tablero._turno_actual = ColorPieza.NEGRA if tablero._turno_actual == ColorPieza.BLANCA else ColorPieza.BLANCA
                puntuacion = self._minimax(tablero, profundidad - 1, alpha, beta, True)
                del tablero._casillas[movimiento['destino']]
                pieza._posicion = movimiento['origen']
                tablero._casillas[movimiento['origen']] = pieza
                if pieza_capturada:
                    tablero._casillas[movimiento['destino']] = pieza_capturada
                tablero._turno_actual = turno_anterior
                mejor_puntuacion = min(mejor_puntuacion, puntuacion)
                beta = min(beta, puntuacion)
                if beta <= alpha:
                    break
            return mejor_puntuacion

    def _obtener_movimientos_legales(self, tablero: Tablero) -> List[Dict]:
        movimientos = []
        turno_actual = tablero.turno_actual
        piezas = tablero.obtener_todas_las_piezas(turno_actual)
        for pieza in piezas:
            movimientos_pieza = pieza.obtener_movimientos_validos(tablero)
            for destino in movimientos_pieza:
                movimientos.append({'pieza': pieza, 'origen': pieza.posicion, 'destino': destino})
        return movimientos

    def _evaluar_posicion(self, tablero: Tablero) -> float:
        if tablero.es_jaque_mate():
            if tablero.turno_actual == ColorPieza.BLANCA:
                return -10000
            else:
                return 10000
        if tablero.es_empate():
            return 0
        return self._evaluador.evaluar(tablero)

    def _a_uci(self, movimiento: Dict) -> str:
        origen = movimiento['origen']
        destino = movimiento['destino']
        archivos = 'abcdefgh'
        origen_archivo = archivos[origen[1]]
        origen_rango = 8 - origen[0]
        destino_archivo = archivos[destino[1]]
        destino_rango = 8 - destino[0]
        return f'{origen_archivo}{origen_rango}{destino_archivo}{destino_rango}'