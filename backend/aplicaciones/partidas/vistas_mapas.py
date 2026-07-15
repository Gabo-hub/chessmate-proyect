from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from aplicaciones.motor_ajedrez.generador_mapas import GeneradorMapasTiled
POSICIONES_INICIALES = [['T', 'C', 'A', 'D', 'R', 'A', 'C', 'T'], ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], ['t', 'c', 'a', 'd', 'r', 'a', 'c', 't']]

@api_view(['GET'])
@permission_classes([AllowAny])
def obtener_mapa_tablero(request, tema='olimpo'):
    temas_validos = ['olimpo', 'inframundo', 'monte']
    if tema not in temas_validos:
        return Response({'error': f'Tema no válido. Opciones: {temas_validos}'}, status=status.HTTP_400_BAD_REQUEST)
    generador = GeneradorMapasTiled(ancho=8, alto=8, tamano_tile=64)
    mapa = generador.generar_mapa_tablero(tema=tema)
    return Response(mapa)

@api_view(['GET'])
@permission_classes([AllowAny])
def obtener_mapa_puzzle(request, puzzle_id):
    puzzles = _obtener_puzzles_ejemplo()
    try:
        indice = int(puzzle_id)
        if indice < 0 or indice >= len(puzzles):
            raise ValueError
        puzzle = puzzles[indice]
    except (ValueError, IndexError):
        return Response({'error': f'Puzzle ID no válido. Rango: 0-{len(puzzles) - 1}'}, status=status.HTTP_400_BAD_REQUEST)
    generador = GeneradorMapasTiled(ancho=8, alto=8, tamano_tile=64)
    mapa = generador.generar_mapa_puzzle(tablero_puzzle=puzzle['tablero'], turno_blancas=puzzle['turno'], tema='olimpo', pistas=puzzle.get('pistas', ''))
    return Response(mapa)

def _obtener_puzzles_ejemplo() -> list:
    return [{'nombre': 'Mate en 1 — Torre', 'turno': True, 'pistas': 'La torre en a1 puede dar jaque mate en una jugada.', 'tablero': [['T', None, None, None, 'R', None, None, 'T'], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, 'r', None, None], ['t', None, None, 'D', None, None, None, 't']]}, {'nombre': 'Mate en 1 — Reina', 'turno': True, 'pistas': 'La reina puede cortar la diagonal y dar mate.', 'tablero': [[None, None, None, None, None, None, None, 'r'], [None, None, None, None, None, None, 'p', 'p'], [None, None, None, None, None, None, None, 'p'], [None, None, None, None, None, None, None, None], [None, None, None, 'D', None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, 'R']]}, {'nombre': 'Mate en 1 — Caballo', 'turno': True, 'pistas': 'El caballo puede dar mate saltando por encima.', 'tablero': [[None, None, None, None, None, None, 't', 'r'], [None, None, None, None, None, None, 't', 't'], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, 'R', None]]}, {'nombre': 'Gana la Reina', 'turno': True, 'pistas': 'El caballo puede ganar la dama con un doble ataque.', 'tablero': [[None, None, None, None, 'R', None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, 'C', None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, 'r', None, None, 'd']]}, {'nombre': 'Ahogado — Empate', 'turno': True, 'pistas': 'Fuerza tablas con una jugada maestra.', 'tablero': [['r', None, None, None, None, None, None, None], ['p', None, None, None, None, None, None, None], ['R', None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None]]}]