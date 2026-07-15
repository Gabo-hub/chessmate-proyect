from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import vistas
urlpatterns = [path('token/', vistas.iniciar_sesion, name='token-obtain'), path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'), path('registro/', vistas.registrar_usuario, name='registro'), path('perfil/', vistas.obtener_perfil, name='perfil'), path('perfil/actualizar/', vistas.actualizar_perfil, name='perfil-actualizar')]