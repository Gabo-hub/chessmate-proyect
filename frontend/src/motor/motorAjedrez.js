

import { TAM_TABLERO, MAX_INDICE, PUNTUACION_JAQUE_MATE, PUNTUACION_TABLAS } from './constantesAjedrez';

export function esPiezaDelTurno(pieza, turnoDioses) {
    if (!pieza) return false;
    return turnoDioses ? pieza === pieza.toUpperCase() : pieza === pieza.toLowerCase();
}

export function calcularMovimientosPosibles(tablero, fila, columna) {
    const pieza = tablero[fila][columna];
    if (!pieza) return [];

    const tipoPieza = pieza.toUpperCase();
    const esDios = pieza === pieza.toUpperCase();

    const esEnemigo = (filaDest, colDest) => {
        if (filaDest < 0 || filaDest > MAX_INDICE || colDest < 0 || colDest > MAX_INDICE) return false;
        const destino = tablero[filaDest][colDest];
        if (!destino) return false;
        return esDios ? destino === destino.toLowerCase() : destino === destino.toUpperCase();
    };

    const estaLibre = (filaDest, colDest) => {
        if (filaDest < 0 || filaDest > MAX_INDICE || colDest < 0 || colDest > MAX_INDICE) return false;
        return tablero[filaDest][colDest] === null;
    };

    const estaLibreOEsEnemigo = (filaDest, colDest) => estaLibre(filaDest, colDest) || esEnemigo(filaDest, colDest);

    const movimientos = [];

    const recorrerLinea = (deltaFila, deltaColumna) => {
        let filaActual = fila + deltaFila;
        let colActual = columna + deltaColumna;
        while (filaActual >= 0 && filaActual <= MAX_INDICE && colActual >= 0 && colActual <= MAX_INDICE) {
            if (estaLibre(filaActual, colActual)) {
                movimientos.push({ fila: filaActual, columna: colActual });
            } else {
                if (esEnemigo(filaActual, colActual)) movimientos.push({ fila: filaActual, columna: colActual });
                break;
            }
            filaActual += deltaFila;
            colActual += deltaColumna;
        }
    };

    switch (tipoPieza) {
        case 'P': {
            const direccion = esDios ? 1 : -1;
            const filaInicial = esDios ? 6 : 1;
            const filaAdelante = fila + direccion;
            if (filaAdelante >= 0 && filaAdelante <= MAX_INDICE && estaLibre(filaAdelante, columna)) {
                movimientos.push({ fila: filaAdelante, columna });
                const filaDoble = fila + 2 * direccion;
                if (fila === filaInicial && estaLibre(filaDoble, columna)) {
                    movimientos.push({ fila: filaDoble, columna });
                }
            }
            for (const deltaCol of [-1, 1]) {
                const columnaDiagonal = columna + deltaCol;
                if (columnaDiagonal >= 0 && columnaDiagonal <= MAX_INDICE && filaAdelante >= 0 && filaAdelante <= MAX_INDICE && esEnemigo(filaAdelante, columnaDiagonal)) {
                    movimientos.push({ fila: filaAdelante, columna: columnaDiagonal });
                }
            }
            break;
        }
        case 'T':
            recorrerLinea(0, 1); recorrerLinea(0, -1);
            recorrerLinea(1, 0); recorrerLinea(-1, 0);
            break;
        case 'A':
            recorrerLinea(1, 1); recorrerLinea(1, -1);
            recorrerLinea(-1, 1); recorrerLinea(-1, -1);
            break;
        case 'D':
            recorrerLinea(0, 1); recorrerLinea(0, -1);
            recorrerLinea(1, 0); recorrerLinea(-1, 0);
            recorrerLinea(1, 1); recorrerLinea(1, -1);
            recorrerLinea(-1, 1); recorrerLinea(-1, -1);
            break;
        case 'C': {
            const movimientosCaballo = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            movimientosCaballo.forEach(([deltaFila, deltaCol]) => {
                if (estaLibreOEsEnemigo(fila + deltaFila, columna + deltaCol)) {
                    movimientos.push({ fila: fila + deltaFila, columna: columna + deltaCol });
                }
            });
            break;
        }
        case 'R': {
            for (let deltaFila = -1; deltaFila <= 1; deltaFila++)
                for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
                    if (deltaFila === 0 && deltaCol === 0) continue;
                    if (estaLibreOEsEnemigo(fila + deltaFila, columna + deltaCol)) {
                        movimientos.push({ fila: fila + deltaFila, columna: columna + deltaCol });
                    }
                }
            break;
        }
    }
    return movimientos;
}

