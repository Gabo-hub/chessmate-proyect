

import { useEffect, useCallback, useState, lazy, Suspense } from 'react';
import { NIVELES_PUZZLES, IMAGENES_FONDO_LADO } from './constantes';
import MenuPrincipal from './componentes/MenuPrincipal';

const PhaserGame = lazy(() => import('./componentes/PhaserGame'));

const EscudoCarga = () => (
    <div className="relative w-24 h-24 mx-auto mb-6">
        <svg className="w-full h-full text-[#ffd700] opacity-80 giro-lento" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx="12" cy="12" r="8"/>
            <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5"/>
        </svg>
    </div>
);

function App() {
    const [pantallaActual, setPantallaActual] = useState('inicio');
    const [nivelDificultad, setNivelDificultad] = useState('humano');
    const [temaTablero, setTemaTablero] = useState('olimpo');
    const [modoJuegoActual, setModoJuegoActual] = useState('partida');
    const [indicePuzzleSeleccionado, setIndicePuzzleSeleccionado] = useState(0);
    const [ladoJugador, setLadoJugador] = useState('dioses');

    useEffect(() => {
        const temporizador = setTimeout(() => setPantallaActual('menu'), 2500);
        return () => clearTimeout(temporizador);
    }, []);

    const iniciarNuevaPartida = useCallback(async (modo, indicePuzzle) => {
        setModoJuegoActual(modo);
        if (indicePuzzle !== undefined) setIndicePuzzleSeleccionado(indicePuzzle);
        setPantallaActual('cargando');
        setTimeout(() => setPantallaActual('juego'), 1200);
    }, []);

    const volverAlMenu = useCallback(() => {
        setPantallaActual('menu');
    }, []);

    if (pantallaActual === 'inicio') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center font-['Outfit'] relative overflow-hidden"
                 style={{ backgroundImage: `url(${IMAGENES_FONDO_LADO[ladoJugador]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="relative z-10 text-center glass-panel px-8 py-10 md:px-12 md:py-16 rounded-3xl max-w-md mx-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5">
                    <EscudoCarga />
                    <h1 className="text-4xl md:text-5xl font-black font-['Cinzel'] tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B13C] to-[#8C6D1F] drop-shadow-[0_2px_15px_rgba(218,165,32,0.25)] m-0">
                        AJEDREZ GRIEGO
                    </h1>
                    <p className="text-[#c9a55a] italic mt-3 mb-6 text-sm tracking-wider opacity-80">Donde los dioses juegan por la gloria</p>
                    <div className="w-[200px] h-1.5 bg-slate-950/80 rounded-full overflow-hidden mx-auto mt-4 border border-white/5">
                        <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #DAA520, #FFD700, #DAA520)', animation: 'cargarInicio 2s ease-in-out' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (pantallaActual === 'auth') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center font-['Outfit'] relative overflow-hidden"
                 style={{ backgroundImage: `url(${IMAGENES_FONDO_LADO[ladoJugador]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="relative z-10 text-center glass-panel p-8 md:p-12 rounded-3xl max-w-sm mx-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5">
                    <h2 className="text-[#FFD700] font-['Cinzel'] text-2xl font-bold tracking-wider mb-2 uppercase">Portal de Dioses</h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">Inicia sesión para sincronizar tus estadísticas.</p>
                    
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-xs mb-6 font-medium">
                        El servidor de autenticación estará disponible próximamente en la versión v1.2.0.
                    </div>

                    <button onClick={() => setPantallaActual('menu')} 
                        className="w-full py-2.5 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-semibold uppercase tracking-wider cursor-pointer bg-slate-950/40 hover:bg-amber-500 hover:text-black hover:border-transparent hover:shadow-[0_0_15px_rgba(218,165,32,0.35)] transition-all duration-300">
                        Volver al Templo
                    </button>
                </div>
            </div>
        );
    }
    if (pantallaActual === 'menu') {
        return (
            <MenuPrincipal
                modoJuegoActual={modoJuegoActual}
                setModoJuegoActual={setModoJuegoActual}
                nivelDificultad={nivelDificultad}
                setNivelDificultad={setNivelDificultad}
                temaTablero={temaTablero}
                setTemaTablero={setTemaTablero}
                ladoJugador={ladoJugador}
                setLadoJugador={setLadoJugador}
                onIniciarPartida={iniciarNuevaPartida}
                onIrAuth={() => setPantallaActual('auth')}
            />
        );
    }

    if (pantallaActual === 'cargando') {
        const fondoLado = IMAGENES_FONDO_LADO[ladoJugador] || IMAGENES_FONDO_LADO.dioses;
        return (
            <div className="min-h-screen flex flex-col items-center justify-center font-['Outfit'] relative overflow-hidden"
                 style={{ backgroundImage: `url(${fondoLado})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="relative z-10 text-center glass-panel px-8 py-10 rounded-3xl max-w-sm mx-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5">
                    <EscudoCarga />
                    <h2 className="text-[#FFD700] font-['Cinzel'] text-xl font-bold tracking-[0.2em] mb-4 uppercase">Preparando Batalla</h2>
                    <div className="w-[180px] h-1 bg-slate-950/80 rounded-full overflow-hidden mx-auto border border-white/5">
                        <div className="w-full h-full bg-[#DAA520] rounded-full" style={{ animation: 'cargar 1s ease-in-out' }} />
                    </div>
                    <div className="text-slate-400 text-xs mt-4 tracking-wide">Invocando el poder del Olimpo...</div>
                </div>
            </div>
        );
    }

    if (pantallaActual === 'juego') {
        const fondoLado = IMAGENES_FONDO_LADO[ladoJugador] || IMAGENES_FONDO_LADO.dioses;
        return (
            <div className="min-h-screen flex flex-col items-center justify-center"
                 style={{ backgroundImage: `url(${fondoLado})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Suspense fallback={
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 text-[#FFD700] text-sm font-semibold tracking-wider uppercase">Cargando Campo de Batalla...</div>
                }>
                    <PhaserGame
                        tema={temaTablero}
                        dificultad={nivelDificultad}
                        modoJuego={modoJuegoActual}
                        ladoJugador={ladoJugador}
                        puzzleIdx={indicePuzzleSeleccionado}
                        puzzleTablero={modoJuegoActual === 'puzzle' ? NIVELES_PUZZLES[indicePuzzleSeleccionado]?.tablero : null}
                        puzzleTurno={modoJuegoActual === 'puzzle' ? NIVELES_PUZZLES[indicePuzzleSeleccionado]?.turno : null}
                        onVolverMenu={volverAlMenu}
                    />
                </Suspense>
            </div>
        );
    }

    return null;
}

export default App;
