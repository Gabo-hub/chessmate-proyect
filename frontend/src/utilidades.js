

import { VALOR_PIEZAS, VALOR_POSICION, TAM_CASILLA, ALTURA_BARRA } from './constantes';

export function clonarTablero(tableroOriginal) {
    return tableroOriginal.map(fila => [...fila]);
}

export function evaluarTablero(tablero) {
    let puntaje = 0;
    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const pieza = tablero[fila][col];
            if (!pieza) continue;
            const esDios = pieza === pieza.toUpperCase();
            const tipoPieza = pieza.toLowerCase();
            const valor = (VALOR_PIEZAS[tipoPieza] || 0) + (VALOR_POSICION[fila][col] || 0);
            puntaje += esDios ? valor : -valor;
        }
    }
    return puntaje;
}

export function casillaAPixeles(columna, fila) {
    return {
        x: columna * TAM_CASILLA + TAM_CASILLA / 2,
        y: fila * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA,
    };
}

export function pixelesACasilla(x, y) {
    const columna = Math.floor(x / TAM_CASILLA);
    const fila = Math.floor((y - ALTURA_BARRA) / TAM_CASILLA);
    if (fila < 0 || fila > 7 || columna < 0 || columna > 7) return null;
    return { fila, columna };
}

export function uciACasilla(uci) {
    if (!uci || uci.length !== 4) return null;
    const archivos = 'abcdefgh';
    const columnaOrigen = archivos.indexOf(uci[0]);
    const filaOrigen = 8 - parseInt(uci[1]);
    const columnaDestino = archivos.indexOf(uci[2]);
    const filaDestino = 8 - parseInt(uci[3]);
    if (columnaOrigen < 0 || filaOrigen < 0 || columnaDestino < 0 || filaDestino < 0) return null;
    return {
        origen: { fila: filaOrigen, columna: columnaOrigen },
        destino: { fila: filaDestino, columna: columnaDestino },
    };
}

export function casillaAUCI(filaOrigen, columnaOrigen, filaDestino, columnaDestino) {
    const archivos = 'abcdefgh';
    return `${archivos[columnaOrigen]}${8 - filaOrigen}${archivos[columnaDestino]}${8 - filaDestino}`;
}

export function esPosicionValida(fila, columna) {
    return fila >= 0 && fila <= 7 && columna >= 0 && columna <= 7;
}

export function esPiezaDios(pieza) {
    return pieza && pieza === pieza.toUpperCase();
}

export function esPiezaTitan(pieza) {
    return pieza && pieza === pieza.toLowerCase();
}

export function obtenerTipoPieza(pieza) {
    return pieza ? pieza.toUpperCase() : '';
}

export function obtenerNombrePieza(idPieza) {
    const nombres = {
        R: 'Rey', D: 'Reina', T: 'Torre', A: 'Alfil', C: 'Caballo', P: 'Peón',
        r: 'Rey', d: 'Reina', t: 'Torre', a: 'Alfil', c: 'Caballo', p: 'Peón',
    };
    return nombres[idPieza] || 'Desconocida';
}

export function obtenerNombreEquipo(idPieza) {
    return esPiezaDios(idPieza) ? 'Dioses' : 'Titanes';
}

export function generarNotacionSAN(idPieza, origen, destino, esCaptura = false) {
    const archivos = 'abcdefgh';
    const tipoPieza = obtenerTipoPieza(idPieza);
    const destinoStr = `${archivos[destino.columna]}${8 - destino.fila}`;
    const captura = esCaptura ? 'x' : '';
    const prefijo = tipoPieza === 'P' ? '' : tipoPieza;
    return `${prefijo}${captura}${destinoStr}`;
}
