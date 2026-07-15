import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .modelos import Partida, SesionJuego

class ConsumidorPartida(AsyncWebsocketConsumer):

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.group_name = f'partida_{self.game_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        self.usuario = self.scope.get('user')
        if self.usuario:
            await self.actualizar_conexion(True)
        await self.send(text_data=json.dumps({'tipo': 'conexion_exitosa', 'mensaje': 'Conectado a la partida', 'game_id': self.game_id}))
        print(f'🔌 Jugador conectado a partida {self.game_id}')

    async def disconnect(self, close_code):
        if self.usuario:
            await self.actualizar_conexion(False)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_send(self.group_name, {'tipo': 'jugador_desconectado', 'usuario': self.usuario.username if self.usuario else 'Desconocido'})
        print(f'🔌 Jugador desconectado de partida {self.game_id}')

    async def receive(self, text_data):
        try:
            datos = json.loads(text_data)
            tipo = datos.get('tipo')
            if tipo == 'hacer_movimiento':
                await self.manejar_movimiento(datos)
            elif tipo == 'abandonar':
                await self.manejar_abandono(datos)
            elif tipo == 'chat':
                await self.manejar_chat(datos)
            else:
                await self.send(text_data=json.dumps({'tipo': 'error', 'mensaje': f'Tipo de mensaje desconocido: {tipo}'}))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'tipo': 'error', 'mensaje': 'Formato de mensaje inválido'}))

    async def manejar_movimiento(self, datos):
        movimiento = datos.get('movimiento')
        if not movimiento:
            await self.send(text_data=json.dumps({'tipo': 'error', 'mensaje': 'Movimiento no proporcionado'}))
            return
        resultado = await self.ejecutar_movimiento(movimiento)
        if resultado.get('exito'):
            await self.channel_layer.group_send(self.group_name, {'tipo': 'movimiento_realizado', 'movimiento': movimiento, 'estado': resultado.get('estado'), 'turno': resultado.get('turno')})
        else:
            await self.send(text_data=json.dumps({'tipo': 'error_movimiento', 'mensaje': resultado.get('error')}))

    async def manejar_abandono(self, datos):
        resultado = await self.finalizar_partida()
        await self.channel_layer.group_send(self.group_name, {'tipo': 'partida_abandonada', 'jugador_abandono': self.usuario.username, 'resultado': resultado})

    async def manejar_chat(self, datos):
        mensaje = datos.get('mensaje')
        if mensaje:
            await self.channel_layer.group_send(self.group_name, {'tipo': 'mensaje_chat', 'usuario': self.usuario.username, 'mensaje': mensaje})

    @database_sync_to_async
    def ejecutar_movimiento(self, movimiento_uci):
        try:
            partida = Partida.objects.get(id=self.game_id)
            if self.usuario == partida.jugador_blanco and partida.turno_actual != 'blancas':
                return {'exito': False, 'error': 'No es tu turno'}
            if self.usuario == partida.jugador_negro and partida.turno_actual != 'negras':
                return {'exito': False, 'error': 'No es tu turno'}
            from .servicios import ServicioPartida
            servicio = ServicioPartida()
            resultado = servicio.ejecutar_movimiento(partida, movimiento_uci)
            return resultado
        except Partida.DoesNotExist:
            return {'exito': False, 'error': 'Partida no encontrada'}
        except Exception as e:
            return {'exito': False, 'error': str(e)}

    @database_sync_to_async
    def finalizar_partida(self):
        partida = Partida.objects.get(id=self.game_id)
        if partida.jugador_blanco == self.usuario:
            resultado = 'negras_ganan'
        else:
            resultado = 'blancas_ganan'
        partida.finalizar(resultado)
        return resultado

    @database_sync_to_async
    def actualizar_conexion(self, conectado):
        sesion, _ = SesionJuego.objects.get_or_create(partida_id=self.game_id)
        partida = Partida.objects.get(id=self.game_id)
        if self.usuario == partida.jugador_blanco:
            sesion.blanco_conectado = conectado
        elif self.usuario == partida.jugador_negro:
            sesion.negro_conectado = conectado
        sesion.save()

    async def movimiento_realizado(self, event):
        await self.send(text_data=json.dumps({'tipo': 'movimiento_realizado', 'movimiento': event['movimiento'], 'estado': event['estado'], 'turno': event['turno']}))

    async def jugador_desconectado(self, event):
        await self.send(text_data=json.dumps({'tipo': 'jugador_desconectado', 'usuario': event['usuario']}))

    async def partida_abandonada(self, event):
        await self.send(text_data=json.dumps({'tipo': 'partida_abandonada', 'jugador_abandono': event['jugador_abandono'], 'resultado': event['resultado']}))

    async def mensaje_chat(self, event):
        await self.send(text_data=json.dumps({'tipo': 'mensaje_chat', 'usuario': event['usuario'], 'mensaje': event['mensaje']}))