

class ServicioWebSocket {
  constructor() {
    this.url = null;
    this.idPartida = null;
    this.socket = null;
    this.conectado = false;
    this.manejadores = new Map();
    this.intentosReconexion = 0;
    this.maxIntentos = 5;
    this.tiempoReconexion = 2000;
    this._timeoutReconexion = null;
  }

  
  conectar(idPartida) {
    if (this.socket && this.conectado) {
      this.desconectar();
    }

    this.idPartida = idPartida;
    const host = window.location.host;
    const protocolo = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = `${protocolo}//${host}/ws/partida/${idPartida}/`;

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.conectado = true;
      this.intentosReconexion = 0;
      this._notificar('conexion', { conectado: true });
    };

    this.socket.onmessage = (evento) => {
      try {
        const datos = JSON.parse(evento.data);
        this._notificar(datos.tipo, datos);
      } catch (error) {
        console.error('Error parseando mensaje WebSocket:', error);
      }
    };

    this.socket.onclose = (evento) => {
      this.conectado = false;
      this._notificar('desconexion', { codigo: evento.code });

      if (evento.code !== 1000 && this.intentosReconexion < this.maxIntentos) {
        this._intentarReconexion();
      }
    };

    this.socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      this._notificar('error', { mensaje: 'Error de conexión WebSocket' });
    };
  }

  
  desconectar() {
    if (this._timeoutReconexion) {
      clearTimeout(this._timeoutReconexion);
      this._timeoutReconexion = null;
    }

    if (this.socket) {
      this.socket.close(1000, 'Usuario cerrando conexión');
      this.socket = null;
    }

    this.conectado = false;
    this.intentosReconexion = 0;
  }

  
  enviar(tipo, datos = {}) {
    if (!this.socket || !this.conectado) {
      console.warn('WebSocket no conectado. No se puede enviar mensaje.');
      return false;
    }

    const mensaje = JSON.stringify({ tipo, ...datos });
    this.socket.send(mensaje);
    return true;
  }

  
  enviarMovimiento(movimiento) {
    return this.enviar('hacer_movimiento', { movimiento });
  }

  
  enviarAbandono() {
    return this.enviar('abandonar', {});
  }

  
  enviarChat(mensaje) {
    return this.enviar('chat', { mensaje });
  }

  
  on(tipo, funcion) {
    if (!this.manejadores.has(tipo)) {
      this.manejadores.set(tipo, new Set());
    }
    this.manejadores.get(tipo).add(funcion);

    return () => {
      const manejadores = this.manejadores.get(tipo);
      if (manejadores) {
        manejadores.delete(funcion);
      }
    };
  }

  
  _notificar(tipo, datos) {
    const manejadores = this.manejadores.get(tipo);
    if (manejadores) {
      manejadores.forEach((manejador) => {
        try {
          manejador(datos);
        } catch (error) {
          console.error(`Error en manejador de ${tipo}:`, error);
        }
      });
    }
  }

  
  _intentarReconexion() {
    this.intentosReconexion++;
    const tiempoEspera = this.tiempoReconexion * this.intentosReconexion;

    this._timeoutReconexion = setTimeout(() => {
      if (this.idPartida && !this.conectado) {
        this.conectar(this.idPartida);
      }
    }, tiempoEspera);
  }

  
  estaConectado() {
    return this.conectado && this.socket?.readyState === WebSocket.OPEN;
  }
}

const servicioWebSocket = new ServicioWebSocket();
export default servicioWebSocket;
