from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .servicios import ServicioCuentas

@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_usuario(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        resultado = ServicioCuentas.registrar_usuario(username, email, password)
        return Response(resultado, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def iniciar_sesion(request):
    username = request.data.get('username')
    password = request.data.get('password')
    resultado = ServicioCuentas.iniciar_sesion(username, password)
    if resultado is None:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(resultado)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_perfil(request):
    resultado = ServicioCuentas.obtener_perfil(request.user)
    return Response(resultado)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_perfil(request):
    resultado = ServicioCuentas.actualizar_perfil(request.user, request.data)
    return Response(resultado)