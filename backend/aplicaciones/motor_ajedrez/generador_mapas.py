from typing import Dict, List, Optional, Tuple
import json

class GeneradorMapasTiled:
    TILE_VACIO = 0
    TILE_CLARO = 1
    TILE_OSCURO = 2
    TILE_ESPECIAL = 3
    TILE_INICIO = 4
    TEMAS = {'olimpo': {'fondo': '#1a1a2e', 'tile_claro': 16113331, 'tile_oscur': 9127187, 'nombre_tileset': 'OlimpoTileset', 'imagen_tileset': 'tileset_olimpo.png'}, 'inframundo': {'fondo': '#1a0a0a', 'tile_claro': 5921370, 'tile_oscur': 2755082, 'nombre_tileset': 'InframundoTileset', 'imagen_tileset': 'tileset_inframundo.png'}, 'monte': {'fondo': '#0a1a0a', 'tile_claro': 11064738, 'tile_oscur': 3894075, 'nombre_tileset': 'MonteTileset', 'imagen_tileset': 'tileset_monte.png'}}

    def __init__(self, ancho: int=8, alto: int=8, tamano_tile: int=64):
        self.ancho = ancho
        self.alto = alto
        self.tamano_tile = tamano_tile

    def generar_mapa_tablero(self, tema: str='olimpo') -> Dict:
        config_tema = self.TEMAS.get(tema, self.TEMAS['olimpo'])
        mapa = {'compressionlevel': -1, 'height': self.alto, 'width': self.ancho, 'infinite': False, 'layers': [], 'orientation': 'orthogonal', 'renderorder': 'right-down', 'tiledversion': '1.10', 'tileheight': self.tamano_tile, 'tilesets': [], 'tilewidth': self.tamano_tile, 'type': 'map', 'version': '1.10'}
        capa_fondo = self._generar_capa_fondo(config_tema)
        mapa['layers'].append(capa_fondo)
        capa_tablero = self._generar_capa_tablero()
        mapa['layers'].append(capa_tablero)
        capa_efectos = self._generar_capa_efectos()
        mapa['layers'].append(capa_efectos)
        capa_piezas = self._generar_capa_piezas()
        mapa['layers'].append(capa_piezas)
        tileset = self._generar_tileset(config_tema)
        mapa['tilesets'].append(tileset)
        return mapa

    def generar_mapa_puzzle(self, tablero_puzzle: List[List[Optional[str]]], turno_blancas: bool=True, tema: str='olimpo', pistas: str='') -> Dict:
        mapa = self.generar_mapa_tablero(tema)
        for fila_idx, fila in enumerate(tablero_puzzle):
            for col_idx, pieza in enumerate(fila):
                if pieza:
                    objeto_pieza = {'height': self.tamano_tile, 'id': fila_idx * 8 + col_idx + 1, 'name': f'pieza_{pieza}_{fila_idx}_{col_idx}', 'rotation': 0, 'type': 'pieza', 'visible': True, 'width': self.tamano_tile, 'x': col_idx * self.tamano_tile, 'y': fila_idx * self.tamano_tile, 'properties': [{'name': 'tipo_pieza', 'type': 'string', 'value': pieza}, {'name': 'es_blancas', 'type': 'bool', 'value': pieza == pieza.upper()}, {'name': 'fila', 'type': 'int', 'value': fila_idx}, {'name': 'columna', 'type': 'int', 'value': col_idx}]}
                    for capa in mapa['layers']:
                        if capa['name'] == 'Piezas':
                            capa['objects'].append(objeto_pieza)
                            break
        mapa['properties'] = [{'name': 'es_puzzle', 'type': 'bool', 'value': True}, {'name': 'turno_blancas', 'type': 'bool', 'value': turno_blancas}, {'name': 'pistas', 'type': 'string', 'value': pistas}]
        return mapa

    def _generar_capa_fondo(self, config_tema: Dict) -> Dict:
        return {'data': [self.TILE_CLARO] * (self.ancho * self.alto), 'height': self.alto, 'id': 1, 'name': 'Fondo', 'opacity': 1, 'type': 'tilelayer', 'visible': True, 'width': self.ancho, 'x': 0, 'y': 0}

    def _generar_capa_tablero(self) -> Dict:
        data = []
        for fila in range(self.alto):
            for col in range(self.ancho):
                es_claro = (fila + col) % 2 == 0
                data.append(self.TILE_CLARO if es_claro else self.TILE_OSCURO)
        return {'data': data, 'height': self.alto, 'id': 2, 'name': 'TableroCasillas', 'opacity': 1, 'type': 'tilelayer', 'visible': True, 'width': self.ancho, 'x': 0, 'y': 0}

    def _generar_capa_efectos(self) -> Dict:
        return {'data': [self.TILE_VACIO] * (self.ancho * self.alto), 'height': self.alto, 'id': 3, 'name': 'EfectosEspeciales', 'opacity': 0.8, 'type': 'tilelayer', 'visible': True, 'width': self.ancho, 'x': 0, 'y': 0}

    def _generar_capa_piezas(self) -> Dict:
        return {'height': self.alto, 'id': 4, 'name': 'Piezas', 'objects': [], 'opacity': 1, 'type': 'objectgroup', 'visible': True, 'width': self.ancho, 'x': 0, 'y': 0}

    def _generar_tileset(self, config_tema: Dict) -> Dict:
        return {'columns': 2, 'firstgid': 1, 'image': config_tema['imagen_tileset'], 'imageheight': self.tamano_tile * 2, 'imagewidth': self.tamano_tile * 2, 'margin': 0, 'name': config_tema['nombre_tileset'], 'spacing': 0, 'tilecount': 4, 'tileheight': self.tamano_tile, 'tilewidth': self.tamano_tile, 'tiles': [{'id': 0, 'properties': [{'name': 'tipo', 'type': 'string', 'value': 'claro'}]}, {'id': 1, 'properties': [{'name': 'tipo', 'type': 'string', 'value': 'oscuro'}]}, {'id': 2, 'properties': [{'name': 'tipo', 'type': 'string', 'value': 'especial'}]}, {'id': 3, 'properties': [{'name': 'tipo', 'type': 'string', 'value': 'inicio'}]}]}

    def exportar_json(self, mapa: Dict, ruta: str) -> None:
        with open(ruta, 'w', encoding='utf-8') as archivo:
            json.dump(mapa, archivo, indent=2, ensure_ascii=False)