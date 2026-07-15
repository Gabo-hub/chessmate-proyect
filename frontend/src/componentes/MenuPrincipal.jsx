import { useState } from 'react';
import { NIVELES_PUZZLES } from '../constantes';
import usarAlmacenAuth from '../almacen/useAuthStore';
import FondoEstrellas from './FondoEstrellas';
import PanelConfiguracion from './PanelConfiguracion';

const IconoConfig = () => (
    <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.59 3.94z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconoPartida = () => (
    <svg className="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);

const IconoEspadas = () => (
    <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
);

const IconoWeb = () => (
    <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 018.716 2.253M12 3a9.003 9.003 0 00-8.716 2.253" />
    </svg>
);

const IconoRompecabezas = () => (
    <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-1.813-5.096M9 21h1.438c.614 0 1.2.2 1.687.562l1.688 1.25c.343.255.824.255 1.168 0l1.687-1.25c.488-.361 1.073-.562 1.687-.562H18m0-5.188L17.188 9m0 0l-1.813 5.096M17.188 9h1.437c.614 0 1.2-.2 1.688-.562l1.687-1.25c.344-.255.825-.255 1.169 0l1.687 1.25c.488.361 1.073.562 1.688.562H27M9 9l.813-5.096M9 9H7.562c-.614 0-1.2.2-1.687.562L4.187 8.312c-.344.255-.825.255-1.169 0L1.33 7.062C.843 6.7.258 6.5-.356 6.5H-1" />
    </svg>
);

const IconoEscudoDioses = () => (
    <svg className="w-10 h-10 mx-auto mb-1 text-[#FFD700] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 3a9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9z" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="5" fill="none" stroke="#FFD700" strokeWidth="1.5" />
    </svg>
);

const IconoCascoTitanes = () => (
    <svg className="w-10 h-10 mx-auto mb-1 text-[#FF4444] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14H16M9 10L12 6L15 10" />
    </svg>
);

export default function MenuPrincipal({
    modoJuegoActual, setModoJuegoActual,
    nivelDificultad, setNivelDificultad,
    temaTablero, setTemaTablero,
    ladoJugador, setLadoJugador,
    onIniciarPartida, onIrAuth,
}) {
    const { usuario: usuarioActual, cerrarSesion } = usarAlmacenAuth();
    const [mostrarConfig, setMostrarConfig] = useState(false);

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center font-['Outfit'] relative overflow-hidden px-4 py-2"
            style={{ backgroundImage: `url(/assets/sprites/fondos/${ladoJugador}.svg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

            <FondoEstrellas lado={ladoJugador} />
            <PanelConfiguracion visible={mostrarConfig} onCerrar={() => setMostrarConfig(false)} />

            
            <div className={`relative z-10 w-full max-w-[850px] max-h-[92vh] glass-panel rounded-xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto scrollbar-thin transition-all duration-700 ${ladoJugador === 'titanes'
                ? 'shadow-[0_15px_40px_rgba(0,0,0,0.5),_0_0_50px_rgba(239,68,68,0.06)] border-red-500/10'
                : 'shadow-[0_15px_40px_rgba(0,0,0,0.5),_0_0_50px_rgba(218,165,32,0.08)] border-amber-500/15'
                }`}>

                
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5 flex-shrink-0 font-['Cinzel'] tracking-wider">
                    <button onClick={() => setMostrarConfig(true)}
                        className="px-3.5 py-1.5 border border-amber-500/30 rounded-none text-amber-400 text-xs font-semibold cursor-pointer bg-slate-950/40 hover:bg-amber-500 hover:text-black hover:border-transparent transition-all duration-300 flex items-center">
                        <IconoConfig />
                        Ajustes
                    </button>

                    <div className="flex items-center gap-3">
                    </div>
                </div>

                
                <div className="flex-1 flex flex-col justify-center min-h-0">

                    
                    <div className="text-center mb-6 flex-shrink-0">
                        <h1 className="text-3xl md:text-4xl font-black font-['Cinzel'] tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B13C] to-[#8C6D1F] drop-shadow-[0_2px_8px_rgba(218,165,32,0.15)] m-0">
                            AJEDREZ GRIEGO
                        </h1>
                        <p className="text-[#c9a55a] uppercase font-['Outfit'] tracking-[0.2em] text-[10px] font-semibold mt-2 opacity-95">
                            La Batalla Celestial por el Olimpo
                        </p>
                    </div>

                    
                    <div className="border-b-2 border-amber-500/20 flex gap-6 mb-6 max-w-md mx-auto w-full flex-shrink-0 justify-center">
                        {['partida', 'puzzle'].map(modo => (
                            <button key={modo} onClick={() => setModoJuegoActual(modo)}
                                className={`pb-2 px-3 font-['Cinzel'] font-bold text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center border-b-2 -mb-[2px] ${modoJuegoActual === modo
                                    ? 'border-amber-500 text-amber-300 font-extrabold'
                                    : 'border-transparent text-slate-400 hover:text-white'
                                    }`}>
                                {modo === 'partida' ? <IconoPartida /> : modo === 'online' ? <IconoWeb /> : <IconoRompecabezas />}
                                {modo === 'partida' ? 'VS IA' : modo === 'online' ? 'Online' : 'Puzzles'}
                            </button>
                        ))}
                    </div>

                    
                    <div className="overflow-y-auto pr-1 max-h-[48vh] scrollbar-thin">

                        
                        {modoJuegoActual !== 'puzzle' && (
                            <div className="bg-slate-950/45 p-4 rounded-none border border-amber-500/10 flex flex-col gap-4 mb-5 flex-shrink-0">
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                                    <div className="text-left">
                                        <label className="text-[#DAA520] font-['Cinzel'] font-bold text-xs tracking-widest uppercase block">Dificultad</label>
                                        <span className="text-[10px] text-slate-450 font-['Outfit']">
                                            {nivelDificultad === 'humano' ? 'Dos jugadores locales' : nivelDificultad === 'campeon' ? 'IA Nivel Intermedio' : 'IA Nivel Experto'}
                                        </span>
                                    </div>
                                    <div className="bg-black/20 p-1 border border-slate-800 flex gap-1 w-full sm:w-auto">
                                        {['humano', 'campeon', 'olympus'].map(d => (
                                            <button key={d} onClick={() => setNivelDificultad(d)}
                                                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-none font-['Cinzel'] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer text-center border ${nivelDificultad === d
                                                    ? 'bg-amber-500 text-black border-amber-500'
                                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}>
                                                {d === 'humano' ? 'Local' : d === 'campeon' ? 'Campeón' : 'Olympus'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="text-left">
                                        <label className="text-[#DAA520] font-['Cinzel'] font-bold text-xs tracking-widest uppercase block">Tablero</label>
                                        <span className="text-[10px] text-slate-450 font-['Outfit']">
                                            {temaTablero === 'olimpo' ? 'Templo de Mármol Dorado' : temaTablero === 'inframundo' ? 'Abismo de Lava y Ceniza' : 'Bosque Sagrado y Piedra'}
                                        </span>
                                    </div>
                                    <div className="bg-black/20 p-1 border border-slate-800 flex gap-1 w-full sm:w-auto">
                                        {['olimpo', 'inframundo', 'monte_olimpo'].map(t => (
                                            <button key={t} onClick={() => setTemaTablero(t)}
                                                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-none font-['Cinzel'] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer text-center border ${temaTablero === t
                                                    ? 'bg-amber-500 text-black border-amber-500'
                                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}>
                                                {t === 'olimpo' ? 'Olimpo' : t === 'inframundo' ? 'Inframundo' : 'Monte'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        {modoJuegoActual === 'partida' && (
                            <div className="mb-2 text-center">
                                <label className="text-[#DAA520] font-['Cinzel'] font-bold text-xs tracking-widest block mb-2 uppercase">Elegir Facción</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                                    
                                    <button onClick={() => setLadoJugador('dioses')}
                                        className={`group p-4 rounded-none border-2 border-double text-center transition-all duration-500 cursor-pointer ${ladoJugador === 'dioses'
                                            ? 'bg-gradient-to-b from-amber-950/20 to-amber-900/40 border-amber-500 text-white shadow-[0_0_20px_rgba(218,165,32,0.12)]'
                                            : 'bg-black/20 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-350'
                                            }`}>
                                        <IconoEscudoDioses />
                                        <div className={`font-['Cinzel'] font-bold text-sm transition-colors ${ladoJugador === 'dioses' ? 'text-amber-300' : 'text-slate-300 group-hover:text-amber-450'}`}>
                                            DIOSES DEL OLIMPO
                                        </div>
                                        <div className="text-[10px] font-medium font-['Outfit'] uppercase tracking-wider opacity-60 mt-0.5">
                                            Blancas • Primero
                                        </div>
                                    </button>

                                    
                                    <button onClick={() => setLadoJugador('titanes')}
                                        className={`group p-4 rounded-none border-2 border-double text-center transition-all duration-500 cursor-pointer ${ladoJugador === 'titanes'
                                            ? 'bg-gradient-to-b from-red-950/30 to-red-900/40 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                                            : 'bg-black/20 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-350'
                                            }`}>
                                        <IconoCascoTitanes />
                                        <div className={`font-['Cinzel'] font-bold text-sm transition-colors ${ladoJugador === 'titanes' ? 'text-red-400' : 'text-slate-300 group-hover:text-red-450'}`}>
                                            FUERZAS DEL TÁRTARO
                                        </div>
                                        <div className="text-[10px] font-medium font-['Outfit'] uppercase tracking-wider opacity-60 mt-0.5">
                                            Negras • Segundo
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        
                        {modoJuegoActual === 'online' && (
                            <div className="bg-slate-950/45 p-6 rounded-none border border-amber-500/10 text-center mb-4 max-w-xl mx-auto">
                                <div className="text-[#DAA520] font-['Cinzel'] font-bold text-base tracking-wider mb-1 uppercase">Multijugador Online</div>
                                <p className="text-slate-400 text-xs mb-4 max-w-md mx-auto font-['Outfit']">Enfréntate a jugadores de todo el mundo en batallas por el dominio del tablero celestial.</p>

                                {usuarioActual ? (
                                    <div className="text-left border-t border-white/5 pt-3">
                                        <label className="text-slate-400 text-[10px] font-['Cinzel'] font-bold tracking-wider block mb-2 uppercase text-center">Seleccionar Estilo del Tablero</label>
                                        <div className="flex gap-2 justify-center flex-wrap">
                                            {['olimpo', 'inframundo', 'monte_olimpo'].map(t => (
                                                <button key={t} onClick={() => setTemaTablero(t)}
                                                    className={`px-3 py-1.5 rounded-none border font-['Cinzel'] text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${temaTablero === t
                                                        ? 'bg-amber-500 text-black border-amber-500'
                                                        : 'bg-black/30 border-slate-700 text-slate-400 hover:border-slate-600'
                                                        }`}>
                                                    {t === 'olimpo' ? 'Olimpo' : t === 'inframundo' ? 'Inframundo' : 'Monte'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-none">
                                        <p className="text-red-400 text-[11px] font-semibold mb-3 font-['Outfit']">Se requiere iniciar sesión para el emparejamiento competitivo</p>
                                        <button onClick={onIrAuth}
                                            className="px-5 py-2 border border-[#DAA520] rounded-none font-['Cinzel'] font-bold text-[10px] tracking-wider uppercase bg-[#DAA520] text-black hover:bg-white transition-all">
                                            Iniciar Sesión Ahora
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        
                        {modoJuegoActual === 'puzzle' && (
                            <div className="mb-4">
                                <label className="text-[#DAA520] font-['Cinzel'] font-bold text-xs tracking-widest block mb-3 text-center uppercase">Resolver Desafíos Tácticos</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                    {NIVELES_PUZZLES.map((puzzle, indice) => (
                                        <button key={indice} onClick={() => onIniciarPartida('puzzle', indice)}
                                            className="puzzle-card group relative overflow-hidden text-left cursor-pointer transition-all duration-300">
                                            {/* Accent top border */}
                                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {/* Background glow on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-900/0 group-hover:from-amber-500/5 group-hover:to-amber-900/10 transition-all duration-300" />
                                            <div className="relative z-10 p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg leading-none">♟</span>
                                                        <span className="font-['Cinzel'] font-bold text-xs text-slate-200 group-hover:text-amber-300 transition-colors duration-300">
                                                            {puzzle.nombre}
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase font-['Cinzel']">
                                                        #{indice + 1}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 leading-relaxed font-['Outfit'] mb-2">{puzzle.descripcion}</p>
                                                <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                                                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-['Cinzel']">Dificultad</span>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(3)].map((_, i) => (
                                                            <span key={i} className={`text-[10px] ${i < (indice + 1) ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                
                {modoJuegoActual !== 'puzzle' && (
                    <div className="text-center mt-5 flex-shrink-0">
                        <button onClick={() => onIniciarPartida(modoJuegoActual)}
                            className={`text-xs font-['Cinzel'] tracking-[0.25em] font-extrabold px-12 py-4 rounded-none cursor-pointer text-black border-2 border-transparent uppercase hover:scale-[1.02] transition-all duration-300 ${ladoJugador === 'titanes'
                                ? 'hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                                : 'hover:shadow-[0_0_25px_rgba(218,165,32,0.3)]'
                                }`}
                            style={{
                                background: ladoJugador === 'titanes'
                                    ? 'linear-gradient(90deg, #EF4444, #B91C1C, #EF4444)'
                                    : 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)',
                                textShadow: '0 1px 2px rgba(255,255,255,0.2)'
                            }}>
                            {modoJuegoActual === 'online' ? 'Buscar Partida Online' : 'Iniciar Gran Batalla'}
                        </button>
                    </div>
                )}

                <div className="text-slate-650 text-[9px] text-center font-semibold mt-5 tracking-[0.2em] uppercase flex-shrink-0 font-['Cinzel']">
                    Mythology Chess Edition • v1.1.0
                </div>
            </div>
        </div>
    );
}
