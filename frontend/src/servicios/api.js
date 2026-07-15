

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (configuracion) => {
    const token = localStorage.getItem('token_acceso');
    if (token) {
      configuracion.headers.Authorization = `Bearer ${token}`;
    }
    return configuracion;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const solicitudOriginal = error.config;

    if (error.response?.status === 401 && !solicitudOriginal._reintentado) {
      solicitudOriginal._reintentado = true;

      try {
        const tokenRefresco = localStorage.getItem('token_refresco');
        if (tokenRefresco) {
          const respuestaRefresh = await axios.post('/api/auth/token/refresh/', {
            refresh: tokenRefresco,
          });

          const nuevoToken = respuestaRefresh.data.access;
          localStorage.setItem('token_acceso', nuevoToken);

          solicitudOriginal.headers.Authorization = `Bearer ${nuevoToken}`;
          return api(solicitudOriginal);
        }
      } catch (errorRefresh) {
        localStorage.removeItem('token_acceso');
        localStorage.removeItem('token_refresco');
        localStorage.removeItem('usuario');
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export const servicioAuth = {
  
  async iniciarSesion(usuario, contrasena) {
    const respuesta = await api.post('/auth/token/', {
      username: usuario,
      password: contrasena,
    });

    const { tokens, usuario: datosUsuario } = respuesta.data;
    localStorage.setItem('token_acceso', tokens.access);
    localStorage.setItem('token_refresco', tokens.refresh);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));

    return respuesta.data;
  },

  
  async registrar(usuario, correo, contrasena) {
    const respuesta = await api.post('/auth/registro/', {
      username: usuario,
      email: correo,
      password: contrasena,
    });

    const { tokens, usuario: datosUsuario } = respuesta.data;
    localStorage.setItem('token_acceso', tokens.access);
    localStorage.setItem('token_refresco', tokens.refresh);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));

    return respuesta.data;
  },

  
  cerrarSesion() {
    localStorage.removeItem('token_acceso');
    localStorage.removeItem('token_refresco');
    localStorage.removeItem('usuario');
  },

  
  estaAutenticado() {
    return !!localStorage.getItem('token_acceso');
  },

  
  obtenerUsuario() {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  },

  
  async obtenerPerfil() {
    const respuesta = await api.get('/auth/perfil/');
    return respuesta.data;
  },
};

export const servicioPartidas = {
  
  async crearPartida(dificultad, modoJuego, tema) {
    const respuesta = await api.post('/partidas/', {
      dificultad,
      modo_juego: modoJuego,
      tema,
    });
    return respuesta.data;
  },

  
  async listarPartidas() {
    const respuesta = await api.get('/partidas/');
    return respuesta.data;
  },

  
  async obtenerPartida(idPartida) {
    const respuesta = await api.get(`/partidas/${idPartida}/`);
    return respuesta.data;
  },

  
  async ejecutarMovimiento(idPartida, movimiento) {
    const respuesta = await api.post(`/partidas/${idPartida}/mover/`, {
      movimiento,
    });
    return respuesta.data;
  },

  
  async abandonarPartida(idPartida) {
    const respuesta = await api.post(`/partidas/${idPartida}/abandonar/`);
    return respuesta.data;
  },

  
  async obtenerMovimientos(idPartida) {
    const respuesta = await api.get(`/partidas/${idPartida}/movimientos/`);
    return respuesta.data;
  },

  
  async eliminarPartida(idPartida) {
    await api.delete(`/partidas/${idPartida}/`);
  },
};

export default api;
