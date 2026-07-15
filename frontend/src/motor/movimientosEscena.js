

import { TAM_CASILLA, ALTURA_BARRA, TEMAS_TABLERO } from '../constantes';
import { COLUMNAS_UCI } from './constantesAjedrez';
import servicioWebSocket from '../servicios/websocket';
import { reproducir } from './gestorAudio';
import { capturarPieza, efectoJaque, efectoMovimiento } from './gestorEfectos';
import { verificarSiEstaEnJaque as verificarSiEstaEnJaqueMotor, verificarSiHayFinal as verificarSiHayFinalMotor } from './motorAjedrez';
import { mostrarPieza, ocultarPieza, mostrarPantallaFinal } from './renderizado';

export function verificarSiEstaEnJaque(escena, esDios, filaRey, columnaRey) {
    return verificarSiEstaEnJaqueMotor(escena.tablero, esDios, filaRey, columnaRey);
}

export function verificarSiHayFinal(escena) {
    const resultado = verificarSiHayFinalMotor(escena.tablero, escena.turnoDioses, escena.posicionReyBlanco, escena.posicionReyNegro);
    if (resultado.hayFinal) {
        escena.estadoPartida = 'fin';
        const ganador = escena.turnoDioses ? 'Los Titanes' : 'Los Dioses';
        const tituloFinal = resultado.esJaqueMate ? 'JAQUE MATE' : 'TABLAS';
        mostrarPantallaFinal(escena, tituloFinal, ganador);
    }
}

