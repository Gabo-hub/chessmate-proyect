

import { TAM_TABLERO, MAX_INDICE, PUNTUACION_JAQUE_MATE, PUNTUACION_TABLAS } from './constantesAjedrez';
import { calcularMovimientosPosibles, filtrarSoloMovimientosLegales, verificarSiEstaEnJaque } from './motorAjedrez';

function obtenerTodosMovimientosLegales(tablero, esDios, posicionReyBlanco, posicionReyNegro) {
    const todosMovimientos = [];
    for (let fila = 0; fila < TAM_TABLERO; fila++) {
        for (let col = 0; col < TAM_TABLERO; col++) {
            const pieza = tablero[fila][col];
            if (!pieza) continue;
            const piezaEsDios = pieza === pieza.toUpperCase();
            if (esDios !== piezaEsDios) continue;
            const posicionRey = esDios ? posicionReyBlanco : posicionReyNegro;
            const movs = calcularMovimientosPosibles(tablero, fila, col);
            const legales = filtrarSoloMovimientosLegales(tablero, fila, col, movs, posicionRey);
            for (const mov of legales) {
                todosMovimientos.push({
                    filaOrigen: fila, columnaOrigen: col,
                    filaDestino: mov.fila, columnaDestino: mov.columna
                });
            }
        }
    }
    return todosMovimientos;
}

export function ejecutarMinimax(tablero, profundidad, alfa, beta, esMaximizando, evaluarTablero, posicionReyBlanco, posicionReyNegro) {
    if (profundidad === 0) return evaluarTablero(tablero);

    const esTurnoBlanco = esMaximizando;
    const todosMovimientos = obtenerTodosMovimientosLegales(tablero, esTurnoBlanco, posicionReyBlanco, posicionReyNegro);

    if (todosMovimientos.length === 0) {
        const posicionRey = esTurnoBlanco ? posicionReyBlanco : posicionReyNegro;
        const estaEnJaque = verificarSiEstaEnJaque(tablero, esTurnoBlanco, posicionRey.fila, posicionRey.columna);
        return estaEnJaque ? (esTurnoBlanco ? PUNTUACION_JAQUE_MATE : PUNTUACION_TABLAS) : 0;
    }

    if (esMaximizando) {
        let puntajeMaximo = -Infinity;
        for (const mov of todosMovimientos) {
            const piezaOrigenOriginal = tablero[mov.filaOrigen][mov.columnaOrigen];
            const piezaDestinoOriginal = tablero[mov.filaDestino][mov.columnaDestino];
            const reyBlancoAnterior = { ...posicionReyBlanco };

            tablero[mov.filaOrigen][mov.columnaOrigen] = null;
            tablero[mov.filaDestino][mov.columnaDestino] = piezaOrigenOriginal;
            if (piezaOrigenOriginal === 'R') {
                posicionReyBlanco = { fila: mov.filaDestino, columna: mov.columnaDestino };
            }

            const evaluacion = ejecutarMinimax(tablero, profundidad - 1, alfa, beta, false, evaluarTablero, posicionReyBlanco, posicionReyNegro);

            tablero[mov.filaOrigen][mov.columnaOrigen] = piezaOrigenOriginal;
            tablero[mov.filaDestino][mov.columnaDestino] = piezaDestinoOriginal;
            posicionReyBlanco = reyBlancoAnterior;

            puntajeMaximo = Math.max(puntajeMaximo, evaluacion);
            alfa = Math.max(alfa, evaluacion);
            if (beta <= alfa) break;
        }
        return puntajeMaximo;
    } else {
        let puntajeMinimo = Infinity;
        for (const mov of todosMovimientos) {
            const piezaOrigenOriginal = tablero[mov.filaOrigen][mov.columnaOrigen];
            const piezaDestinoOriginal = tablero[mov.filaDestino][mov.columnaDestino];
            const reyNegroAnterior = { ...posicionReyNegro };

            tablero[mov.filaOrigen][mov.columnaOrigen] = null;
            tablero[mov.filaDestino][mov.columnaDestino] = piezaOrigenOriginal;
            if (piezaOrigenOriginal === 'r') {
                posicionReyNegro = { fila: mov.filaDestino, columna: mov.columnaDestino };
            }

            const evaluacion = ejecutarMinimax(tablero, profundidad - 1, alfa, beta, true, evaluarTablero, posicionReyBlanco, posicionReyNegro);

            tablero[mov.filaOrigen][mov.columnaOrigen] = piezaOrigenOriginal;
            tablero[mov.filaDestino][mov.columnaDestino] = piezaDestinoOriginal;
            posicionReyNegro = reyNegroAnterior;

            puntajeMinimo = Math.min(puntajeMinimo, evaluacion);
            beta = Math.min(beta, evaluacion);
            if (beta <= alfa) break;
        }
        return puntajeMinimo;
    }
}

export function buscarMejorMovimiento(tablero, esDios, profundidad, evaluarTablero, posicionReyBlanco, posicionReyNegro) {
    let mejorPuntaje = -Infinity;
    let mejorMovimiento = null;

    const todosMovimientos = obtenerTodosMovimientosLegales(tablero, esDios, posicionReyBlanco, posicionReyNegro);

    for (const mov of todosMovimientos) {
        const piezaOrigenOriginal = tablero[mov.filaOrigen][mov.columnaOrigen];
        const piezaDestinoOriginal = tablero[mov.filaDestino][mov.columnaDestino];
        const reyIAAnterior = esDios ? { ...posicionReyBlanco } : { ...posicionReyNegro };

        tablero[mov.filaOrigen][mov.columnaOrigen] = null;
        tablero[mov.filaDestino][mov.columnaDestino] = piezaOrigenOriginal;
        if (esDios && piezaOrigenOriginal === 'R') {
            posicionReyBlanco = { fila: mov.filaDestino, columna: mov.columnaDestino };
        }
        if (!esDios && piezaOrigenOriginal === 'r') {
            posicionReyNegro = { fila: mov.filaDestino, columna: mov.columnaDestino };
        }

        const puntaje = -ejecutarMinimax(tablero, profundidad - 1, -Infinity, Infinity, !esDios, evaluarTablero, posicionReyBlanco, posicionReyNegro);

        tablero[mov.filaOrigen][mov.columnaOrigen] = piezaOrigenOriginal;
        tablero[mov.filaDestino][mov.columnaDestino] = piezaDestinoOriginal;
        if (esDios) posicionReyBlanco = reyIAAnterior;
        else posicionReyNegro = reyIAAnterior;

        if (puntaje > mejorPuntaje) {
            mejorPuntaje = puntaje;
            mejorMovimiento = mov;
        }
    }
    return mejorMovimiento;
}
