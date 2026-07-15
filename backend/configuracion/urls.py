from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [path('admin/', admin.site.urls), path('api/', include('aplicaciones.partidas.urls')), path('api/auth/', include('aplicaciones.cuentas.urls')), path('ws/', include('aplicaciones.partidas.enrutamiento'))]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)