export function actualizarEstadoJaque(escena) {
    const reyBlancoEnJaque = verificarSiEstaEnJaque(escena, true, escena.posicionReyBlanco.fila, escena.posicionReyBlanco.columna);
    const reyNegroEnJaque = verificarSiEstaEnJaque(escena, false, escena.posicionReyNegro.fila, escena.posicionReyNegro.columna);
    const turnoActualEnJaque = escena.turnoDioses ? reyBlancoEnJaque : reyNegroEnJaque;

    
    if (escena.casillaResaltadaJaque) {
        const filaGuardada = escena.casillaResaltadaJaque.getData('fila');
        const colGuardada = escena.casillaResaltadaJaque.getData('col');
        const esClara = (filaGuardada + colGuardada) % 2 === 0;
        escena.casillaResaltadaJaque.setFillStyle(esClara ? TEMAS_TABLERO[escena.temaTablero].clara : TEMAS_TABLERO[escena.temaTablero].oscura);
        escena.casillaResaltadaJaque = null;
    }

    if (turnoActualEnJaque) {
        escena.textoJaque.setText('⚠ JAQUE');
        escena.textoJaque.setColor('#FF4444');
        reproducir(escena, 'jaque');
        const reyEnJaque = escena.turnoDioses ? escena.posicionReyBlanco : escena.posicionReyNegro;
        const jaqueX = reyEnJaque.columna * TAM_CASILLA + TAM_CASILLA / 2;
        const jaqueY = escena.filaPantalla(reyEnJaque.fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
        efectoJaque(escena, jaqueX, jaqueY);
        if (escena.casillasTablero[reyEnJaque.fila] && escena.casillasTablero[reyEnJaque.fila][reyEnJaque.columna]) {
            const casillaRey = escena.casillasTablero[reyEnJaque.fila][reyEnJaque.columna];
            casillaRey.setFillStyle(0xFF0000, 0.6);
            casillaRey.setData('fila', reyEnJaque.fila);
            casillaRey.setData('col', reyEnJaque.columna);
            escena.casillaResaltadaJaque = casillaRey;
        }
    } else {
        escena.textoJaque.setText('');
    }
}

export function ejecutarMovimiento(escena, filaOrigen, columnaOrigen, filaDestino, columnaDestino) {
    const pieza = escena.tablero[filaOrigen][columnaOrigen];
    if (!pieza) return;

    
    if (escena.modoJuego === 'online' && servicioWebSocket.estaConectado()) {
        const uci = `${COLUMNAS_UCI[columnaOrigen]}${8 - filaOrigen}${COLUMNAS_UCI[columnaDestino]}${8 - filaDestino}`;
        servicioWebSocket.enviarMovimiento(uci);
        return;
    }

    
    if (pieza === 'R') escena.posicionReyBlanco = { fila: filaDestino, columna: columnaDestino };
    if (pieza === 'r') escena.posicionReyNegro = { fila: filaDestino, columna: columnaDestino };

    
    const piezaCapturada = escena.tablero[filaDestino][columnaDestino];
    escena.tablero[filaOrigen][columnaOrigen] = null;
    escena.tablero[filaDestino][columnaDestino] = pieza;

    
    ocultarPieza(escena, filaOrigen, columnaOrigen);
    mostrarPieza(escena, filaDestino, columnaDestino, pieza);

    
    const centroDestinoX = columnaDestino * TAM_CASILLA + TAM_CASILLA / 2;
    const centroDestinoY = escena.filaPantalla(filaDestino) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
    if (piezaCapturada) {
        reproducir(escena, 'captura');
        capturarPieza(escena, centroDestinoX, centroDestinoY);
    } else {
        reproducir(escena, 'movimiento');
        const centroOrigenX = columnaOrigen * TAM_CASILLA + TAM_CASILLA / 2;
        const centroOrigenY = escena.filaPantalla(filaOrigen) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
        efectoMovimiento(escena, centroOrigenX, centroOrigenY, centroDestinoX, centroDestinoY);
    }

    // Promoción: blancas (Dioses) llegan a fila 0 (arriba), negras (Titanes) llegan a fila 7 (abajo)
    if (pieza === 'P' && filaDestino === 0) {
        escena.tablero[filaDestino][columnaDestino] = 'D';
        mostrarPieza(escena, filaDestino, columnaDestino, 'D');
    } else if (pieza === 'p' && filaDestino === 7) {
        escena.tablero[filaDestino][columnaDestino] = 'd';
        mostrarPieza(escena, filaDestino, columnaDestino, 'd');
    }

    
    escena.turnoDioses = !escena.turnoDioses;
    if (escena.modoJuego === 'puzzle') {
        escena.textoTurno.setText(escena.turnoDioses ? 'Tu turno — Dioses' : 'IA — Titanes');
    } else if (escena.voltearTablero) {
        escena.textoTurno.setText(escena.turnoDioses ? 'IA — Dioses' : 'Tu turno — Titanes');
    } else {
        escena.textoTurno.setText(escena.turnoDioses ? 'Turno: Dioses' : 'Turno: Titanes');
    }
    escena.textoTurno.setColor(escena.turnoDioses ? '#FFD700' : '#888888');

    
    actualizarEstadoJaque(escena);
    verificarSiHayFinal(escena);

    
    const esTurnoIA = escena.iaEsDioses ? escena.turnoDioses : !escena.turnoDioses;
    if (escena.estadoPartida === 'jugando' && escena.iaActivada && esTurnoIA) {
        escena.time.delayedCall(400, () => escena.jugarTurnoIA());
    }
    
    // Iniciar rotación del tablero si estamos en modo local 2 jugadores
    if (escena.rotarTablero) {
        escena.rotarTablero();
    }
}

export function aplicarMovimientoRemoto(escena, uci) {
    const columnaOrigen = COLUMNAS_UCI.indexOf(uci[0]);
    const filaOrigen = 8 - parseInt(uci[1]);
    const columnaDestino = COLUMNAS_UCI.indexOf(uci[2]);
    const filaDestino = 8 - parseInt(uci[3]);

    const pieza = escena.tablero[filaOrigen][columnaOrigen];
    if (!pieza) return;

    if (pieza === 'R') escena.posicionReyBlanco = { fila: filaDestino, columna: columnaDestino };
    if (pieza === 'r') escena.posicionReyNegro = { fila: filaDestino, columna: columnaDestino };

    escena.tablero[filaOrigen][columnaOrigen] = null;
    escena.tablero[filaDestino][columnaDestino] = pieza;

    ocultarPieza(escena, filaOrigen, columnaOrigen);
    mostrarPieza(escena, filaDestino, columnaDestino, pieza);

    if (pieza === 'P' && filaDestino === 7) {
        escena.tablero[filaDestino][columnaDestino] = 'D';
        mostrarPieza(escena, filaDestino, columnaDestino, 'D');
    } else if (pieza === 'p' && filaDestino === 0) {
        escena.tablero[filaDestino][columnaDestino] = 'd';
        mostrarPieza(escena, filaDestino, columnaDestino, 'd');
    }

    escena.turnoDioses = !escena.turnoDioses;
    escena.textoTurno.setText(escena.turnoDioses ? 'Turno: Dioses' : 'Turno: Titanes');
    escena.textoTurno.setColor(escena.turnoDioses ? '#FFD700' : '#888888');
    actualizarEstadoJaque(escena);
    verificarSiHayFinal(escena);
}

export function manejarClicJuego(escena, coordenadaX, coordenadaY) {
    if (escena.estadoPartida !== 'jugando') return;

    let clicX = coordenadaX;
    let clicY = coordenadaY;

    // Si la cámara está rotada 180 grados, invertimos las coordenadas del clic manualmente
    if (escena.cameras.main.rotation > 0) { // Math.PI > 0
        const centroX = (8 * TAM_CASILLA) / 2;
        const centroY = ALTURA_BARRA + (8 * TAM_CASILLA) / 2;
        clicX = (centroX * 2) - coordenadaX;
        clicY = (centroY * 2) - coordenadaY;
    }

    const columna = Math.floor(clicX / TAM_CASILLA);
    const filaPant = Math.floor((clicY - ALTURA_BARRA) / TAM_CASILLA);
    if (filaPant < 0 || filaPant > 7 || columna < 0 || columna > 7) return;
    const fila = escena.filaLogica(filaPant);

    const piezaEnCasilla = escena.tablero[fila][columna];

    if (escena.casillaSeleccionada) {
        const esMovimientoValido = escena.movimientosDisponibles.some(
            m => m.fila === fila && m.columna === columna
        );
        if (esMovimientoValido) {
            ejecutarMovimiento(escena, escena.casillaSeleccionada.fila, escena.casillaSeleccionada.columna, fila, columna);
            escena.limpiarSeleccion();
            return;
        }
        if (piezaEnCasilla && escena.piezaEsDelTurno(piezaEnCasilla)) {
            escena.limpiarSeleccion();
            escena.seleccionarPieza(fila, columna);
            return;
        }
        escena.limpiarSeleccion();
        return;
    }

    if (piezaEnCasilla && escena.piezaEsDelTurno(piezaEnCasilla)) {
        escena.seleccionarPieza(fila, columna);
    }
}

export function manejarClicMenu(escena, coordenadaX, coordenadaY) {
    if (coordenadaX >= 0 && coordenadaX <= 80 && coordenadaY >= 0 && coordenadaY <= ALTURA_BARRA) {
        salirConAnimacionFade(escena);
    }
}
