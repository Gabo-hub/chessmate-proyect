

import Phaser from 'phaser';
import servicioWebSocket from '../servicios/websocket';
import { TAM_CASILLA, ALTURA_BARRA, POSICION_INICIAL, TEMAS_TABLERO, NIVELES_PUZZLES, RUTAS_SPRITES } from '../constantes';
import { PROFUNDIDAD_PUZZLE, PROFUNDIDAD_CAMPEON, PROFUNDIDAD_OLYMPUS, RETRASO_IA_PENSANDO } from '../motor/constantesAjedrez';
import { clonarTablero, evaluarTablero } from '../utilidades';
import { generarSpritesUI } from '../motor/generadorSprites';
import { cargarAudio, verificarAudio, reproducir } from '../motor/gestorAudio';
import { efectoSeleccion } from '../motor/gestorEfectos';
import {
    calcularMovimientosPosibles as calcularMovimientosPosiblesMotor,
    filtrarSoloMovimientosLegales as filtrarSoloMovimientosLegalesMotor,
    buscarPosicionesReyes as buscarPosicionesReyesMotor,
} from '../motor/motorAjedrez';
import { buscarMejorMovimiento } from '../motor/iaAjedrez';
import {
    dibujarTablero, dibujarPiezas, crearInterfazUsuario,
    actualizarAnimacionSeleccion, ocultarPieza, mostrarPieza,
    salirConAnimacionFade, mostrarPantallaFinal
} from '../motor/renderizado';
import {
    ejecutarMovimiento, aplicarMovimientoRemoto, manejarClicJuego, manejarClicMenu
} from '../motor/movimientosEscena';

let escenaActualRef = null;
export { escenaActualRef };

export default class EscenaAjedrez extends Phaser.Scene {
    constructor() {
        super('Ajedrez');
    }

    preload() {
        cargarAudio(this);
        
        this.load.tilemapTiledJSON(`tablero_${this.temaTablero}`, `/assets/mapas/${this.temaTablero}.json`);
        this.load.image(`tileset_${this.temaTablero}`, `/assets/sprites/tilesets/tileset_${this.temaTablero}.png`);
        
        
        for (const [clave, ruta] of Object.entries(RUTAS_SPRITES)) {
            this.load.image(`pieza_${clave}`, `/${ruta}`);
        }
        
        
        this.load.spritesheet('tileset_piezas', '/assets/sprites/tilesets/tileset_piezas.png', { frameWidth: 64, frameHeight: 64 });
    }

    init(datosIniciales) {
        this.temaTablero = datosIniciales?.tema || 'olimpo';
        this.dificultadIA = datosIniciales?.dificultad || 'humano';
        this.modoJuego = datosIniciales?.modoJuego || 'partida';
        this.indicePuzzle = datosIniciales?.puzzleIdx || 0;
        this.ladoJugador = datosIniciales?.ladoJugador || 'dioses';
        this.voltearTablero = this.ladoJugador === 'titanes';
        this.iaEsDioses = this.voltearTablero;
        this.iaActivada = this.dificultadIA !== 'humano' || this.modoJuego === 'puzzle' || this.voltearTablero;

        if (datosIniciales?.puzzleTablero) {
            this.tablero = clonarTablero(datosIniciales.puzzleTablero);
            this.turnoDioses = datosIniciales?.puzzleTurno ?? true;
        }
    }

    filaPantalla(filaLogica) {
        return this.voltearTablero ? (7 - filaLogica) : filaLogica;
    }

    filaLogica(filaPant) {
        return this.voltearTablero ? (7 - filaPant) : filaPant;
    }

