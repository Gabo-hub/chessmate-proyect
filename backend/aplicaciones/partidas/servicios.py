from typing import Dict, Optional
from django.db import transaction
from aplicaciones.motor_ajedrez.tablero import Tablero
from aplicaciones.motor_ajedrez.minimax import MotorIA
from .modelos import Partida, Movimiento

class ServicioPartida:

    def __init__(self):
        self.motores_ai = {}

    @transaction.atomic
    def crear_partida(self, usuario, dificultad: str='campeon', modo_juego: str='vs_ia', tema: str='olimpo') -> Partida:
        partida = Partida(jugador_blanco=usuario, estado='jugando' if modo_juego == 'vs_ia' else 'esperando', dificultad=dificultad, modo_juego=modo_juego, tema=tema)
        partida.save()
        return partida

    @transaction.atomic
    def ejecutar_movimiento(self, partida: Partida, movimiento_uci: str) -> Dict:
        tablero = Tablero.desde_fen(partida.fen)
        origen, destino = self._parsear_uci(movimiento_uci)
        pieza = tablero.obtener_pieza_en(origen)
        if pieza is None:
            return {'exito': False, 'error': 'No hay pieza en la posición de origen'}
        turno_esperado = 'blancas' if pieza.color.value == 'blanca' else 'negras'
        if turno_esperado != partida.turno_actual:
            return {'exito': False, 'error': 'No es tu turno'}
        movimientos_validos = pieza.obtener_movimientos_validos(tablero)
        if destino not in movimientos_validos:
            return {'exito': False, 'error': 'Movimiento no válido'}
        fen_antes = tablero.a_fen()
        turno_antes = partida.turno_actual
        pieza_destino = tablero.obtener_pieza_en(destino)
        del tablero._casillas[origen]
        pieza._posicion = destino
        tablero._casillas[destino] = pieza
        from aplicaciones.motor_ajedrez.piezas.base import ColorPieza
        tablero._turno_actual = ColorPieza.NEGRA if tablero._turno_actual == ColorPieza.BLANCA else ColorPieza.BLANCA
        san = self._calcular_san(pieza, origen, destino, pieza_destino)
        numero_movimiento = Movimiento.objects.filter(partida=partida).count() + 1
        movimiento_bd = Movimiento(partida=partida, numero_movimiento=numero_movimiento, color=turno_antes, san=san, uci=movimiento_uci, fen_antes=fen_antes, fen_despues=tablero.a_fen())
        movimiento_bd.save()
        nuevo_turno = 'negras' if turno_antes == 'blancas' else 'blancas'
        partida.turno_actual = nuevo_turno
        partida.fen = tablero.a_fen()
        resultado = self._verificar_fin_juego(tablero, partida)
        if not resultado:
            partida.save()
        return {'exito': True, 'estado': partida.estado if resultado else 'jugando', 'turno': nuevo_turno, 'jaque': tablero.esta_en_jaque(), 'jaque_mate': resultado.get('jaque_mate', False) if resultado else False, 'empate': resultado.get('empate', False) if resultado else False}

    def obtener_movimiento_ai(self, partida: Partida) -> Optional[str]:
        tablero = Tablero.desde_fen(partida.fen)
        dificultad = partida.dificultad
        if dificultad not in self.motores_ai:
            self.motores_ai[dificultad] = MotorIA(dificultad)
        motor = self.motores_ai[dificultad]
        mejor_movimiento = motor.obtener_mejor_movimiento(tablero)
        return mejor_movimiento

    def _parsear_uci(self, uci: str) -> tuple:
        archivos = 'abcdefgh'
        origen_archivo = uci[0]
        origen_rango = int(uci[1])
        destino_archivo = uci[2]
        destino_rango = int(uci[3])
        origen = (8 - origen_rango, archivos.index(origen_archivo))
        destino = (8 - destino_rango, archivos.index(destino_archivo))
        return (origen, destino)

    def _calcular_san(self, pieza, origen, destino, pieza_destino) -> str:
        archivos = 'abcdefgh'
        if pieza.simbolo() == 'P' and pieza_destino:
            columna_origen = archivos[origen[1]]
            return f'{columna_origen}x{archivos[destino[1]]}{8 - destino[0]}'
        captura = 'x' if pieza_destino else ''
        simbolo = pieza.simbolo() if pieza.simbolo() != 'P' else ''
        destino_str = f'{archivos[destino[1]]}{8 - destino[0]}'
        return f'{simbolo}{captura}{destino_str}'

    def _verificar_fin_juego(self, tablero: Tablero, partida: Partida) -> Optional[Dict]:
        resultado = {}
        if tablero.es_jaque_mate():
            if tablero.turno_actual.value == 'blanca':
                partida.estado = 'negras_ganan'
            else:
                partida.estado = 'blancas_ganan'
            resultado['jaque_mate'] = True
        elif tablero.es_empate():
            partida.estado = 'empate'
            resultado['empate'] = True
        if resultado:
            partida.save()
            return resultado
        return None