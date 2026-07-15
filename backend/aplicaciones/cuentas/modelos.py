from django.db import models
from django.contrib.auth.models import User

class Perfil(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil', help_text='Usuario asociado')
    rating = models.IntegerField(default=1200, help_text='Elo rating del jugador')
    partidas_jugadas = models.PositiveIntegerField(default=0, help_text='Total de partidas jugadas')
    partidas_ganadas = models.PositiveIntegerField(default=0, help_text='Total de partidas ganadas')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Fecha de creación del perfil')
    updated_at = models.DateTimeField(auto_now=True, help_text='Última actualización del perfil')

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

    def __str__(self) -> str:
        return f'Perfil {self.usuario.username} ({self.rating})'

    def actualizar_estadisticas(self, ganada: bool) -> None:
        self.partidas_jugadas += 1
        if ganada:
            self.partidas_ganadas += 1
            self.rating += 10
        else:
            self.rating -= 10
        self.rating = max(100, self.rating)
        self.save()