    create() {
        escenaActualRef = this;
        if (this.game) this.game._escenaActual = this;

        if (this.modoJuego !== 'puzzle' || !this.tablero.length) {
            
            const mapaTemporal = this.make.tilemap({ key: `tablero_${this.temaTablero}` });
            const capaPiezas = mapaTemporal.getObjectLayer('Piezas');
            
            if (capaPiezas && capaPiezas.objects && capaPiezas.objects.length > 0) {
                
                this.tablero = Array(8).fill(null).map(() => Array(8).fill(null));
                capaPiezas.objects.forEach(obj => {
                    const props = obj.properties || [];
                    const getProp = (name) => props.find(p => p.name === name)?.value;
                    const pieza = getProp('pieza');
                    const fila = getProp('fila');
                    const columna = getProp('columna');
                    const equipo = getProp('equipo');
                    if (pieza && fila !== undefined && columna !== undefined) {
                        this.tablero[fila][columna] = equipo === 'blancas' ? pieza.toUpperCase() : pieza.toLowerCase();
                    }
                });
            } else {
                this.tablero = POSICION_INICIAL.map(fila => [...fila]);
            }
            this.turnoDioses = this.ladoJugador === 'dioses';
        }

        if (this.voltearTablero && this.iaActivada && this.turnoDioses && this.modoJuego !== 'puzzle') {
            this.turnoDioses = true;
        }

        this.estadoPartida = 'cargando';
        this.casillaSeleccionada = null;
        this.movimientosDisponibles = [];
        this.casillasTablero = [];
        this.elementosPiezas = [];
        this.indicadoresMovimiento = [];
        this.posicionReyBlanco = { fila: 0, columna: 4 };
        this.posicionReyNegro = { fila: 7, columna: 4 };

        this.cameras.main.setBackgroundColor(TEMAS_TABLERO[this.temaTablero].fondo);

        
        generarSpritesUI(this);

        verificarAudio(this);

        const posReyes = buscarPosicionesReyesMotor(this.tablero);
        if (posReyes.blanco) this.posicionReyBlanco = posReyes.blanco;
        if (posReyes.negro) this.posicionReyNegro = posReyes.negro;

        
        dibujarTablero(this);
        dibujarPiezas(this);
        crearInterfazUsuario(this);

        this.animacionSeleccion = this.add.graphics().setDepth(100);

        
        this.manejarClicJuego = (x, y) => manejarClicJuego(this, x, y);
        this.manejarClicMenu = (x, y) => manejarClicMenu(this, x, y);

        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.time.delayedCall(900, () => {
            this.estadoPartida = 'jugando';
            if (this.modoJuego === 'puzzle') {
                this.textoTurno.setText(this.turnoDioses ? 'Tu turno — Dioses' : 'IA — Titanes');
                this.textoTurno.setColor(this.turnoDioses ? '#FFD700' : '#888888');
                if (!this.turnoDioses && this.iaActivada) {
                    this.time.delayedCall(500, () => this.jugarTurnoIA());
                }
            } else if (this.voltearTablero) {
                this.textoTurno.setText(this.turnoDioses ? 'IA — Dioses' : 'Tu turno — Titanes');
                this.textoTurno.setColor(this.turnoDioses ? '#888888' : '#FFD700');
                if (this.turnoDioses && this.iaActivada) {
                    this.time.delayedCall(500, () => this.jugarTurnoIA());
                }
            }
        });

        this.input.keyboard?.on('keydown-W', () => {
            if (this.estadoPartida === 'jugando') {
                reproducir(this, 'jaque_mate');
                this.activarVictoriaPrueba();
            }
        });

        if (this.modoJuego === 'online') {
            servicioWebSocket.on('movimiento_realizado', (datos) => {
                if (datos.movimiento && this.estadoPartida === 'jugando') {
                    aplicarMovimientoRemoto(this, datos.movimiento);
                }
            });
        }
    }

    destruir() {
        escenaActualRef = null;
    }

    update() {
        actualizarAnimacionSeleccion(this);
    }

    

    piezaEsDelTurno(pieza) {
        return this.turnoDioses ? pieza === pieza.toUpperCase() : pieza === pieza.toLowerCase();
    }

