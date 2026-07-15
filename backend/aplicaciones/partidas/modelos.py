import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Partida(models.Model):
    ESTADO_CHOICES = [('esperando', 'Esperando oponente'), ('jugando', 'En progreso'), ('blancas_ganan', 'Blancas ganan'), ('negras_ganan', 'Negras ganan'), ('empate', 'Empate')]
    TURNO_CHOICES = [('blancas', 'Blancas'), ('negras', 'Negras')]
    DIFICULTAD_CHOICES = [('humano', 'Humano (Fácil)'), ('campeon', 'Campeón (Medio)'), ('olympus', 'Olympus (Difícil)')]
    MODO_JUEGO_CHOICES = [('vs_ia', 'Contra computadora'), ('vs_jugador', 'Contra jugador local'), ('online', 'En línea')]
    TEMA_CHOICES = [('olimpo', 'Olimpo'), ('inframundo', 'Inframundo'), ('monte', 'Monte Olimpo')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text='Identificador único de la partida')
    jugador_blanco = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='partidas_como_blancas', help_text='Jugador con piezas blancas')
    jugador_negro = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='partidas_como_negras', help_text='Jugador con piezas negras')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='esperando', help_text='Estado actual de la partida')
    turno_actual = models.CharField(max_length=10, choices=TURNO_CHOICES, default='blancas', help_text='Color del turno actual')
    fen = models.CharField(max_length=200, default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', help_text='Posición en notación FEN')
    dificultad = models.CharField(max_length=10, choices=DIFICULTAD_CHOICES, default='campeon', help_text='Nivel de dificultad')
    modo_juego = models.CharField(max_length=10, choices=MODO_JUEGO_CHOICES, default='vs_ia', help_text='Modo de juego')
    tema = models.CharField(max_length=10, choices=TEMA_CHOICES, default='olimpo', help_text='Tema visual del tablero')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Fecha y hora de creación')
    updated_at = models.DateTimeField(auto_now=True, help_text='Fecha y hora de última actualización')
    finished_at = models.DateTimeField(null=True, blank=True, help_text='Fecha y hora de finalización')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Partida'
        verbose_name_plural = 'Partidas'

    def __str__(self) -> str:
        return f'Partida {str(self.id)[:8]} ({self.get_estado_display()})'

    def guardar_estado(self, fen: str, turno: str) -> None:
        self.fen = fen
        self.turno_actual = turno
        self.save()

    def finalizar(self, resultado: str) -> None:
        self.estado = resultado
        self.finished_at = timezone.now()
        self.save()

class Movimiento(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text='Identificador único del movimiento')
    partida = models.ForeignKey(Partida, on_delete=models.CASCADE, related_name='movimientos', help_text='Partida a la que pertenece')
    numero_movimiento = models.PositiveIntegerField(help_text='Número del movimiento en la partida')
    color = models.CharField(max_length=10, choices=Partida.TURNO_CHOICES, help_text='Color que realizó el movimiento')
    san = models.CharField(max_length=10, help_text='Notación estándar algebraica (ej: e4, Nf3)')
    uci = models.CharField(max_length=10, help_text='Notación UCI (ej: e2e4, g1f3)')
    fen_antes = models.CharField(max_length=200, help_text='Posición antes del movimiento')
    fen_despues = models.CharField(max_length=200, help_text='Posición después del movimiento')
    evaluacion = models.FloatField(null=True, blank=True, help_text='Evaluación del motor en centipeones')
    profundidad = models.PositiveIntegerField(null=True, blank=True, help_text='Profundidad de búsqueda de la AI')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Fecha y hora del movimiento')

    class Meta:
        ordering = ['numero_movimiento']
        unique_together = ['partida', 'numero_movimiento', 'color']
        verbose_name = 'Movimiento'
        verbose_name_plural = 'Movimientos'

    def __str__(self) -> str:
        return f'{self.numero_movimiento}. {self.san} ({self.get_color_display()})'

class SesionJuego(models.Model):
    partida = models.OneToOneField(Partida, on_delete=models.CASCADE, related_name='sesion', help_text='Partida asociada')
    blanco_conectado = models.BooleanField(default=False, help_text='Si el jugador blanco está conectado')
    negro_conectado = models.BooleanField(default=False, help_text='Si el jugador negro está conectado')
    ultima_actividad = models.DateTimeField(auto_now=True, help_text='Última actividad registrada')
    control_tiempo = models.PositiveIntegerField(default=600, help_text='Tiempo por jugador en segundos (default: 10 minutos)')
    tiempo_restante_blancas = models.FloatField(default=600, help_text='Tiempo restante para blancas')
    tiempo_restante_negras = models.FloatField(default=600, help_text='Tiempo restante para negras')

    class Meta:
        verbose_name = 'Sesión de Juego'
        verbose_name_plural = 'Sesiones de Juego'

    def __str__(self) -> str:
        return f'Sesión {self.partida}'

    def actualizar_actividad(self) -> None:
        self.ultima_actividad = timezone.now()
        self.save(update_fields=['ultima_actividad'])