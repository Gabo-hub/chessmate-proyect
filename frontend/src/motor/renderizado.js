

import { TAM_CASILLA, ALTURA_BARRA, SIMBOLOS_PIEZAS, TEMAS_TABLERO } from '../constantes';
import { reproducir, detenerTodo } from './gestorAudio';
import { capturarPieza, efectoJaque, efectoJaqueMate, efectoSeleccion, efectoVictoria, efectoMovimiento } from './gestorEfectos';

export function dibujarTablero(escena) {
    const coloresTema = TEMAS_TABLERO[escena.temaTablero];

    
    const mapa = escena.make.tilemap({ key: `tablero_${escena.temaTablero}` });
    const tileset = mapa.addTilesetImage(`tileset_${escena.temaTablero}`, `tileset_${escena.temaTablero}`);
    
    
    
    
    const escala = TAM_CASILLA / 64;
    const offsetY = ALTURA_BARRA - (128 * escala);
    const capaFondo = mapa.createLayer('Fondo', tileset, 0, offsetY).setScale(escala);
    const capaCasillas = mapa.createLayer('TableroCasillas', tileset, 0, offsetY).setScale(escala);
    const capaEfectos = mapa.createLayer('EfectosEspeciales', tileset, 0, offsetY);
    if (capaEfectos) {
        capaEfectos.setScale(escala);
        capaEfectos.setDepth(1);
    }
    
    console.log("DEBUG TILEMAP:", {
        tileset: tileset,
        capaFondo: capaFondo,
        tilesetImageName: `tileset_${escena.temaTablero}`
    });
    
    escena.mapaTilemap = mapa;
    escena.capaCasillas = capaCasillas;

    
    for (let fila = 0; fila < 8; fila++) {
        escena.casillasTablero[fila] = [];
        for (let col = 0; col < 8; col++) {
            const posicionX = col * TAM_CASILLA + TAM_CASILLA / 2;
            const posicionY = escena.filaPantalla(fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
            
            escena.casillasTablero[fila][col] = escena.add.rectangle(
                posicionX, posicionY, TAM_CASILLA, TAM_CASILLA,
                0xffffff, 0 
            ).setDepth(2);
        }
    }

    
    const graficosBorde = escena.add.graphics();
    graficosBorde.lineStyle(3, 0xDAA520);
    graficosBorde.strokeRect(0, ALTURA_BARRA, 8 * TAM_CASILLA, 8 * TAM_CASILLA);

    
    escena.textosBordes = [];
    const letrasColumnas = 'ABCDEFGH';
    for (let col = 0; col < 8; col++) {
        const txt = escena.add.text(col * TAM_CASILLA + TAM_CASILLA / 2, 8 * TAM_CASILLA + ALTURA_BARRA + 14, letrasColumnas[col], {
            fontSize: '14px', color: '#DAA520', fontFamily: 'Arial'
        }).setOrigin(0.5);
        escena.textosBordes.push(txt);
    }

    
    for (let fila = 0; fila < 8; fila++) {
        const numeroFila = escena.voltearTablero ? (fila + 1) : (8 - fila);
        const txt = escena.add.text(-12, escena.filaPantalla(fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA, `${numeroFila}`, {
            fontSize: '14px', color: '#DAA520', fontFamily: 'Arial'
        }).setOrigin(0.5);
        escena.textosBordes.push(txt);
    }
}

export const MAPA_FRAMES_PIEZAS = {
    'R': 0, 'D': 1, 'T': 2, 'A': 3, 'C': 4, 'P': 5,
    'r': 6, 'd': 7, 't': 8, 'a': 9, 'c': 10, 'p': 11
};

export function dibujarPiezas(escena) {
    for (let fila = 0; fila < 8; fila++) {
        escena.elementosPiezas[fila] = [];
        for (let col = 0; col < 8; col++) {
            const pieza = escena.tablero[fila][col];
            const posicionX = col * TAM_CASILLA + TAM_CASILLA / 2;
            const posicionY = escena.filaPantalla(fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
            
            let frame = 0;
            if (pieza && MAPA_FRAMES_PIEZAS[pieza] !== undefined) {
                frame = MAPA_FRAMES_PIEZAS[pieza];
            }
            
            const sprite = escena.add.sprite(posicionX, posicionY, 'tileset_piezas', frame).setDepth(10);
            sprite.setDisplaySize(TAM_CASILLA * 0.9, TAM_CASILLA * 0.9);
            sprite.setVisible(!!pieza);

            escena.elementosPiezas[fila][col] = sprite;
        }
    }
}

export function crearInterfazUsuario(escena) {
    const graficosBarra = escena.add.graphics().setDepth(50);
    graficosBarra.fillStyle(0x0d0d1a);
    graficosBarra.fillRect(0, 0, 8 * TAM_CASILLA, ALTURA_BARRA);

    escena.textoTurno = escena.add.text(8 * TAM_CASILLA / 2, 12, escena.turnoDioses ? 'Turno: Dioses' : 'Turno: Titanes', {
        fontSize: '18px', color: '#FFD700', fontFamily: 'Cinzel', stroke: '#000', strokeThickness: 1,
    }).setOrigin(0.5).setDepth(60);

    escena.textoJaque = escena.add.text(8 * TAM_CASILLA - 80, 12, '', {
        fontSize: '15px', color: '#FF4444', fontFamily: 'Cinzel', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(60);
}

export function actualizarAnimacionSeleccion(escena) {
    if (escena.casillaSeleccionada && escena.estadoPartida === 'jugando') {
        escena.animacionSeleccion.clear();
        const posicionX = escena.casillaSeleccionada.columna * TAM_CASILLA + TAM_CASILLA / 2;
        const posicionY = escena.filaPantalla(escena.casillaSeleccionada.fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
        const tiempo = escena.time.now / 400;
        const transparencia = 0.4 + Math.sin(tiempo) * 0.3;
        escena.animacionSeleccion.lineStyle(3, 0x00ff00, transparencia);
        escena.animacionSeleccion.strokeCircle(posicionX, posicionY, TAM_CASILLA / 2 + 4);
    } else if (escena.animacionSeleccion) {
        escena.animacionSeleccion.clear();
    }
}

export function ocultarPieza(escena, fila, columna) {
    const elemento = escena.elementosPiezas[fila][columna];
    if (elemento) elemento.setVisible(false);
}

export function mostrarPieza(escena, fila, columna, idPieza) {
    const posicionX = columna * TAM_CASILLA + TAM_CASILLA / 2;
    const posicionY = escena.filaPantalla(fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
    const elemento = escena.elementosPiezas[fila][columna];
    if (elemento && 'setTexture' in elemento) {
        if (idPieza && MAPA_FRAMES_PIEZAS[idPieza] !== undefined) {
            const frame = MAPA_FRAMES_PIEZAS[idPieza];
            elemento.setTexture('tileset_piezas', frame);
        }
        elemento.setPosition(posicionX, posicionY).setVisible(true);
        elemento.setDisplaySize(TAM_CASILLA * 0.9, TAM_CASILLA * 0.9);
    }
}

export function mostrarPantallaFinal(escena, titulo, ganador) {
    const centroX = 8 * TAM_CASILLA / 2;
    const centroY = ALTURA_BARRA + 8 * TAM_CASILLA / 2;

    if (titulo === 'JAQUE MATE') {
        reproducir(escena, 'jaque_mate');
        efectoJaqueMate(escena, centroX, centroY);
    } else {
        reproducir(escena, 'tablas');
    }
    efectoVictoria(escena);

    escena.add.rectangle(centroX, centroY, 8 * TAM_CASILLA, ALTURA_BARRA + 8 * TAM_CASILLA + 40, 0x000000, 0.7).setDepth(150);
    const textoTitulo = escena.add.text(centroX, centroY - 80, `🏆 ${titulo} 🏆`, {
        fontSize: '36px', color: '#FFD700', fontFamily: 'Cinzel', fontStyle: 'bold',
        stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(200);
    escena.tweens.add({
        targets: textoTitulo,
        scaleX: { from: 0.5, to: 1 }, scaleY: { from: 0.5, to: 1 },
        alpha: { from: 0, to: 1 }, duration: 600, ease: 'Back.easeOut'
    });
    escena.add.text(centroX, centroY - 30, `${ganador} ganan!`, {
        fontSize: '24px', color: '#fff', fontFamily: 'Cinzel', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(200);

    if (escena.game._onPuzzleTerminado) escena.game._onPuzzleTerminado();
}

export function salirConAnimacionFade(escena) {
    escena.estadoPartida = 'cargando';
    detenerTodo(escena);
    escena.cameras.main.fadeOut(600, 0, 0, 0);
    escena.time.delayedCall(650, () => {
        const juego = escena.game;
        if (juego._menuCb) juego._menuCb();
    });
}