export function verificarSiEstaEnJaque(tablero, esDios, filaRey, columnaRey) {
    for (let fila = 0; fila < TAM_TABLERO; fila++) {
        for (let col = 0; col < TAM_TABLERO; col++) {
            const pieza = tablero[fila][col];
            if (!pieza) continue;
            if (esDios ? pieza === pieza.toLowerCase() : pieza === pieza.toUpperCase()) {
                const movs = calcularMovimientosPosibles(tablero, fila, col);
                if (movs.some(m => m.fila === filaRey && m.columna === columnaRey)) return true;
            }
        }
    }
    return false;
}

export function filtrarSoloMovimientosLegales(tablero, fila, columna, movimientos, posicionRey) {
    const pieza = tablero[fila][columna];
    if (!pieza) return [];
    const esDios = pieza === pieza.toUpperCase();
    const tipoPieza = pieza.toUpperCase();
    const movimientosLegales = [];

    for (const mov of movimientos) {
        const piezaDestinoOriginal = tablero[mov.fila][mov.columna];
        const piezaOrigenOriginal = tablero[fila][columna];
        tablero[fila][columna] = null;
        tablero[mov.fila][mov.columna] = pieza;
        let filaRey = posicionRey.fila;
        let columnaRey = posicionRey.columna;
        if (tipoPieza === 'R') { filaRey = mov.fila; columnaRey = mov.columna; }
        const estaEnJaque = verificarSiEstaEnJaque(tablero, esDios, filaRey, columnaRey);
        tablero[fila][columna] = piezaOrigenOriginal;
        tablero[mov.fila][mov.columna] = piezaDestinoOriginal;
        if (!estaEnJaque) movimientosLegales.push(mov);
    }
    return movimientosLegales;
}

export function verificarSiHayFinal(tablero, turnoDioses, posicionReyBlanco, posicionReyNegro) {
    let hayMovimientosPosibles = false;

    for (let fila = 0; fila < TAM_TABLERO && !hayMovimientosPosibles; fila++) {
        for (let col = 0; col < TAM_TABLERO && !hayMovimientosPosibles; col++) {
            const pieza = tablero[fila][col];
            if (!pieza) continue;
            if (turnoDioses === (pieza === pieza.toUpperCase())) {
                const posicionRey = turnoDioses ? posicionReyBlanco : posicionReyNegro;
                const movs = calcularMovimientosPosibles(tablero, fila, col);
                const legales = filtrarSoloMovimientosLegales(tablero, fila, col, movs, posicionRey);
                if (legales.length > 0) hayMovimientosPosibles = true;
            }
        }
    }

    if (hayMovimientosPosibles) return { hayFinal: false, esJaqueMate: false, esTablas: false };

    const posicionRey = turnoDioses ? posicionReyBlanco : posicionReyNegro;
    const estaEnJaque = verificarSiEstaEnJaque(tablero, turnoDioses, posicionRey.fila, posicionRey.columna);

    return {
        hayFinal: true,
        esJaqueMate: estaEnJaque,
        esTablas: !estaEnJaque,
    };
}

export function buscarPosicionesReyes(tablero) {
    const posiciones = { blanco: null, negro: null };
    for (let fila = 0; fila < TAM_TABLERO; fila++) {
        for (let col = 0; col < TAM_TABLERO; col++) {
            const pieza = tablero[fila][col];
            if (pieza === 'R') posiciones.blanco = { fila, columna: col };
            if (pieza === 'r') posiciones.negro = { fila, columna: col };
        }
    }
    return posiciones;
}

export function clonarTablero(tablero) {
    return tablero.map(fila => [...fila]);
}
