import { useEffect, useRef, useState, useCallback } from 'react';
import { TAM_CASILLA, ALTURA_BARRA, TEMAS_TABLERO, NIVELES_PUZZLES } from '../constantes';

export default function PhaserGame({ tema, dificultad, modoJuego, ladoJugador, puzzleIdx, puzzleTablero, puzzleTurno, onVolverMenu }) {
    const contenedorRef = useRef(null);
    const juegoRef = useRef(null);
    const puzzleDatos = modoJuego === 'puzzle' ? NIVELES_PUZZLES[puzzleIdx] || null : null;
    const [pistaActiva, setPistaActiva] = useState(-1);
    const [tiempoPuzzle, setTiempoPuzzle] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (modoJuego !== 'puzzle' || !puzzleDatos) return;
        timerRef.current = setInterval(() => setTiempoPuzzle(t => t + 1), 1000);
        return () => clearInterval(timerRef.current);
    }, [modoJuego, puzzleDatos]);

    useEffect(() => {
        setPistaActiva(-1);
        setTiempoPuzzle(0);
    }, [puzzleIdx]);

    const handleSolicitarPista = useCallback(() => {
        if (!puzzleDatos?.pistas) return;
        setPistaActiva(prev => Math.min(prev + 1, puzzleDatos.pistas.length - 1));
    }, [puzzleDatos]);

    useEffect(() => {
        let clickHandler = null;
        let mounted = true;

        async function iniciar() {
            try {
                if (!contenedorRef.current || !mounted) return;
                const contenedor = contenedorRef.current;

                const Phaser = await import('phaser');
                if (!mounted) return;
                const mod = await import('../escenas/EscenaAjedrez');
                const EscenaAjedrez = mod.default;

                if (!mounted || !contenedorRef.current) return;

                const juego = new Phaser.Game({
                    type: Phaser.AUTO,
                    width: 8 * TAM_CASILLA,
                    height: ALTURA_BARRA + 8 * TAM_CASILLA + 40,
                    backgroundColor: TEMAS_TABLERO[tema]?.fondo || '#1a1a2e',
                    parent: contenedor,
                    scene: [],
                    scale: { mode: Phaser.Scale.NONE },
                    input: { activePointers: 1 },
                });
                juegoRef.current = juego;
                juego._menuCb = onVolverMenu;

                const detenerCronometro = () => {
                    clearInterval(timerRef.current);
                };
                juego._onPuzzleTerminado = detenerCronometro;

                const datosIniciales = { tema, dificultad, modoJuego, ladoJugador };
                if (modoJuego === 'puzzle') {
                    datosIniciales.puzzleIdx = puzzleIdx;
                    datosIniciales.puzzleTablero = puzzleTablero;
                    datosIniciales.puzzleTurno = puzzleTurno;
                }
                juego.scene.add('Ajedrez', EscenaAjedrez, true, datosIniciales);

                clickHandler = (evento) => {
                    const lienzo = contenedor.querySelector('canvas');
                    if (!lienzo) return;
                    const rect = lienzo.getBoundingClientRect();
                    const anchoCanvas = 8 * TAM_CASILLA;
                    const altoCanvas = ALTURA_BARRA + 8 * TAM_CASILLA + 40;
                    const x = (evento.clientX - rect.left) * anchoCanvas / rect.width;
                    const y = (evento.clientY - rect.top) * altoCanvas / rect.height;

                    const escena = juego._escenaActual;
                    if (!escena || !escena.scene || !escena.scene.isActive()) return;
                    if (y >= ALTURA_BARRA) {
                        escena.manejarClicJuego(x, y);
                    }
                };
                contenedor.addEventListener('pointerdown', clickHandler);
            } catch (err) {
                console.error('Error al inicializar juego:', err);
            }
        }

        iniciar();

        return () => {
            mounted = false;
            if (contenedorRef.current && clickHandler) {
                contenedorRef.current.removeEventListener('pointerdown', clickHandler);
            }
            if (juegoRef.current) {
                juegoRef.current.destroy(false);
                juegoRef.current = null;
            }
        };
    }, [tema, dificultad, modoJuego, ladoJugador, puzzleIdx]);

    useEffect(() => {
        if (juegoRef.current) juegoRef.current._menuCb = onVolverMenu;
    }, [onVolverMenu]);

    const formatearTiempo = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (modoJuego === 'puzzle' && puzzleDatos) {
        return (
            <div className="relative">
                <button onClick={onVolverMenu}
                    className="absolute -top-12 left-0 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border border-gray-600 rounded-lg text-sm transition-colors z-50">
                    ← Volver al Menú
                </button>
                <div className="flex gap-5 items-start flex-wrap justify-center">
                    <div className="flex-shrink-0">
                        <div
                            ref={contenedorRef}
                            className="border-[3px] border-[#DAA520] rounded-lg overflow-hidden"
                            style={{
                                width: `${8 * TAM_CASILLA}px`,
                                height: `${ALTURA_BARRA + 8 * TAM_CASILLA + 40}px`,
                                boxShadow: '0 0 30px rgba(218,165,32,0.2)',
                            }}
                        />
                    </div>
                    <div className="bg-gray-900/95 backdrop-blur-sm border border-amber-500/30 rounded-xl p-5 w-72 flex-shrink-0 shadow-2xl">
                        <div className="mb-4">
                            <div className="text-amber-400 text-xs uppercase tracking-wider mb-1">Puzzle {puzzleIdx + 1} de {NIVELES_PUZZLES.length}</div>
                            <h3 className="text-amber-300 font-bold text-lg m-0">{puzzleDatos.nombre}</h3>
                            <p className="text-gray-400 text-sm mt-2 m-0 leading-relaxed">{puzzleDatos.descripcion}</p>
                        </div>
                        <div className="border-t border-amber-500/20 pt-3 mb-3">
                            <div className="text-amber-500/80 text-xs uppercase tracking-wider mb-2">Como resolverlo</div>
                            <p className="text-gray-300 text-sm m-0 leading-relaxed">{puzzleDatos.guia}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                                <div className="text-amber-400 font-bold">{formatearTiempo(tiempoPuzzle)}</div>
                                <div className="text-gray-500 text-xs">Tiempo</div>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                                <div className="text-amber-400 font-bold">{puzzleDatos.jugadasEsperadas || 1}</div>
                                <div className="text-gray-500 text-xs">Jugadas</div>
                            </div>
                        </div>
                        {pistaActiva >= 0 && puzzleDatos.pistas && (
                            <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <div className="text-amber-500/80 text-xs mb-1">Pista {pistaActiva + 1} de {puzzleDatos.pistas.length}</div>
                                <p className="text-amber-200 text-sm m-0">{puzzleDatos.pistas[pistaActiva]}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            {pistaActiva < (puzzleDatos.pistas?.length || 0) - 1 && (
                                <button onClick={handleSolicitarPista} className="w-full py-2 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium rounded-lg transition-colors text-sm">
                                    Pedir Pista
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <button onClick={onVolverMenu}
                className="absolute -top-12 left-0 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border border-gray-600 rounded-lg text-sm transition-colors z-50">
                ← Volver al Menú
            </button>
            <div
                ref={contenedorRef}
                className="border-[3px] border-[#DAA520] rounded-lg overflow-hidden"
                style={{
                    width: `${8 * TAM_CASILLA}px`,
                    height: `${ALTURA_BARRA + 8 * TAM_CASILLA + 40}px`,
                    boxShadow: '0 0 30px rgba(218,165,32,0.2)',
                }}
            />
        </div>
    );
}
