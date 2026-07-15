from typing import Optional, List, Tuple, Dict
from .piezas.base import Pieza, ColorPieza
from .piezas.rey import Rey
from .piezas.reina import Reina
from .piezas.torre import Torre
from .piezas.alfil import Alfil
from .piezas.caballo import Caballo
from .piezas.peon import Peon

class Tablero:

    def __init__(self):
        self._casillas: Dict[Tuple[int, int], Pieza] = {}
        self._historial_movimientos: List[Dict] = []
        self._turno_actual: ColorPieza = ColorPieza.BLANCA
        self._colocar_piezas_iniciales()

    def _colocar_piezas_iniciales(self) -> None:
        for columna in range(8):
            self._colocar_pieza(Peon(ColorPieza.BLANCA, (1, columna)))
        self._colocar_pieza(Torre(ColorPieza.BLANCA, (0, 0)))
        self._colocar_pieza(Caballo(ColorPieza.BLANCA, (0, 1)))
        self._colocar_pieza(Alfil(ColorPieza.BLANCA, (0, 2)))
        self._colocar_pieza(Reina(ColorPieza.BLANCA, (0, 3)))
        self._colocar_pieza(Rey(ColorPieza.BLANCA, (0, 4)))
        self._colocar_pieza(Alfil(ColorPieza.BLANCA, (0, 5)))
        self._colocar_pieza(Caballo(ColorPieza.BLANCA, (0, 6)))
        self._colocar_pieza(Torre(ColorPieza.BLANCA, (0, 7)))
        for columna in range(8):
            self._colocar_pieza(Peon(ColorPieza.NEGRA, (6, columna)))
        self._colocar_pieza(Torre(ColorPieza.NEGRA, (7, 0)))
        self._colocar_pieza(Caballo(ColorPieza.NEGRA, (7, 1)))
        self._colocar_pieza(Alfil(ColorPieza.NEGRA, (7, 2)))
        self._colocar_pieza(Reina(ColorPieza.NEGRA, (7, 3)))
        self._colocar_pieza(Rey(ColorPieza.NEGRA, (7, 4)))
        self._colocar_pieza(Alfil(ColorPieza.NEGRA, (7, 5)))
        self._colocar_pieza(Caballo(ColorPieza.NEGRA, (7, 6)))
        self._colocar_pieza(Torre(ColorPieza.NEGRA, (7, 7)))

    def _colocar_pieza(self, pieza: Pieza) -> None:
        self._casillas[pieza.posicion] = pieza

    def obtener_pieza_en(self, posicion: Tuple[int, int]) -> Optional[Pieza]:
        return self._casillas.get(posicion)

    def obtener_todas_las_piezas(self, color: Optional[ColorPieza]=None) -> List[Pieza]:
        piezas = []
        for posicion, pieza in self._casillas.items():
            if color is None or pieza.color == color:
                piezas.append(pieza)
        return piezas

    def obtener_rey(self, color: ColorPieza) -> Optional[Rey]:
        for posicion, pieza in self._casillas.items():
            if isinstance(pieza, Rey) and pieza.color == color:
                return pieza
        return None

    @property
    def turno_actual(self) -> ColorPieza:
        return self._turno_actual

    def mover_pieza(self, origen: Tuple[int, int], destino: Tuple[int, int]) -> bool:
        pieza_origen = self.obtener_pieza_en(origen)
        if pieza_origen is None:
            return False
        if pieza_origen.color != self._turno_actual:
            return False
        if not (0 <= destino[0] < 8 and 0 <= destino[1] < 8):
            return False
        pieza_destino = self.obtener_pieza_en(destino)
        movimiento = {'origen': origen, 'destino': destino, 'pieza': pieza_origen.simbolo(), 'color': pieza_origen.color.value, 'captura': pieza_destino.simbolo() if pieza_destino else None}
        if pieza_destino is not None:
            del self._casillas[destino]
        del self._casillas[origen]
        pieza_origen.mover_a(destino)
        self._casillas[destino] = pieza_origen
        self._historial_movimientos.append(movimiento)
        self._turno_actual = ColorPieza.NEGRA if self._turno_actual == ColorPieza.BLANCA else ColorPieza.BLANCA
        return True

    def deshacer_movimiento(self) -> bool:
        if not self._historial_movimientos:
            return False
        ultimo_movimiento = self._historial_movimientos.pop()
        pieza = self.obtener_pieza_en(ultimo_movimiento['destino'])
        if pieza:
            del self._casillas[ultimo_movimiento['destino']]
            pieza._posicion = ultimo_movimiento['origen']
            pieza._ha_movido = False
            self._casillas[ultimo_movimiento['origen']] = pieza
        if ultimo_movimiento['captura']:
            pass
        self._turno_actual = ColorPieza.NEGRA if self._turno_actual == ColorPieza.BLANCA else ColorPieza.BLANCA
        return True

    def esta_en_jaque(self, color: Optional[ColorPieza]=None) -> bool:
        if color is None:
            color = self._turno_actual
        rey = self.obtener_rey(color)
        if rey is None:
            return False
        color_opuesto = ColorPieza.NEGRA if color == ColorPieza.BLANCA else ColorPieza.BLANCA
        piezas_enemigas = self.obtener_todas_las_piezas(color_opuesto)
        for pieza in piezas_enemigas:
            movimientos = pieza.obtener_movimientos_validos(self)
            if rey.posicion in movimientos:
                return True
        return False

    def es_jaque_mate(self) -> bool:
        if not self.esta_en_jaque(self._turno_actual):
            return False
        piezas = self.obtener_todas_las_piezas(self._turno_actual)
        for pieza in piezas:
            movimientos = pieza.obtener_movimientos_validos(self)
            for movimiento in movimientos:
                posicion_original = pieza.posicion
                pieza_destino = self.obtener_pieza_en(movimiento)
                del self._casillas[posicion_original]
                pieza._posicion = movimiento
                self._casillas[movimiento] = pieza
                en_jaque = self.esta_en_jaque(self._turno_actual)
                del self._casillas[movimiento]
                pieza._posicion = posicion_original
                self._casillas[posicion_original] = pieza
                if pieza_destino:
                    self._casillas[movimiento] = pieza_destino
                if not en_jaque:
                    return False
        return True

    def es_empate(self) -> bool:
        piezas = self.obtener_todas_las_piezas(self._turno_actual)
        for pieza in piezas:
            movimientos = pieza.obtener_movimientos_validos(self)
            if movimientos:
                return False
        return not self.esta_en_jaque(self._turno_actual)

    def a_fen(self) -> str:
        filas = []
        for fila in range(8):
            casillas_fila = []
            casillas_vacias = 0
            for columna in range(8):
                pieza = self.obtener_pieza_en((fila, columna))
                if pieza is None:
                    casillas_vacias += 1
                else:
                    if casillas_vacias > 0:
                        casillas_fila.append(str(casillas_vacias))
                        casillas_vacias = 0
                    simbolo_interno = pieza.simbolo()
                    simbolo_fen = self._a_fen_estandar(simbolo_interno)
                    if pieza.color == ColorPieza.NEGRA:
                        simbolo_fen = simbolo_fen.lower()
                    casillas_fila.append(simbolo_fen)
            if casillas_vacias > 0:
                casillas_fila.append(str(casillas_vacias))
            filas.append(''.join(casillas_fila))
        posicion = '/'.join(filas)
        turno = 'w' if self._turno_actual == ColorPieza.BLANCA else 'b'
        fen_completo = f'{posicion} {turno} KQkq - 0 1'
        return fen_completo

    @staticmethod
    def _a_fen_estandar(simbolo_interno: str) -> str:
        mapeo = {'T': 'R', 'C': 'N', 'A': 'B', 'D': 'Q', 'R': 'K', 'P': 'P'}
        return mapeo.get(simbolo_interno, simbolo_interno)

    @classmethod
    def desde_fen(cls, fen: str) -> 'Tablero':
        tablero = cls.__new__(cls)
        tablero._casillas = {}
        tablero._historial_movimientos = []
        tablero._turno_actual = ColorPieza.BLANCA
        partes = fen.split()
        posicion = partes[0]
        if len(partes) > 1 and partes[1] == 'b':
            tablero._turno_actual = ColorPieza.NEGRA
        filas = posicion.split('/')
        mapeo_piezas = {'P': Peon, 'T': Torre, 'C': Caballo, 'A': Alfil, 'D': Reina, 'R': Rey}
        fen_estandar_a_interno = {'K': 'R', 'Q': 'D', 'R': 'T', 'B': 'A', 'N': 'C', 'P': 'P'}
        for fila_idx, fila in enumerate(filas):
            columna = 0
            for caracter in fila:
                if caracter.isdigit():
                    columna += int(caracter)
                else:
                    color = ColorPieza.BLANCA if caracter.isupper() else ColorPieza.NEGRA
                    simbolo = caracter.upper()
                    simbolo = fen_estandar_a_interno.get(simbolo, simbolo)
                    clase_pieza = mapeo_piezas[simbolo]
                    pieza = clase_pieza(color, (fila_idx, columna))
                    tablero._casillas[fila_idx, columna] = pieza
                    columna += 1
        return tablero

    def __str__(self) -> str:
        resultado = '  a b c d e f g h\n'
        for fila in range(7, -1, -1):
            resultado += f'{fila + 1} '
            for columna in range(8):
                pieza = self.obtener_pieza_en((fila, columna))
                if pieza:
                    simbolo = pieza.simbolo()
                    if pieza.color == ColorPieza.NEGRA:
                        simbolo = simbolo.lower()
                    resultado += f'{simbolo} '
                else:
                    resultado += '. '
            resultado += f'{fila + 1}\n'
        resultado += '  a b c d e f g h'
        return resultado