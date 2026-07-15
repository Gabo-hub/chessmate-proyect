from typing import Dict, Optional
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .modelos import Perfil

class ServicioCuentas:

    @staticmethod
    @transaction.atomic
    def registrar_usuario(username: str, email: str, password: str) -> Dict:
        if not username or not email or (not password):
            raise ValueError('Todos los campos son obligatorios')
        if User.objects.filter(username=username).exists():
            raise ValueError('El nombre de usuario ya existe')
        if User.objects.filter(email=email).exists():
            raise ValueError('El correo electrónico ya está registrado')
        usuario = User.objects.create_user(username=username, email=email, password=password)
        Perfil.objects.create(usuario=usuario)
        refresh = RefreshToken.for_user(usuario)
        return {'exito': True, 'usuario': {'id': usuario.id, 'username': usuario.username, 'email': usuario.email}, 'tokens': {'refresh': str(refresh), 'access': str(refresh.access_token)}}

    @staticmethod
    def iniciar_sesion(username: str, password: str) -> Optional[Dict]:
        usuario = authenticate(username=username, password=password)
        if usuario is None:
            return None
        refresh = RefreshToken.for_user(usuario)
        return {'usuario': {'id': usuario.id, 'username': usuario.username, 'email': usuario.email}, 'tokens': {'refresh': str(refresh), 'access': str(refresh.access_token)}}

    @staticmethod
    def obtener_perfil(usuario) -> Dict:
        perfil, _ = Perfil.objects.get_or_create(usuario=usuario)
        return {'id': usuario.id, 'username': usuario.username, 'email': usuario.email, 'perfil': {'rating': perfil.rating, 'partidas_jugadas': perfil.partidas_jugadas, 'partidas_ganadas': perfil.partidas_ganadas}}

    @staticmethod
    @transaction.atomic
    def actualizar_perfil(usuario, datos: Dict) -> Dict:
        if 'email' in datos:
            usuario.email = datos['email']
            usuario.save()
        return {'mensaje': 'Perfil actualizado', 'usuario': {'id': usuario.id, 'username': usuario.username, 'email': usuario.email}}