    seleccionarPieza(fila, columna) {
        this.casillaSeleccionada = { fila, columna };
        const movsBasicos = calcularMovimientosPosiblesMotor(this.tablero, fila, columna);
        const pieza = this.tablero[fila][columna];
        const esDios = pieza === pieza.toUpperCase();
        const posRey = esDios ? this.posicionReyBlanco : this.posicionReyNegro;
        this.movimientosDisponibles = filtrarSoloMovimientosLegalesMotor(this.tablero, fila, columna, movsBasicos, posRey);

        reproducir(this, 'seleccion');
        const posX = columna * TAM_CASILLA + TAM_CASILLA / 2;
        const posY = this.filaPantalla(fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
        efectoSeleccion(this, posX, posY);

        const indicadorSeleccion = this.add.rectangle(
            columna * TAM_CASILLA + TAM_CASILLA / 2,
            this.filaPantalla(fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA,
            TAM_CASILLA - 2, TAM_CASILLA - 2
        );
        indicadorSeleccion.setFillStyle(0x00ff00, 0.25);
        indicadorSeleccion.setStrokeStyle(3, 0x00ff00);
        indicadorSeleccion.setDepth(5);
        this.indicadoresMovimiento.push(indicadorSeleccion);

        for (const mov of this.movimientosDisponibles) {
            const piezaDestino = this.tablero[mov.fila][mov.columna];
            if (piezaDestino) {
                const indicadorCaptura = this.add.rectangle(
                    mov.columna * TAM_CASILLA + TAM_CASILLA / 2,
                    this.filaPantalla(mov.fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA,
                    TAM_CASILLA - 2, TAM_CASILLA - 2
                );
                indicadorCaptura.setFillStyle(0xff0000, 0.35);
                indicadorCaptura.setStrokeStyle(2, 0xff0000);
                indicadorCaptura.setDepth(5);
                this.indicadoresMovimiento.push(indicadorCaptura);
            } else {
                const indicadorVacio = this.add.circle(
                    mov.columna * TAM_CASILLA + TAM_CASILLA / 2,
                    this.filaPantalla(mov.fila) * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA,
                    10, 0x90ee90, 0.7
                );
                indicadorVacio.setDepth(5);
                this.indicadoresMovimiento.push(indicadorVacio);
            }
        }
    }

    limpiarSeleccion() {
        this.casillaSeleccionada = null;
        this.movimientosDisponibles = [];
        for (const indicador of this.indicadoresMovimiento) indicador.destroy();
        this.indicadoresMovimiento = [];
        this.animacionSeleccion.clear();
    }

    jugarTurnoIA() {
        const esTurnoIA = this.iaEsDioses ? this.turnoDioses : !this.turnoDioses;
        if (this.estadoPartida !== 'jugando' || !esTurnoIA) return;
        this.textoTurno.setText(this.modoJuego === 'puzzle' ? 'IA pensando...' : (this.iaEsDioses ? 'Dioses pensando...' : 'Titanes pensando...'));

        this.time.delayedCall(RETRASO_IA_PENSANDO, () => {
            const profundidadBusqueda = this.modoJuego === 'puzzle' ? PROFUNDIDAD_PUZZLE : (this.dificultadIA === 'campeon' ? PROFUNDIDAD_CAMPEON : PROFUNDIDAD_OLYMPUS);
            const mejorMovimiento = buscarMejorMovimiento(this.tablero, this.iaEsDioses, profundidadBusqueda, evaluarTablero, this.posicionReyBlanco, this.posicionReyNegro);
            if (mejorMovimiento) {
                ejecutarMovimiento(this, mejorMovimiento.filaOrigen, mejorMovimiento.columnaOrigen, mejorMovimiento.filaDestino, mejorMovimiento.columnaDestino);
            }
        });
    }

    activarVictoriaPrueba() {
        this.estadoPartida = 'fin';
        const ganador = this.turnoDioses ? 'Los Titanes' : 'Los Dioses';
        mostrarPantallaFinal(this, 'JAQUE MATE', ganador);
    }
}
