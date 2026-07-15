

import { create } from 'zustand';
import { servicioAuth } from '../servicios/api';

const usarAlmacenAuth = create((establecer, obtener) => ({
  
  
  

  autenticado: servicioAuth.estaAutenticado(),
  usuario: servicioAuth.obtenerUsuario(),
  cargando: false,
  error: null,

  
  
  

  
  iniciarSesion: async (nombreUsuario, contrasena) => {
    establecer({ cargando: true, error: null });
    try {
      const respuesta = await servicioAuth.iniciarSesion(nombreUsuario, contrasena);
      establecer({
        autenticado: true,
        usuario: respuesta.usuario,
        cargando: false,
        error: null,
      });
      return true;
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al iniciar sesión';
      establecer({ cargando: false, error: mensaje });
      return false;
    }
  },

  
  registrar: async (nombreUsuario, correo, contrasena) => {
    establecer({ cargando: true, error: null });
    try {
      const respuesta = await servicioAuth.registrar(nombreUsuario, correo, contrasena);
      establecer({
        autenticado: true,
        usuario: respuesta.usuario,
        cargando: false,
        error: null,
      });
      return true;
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al registrar usuario';
      establecer({ cargando: false, error: mensaje });
      return false;
    }
  },

  
  cerrarSesion: () => {
    servicioAuth.cerrarSesion();
    establecer({
      autenticado: false,
      usuario: null,
      error: null,
    });
  },

  
  cargarSesion: () => {
    const autenticado = servicioAuth.estaAutenticado();
    const usuario = servicioAuth.obtenerUsuario();
    establecer({ autenticado, usuario });
  },

  
  limpiarError: () => {
    establecer({ error: null });
  },
}));

export default usarAlmacenAuth;
