import { useState, useEffect } from 'react';

const CLAVE_CONFIG = 'ajedrez_griego_config';

const VALORES_DEFECTO = {
    volumenMusica: 70,
    volumenEfectos: 80,
    brillo: 100,
};

function cargarConfiguracion() {
    try {
        const guardada = localStorage.getItem(CLAVE_CONFIG);
        if (guardada) {
            return { ...VALORES_DEFECTO, ...JSON.parse(guardada) };
        }
    } catch (error) {
        console.warn('Error cargando configuracion:', error);
    }
    return { ...VALORES_DEFECTO };
}

function guardarConfiguracion(config) {
    try {
        localStorage.setItem(CLAVE_CONFIG, JSON.stringify(config));
    } catch (error) {
        console.warn('Error guardando configuracion:', error);
    }
}

export default function PanelConfiguracion({ visible, onCerrar }) {
    const [config, setConfig] = useState(cargarConfiguracion);

    
    useEffect(() => {
        const factorBrillo = config.brillo / 100;
        document.body.style.filter = `brightness(${factorBrillo})`;
        return () => { document.body.style.filter = ''; };
    }, [config.brillo]);

    
    useEffect(() => {
        guardarConfiguracion(config);
    }, [config]);

    
    const actualizarConfig = (campo, valor) => {
        setConfig( anterior => ({ ...anterior, [campo]: valor }) );
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 font-['Outfit'] backdrop-blur-sm"
             onClick={onCerrar}>
            <div className="glass-panel rounded-xl p-6 w-[360px] shadow-[0_15px_40px_rgba(0,0,0,0.5),_0_0_50px_rgba(218,165,32,0.06)] border border-amber-500/20"
                 onClick={e => e.stopPropagation()}>

                
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                    <h3 className="text-[#FFD700] font-['Cinzel'] font-bold text-base m-0 uppercase tracking-widest">Ajustes del Juego</h3>
                    <button onClick={onCerrar}
                        className="text-slate-400 w-8 h-8 rounded-none flex items-center justify-center bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 cursor-pointer transition-all duration-250 font-sans font-bold">
                        ✕
                    </button>
                </div>

                
                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2 items-center">
                        <span className="text-[#DAA520] font-['Cinzel'] font-bold tracking-wider text-[11px] uppercase">Volumen de Música</span>
                        <span className="text-slate-350 font-semibold">{config.volumenMusica}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={config.volumenMusica}
                        onChange={e => actualizarConfig('volumenMusica', parseInt(e.target.value))}
                        className="custom-slider" />
                </div>

                
                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2 items-center">
                        <span className="text-[#DAA520] font-['Cinzel'] font-bold tracking-wider text-[11px] uppercase">Volumen de Efectos</span>
                        <span className="text-slate-350 font-semibold">{config.volumenEfectos}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={config.volumenEfectos}
                        onChange={e => actualizarConfig('volumenEfectos', parseInt(e.target.value))}
                        className="custom-slider" />
                </div>

                
                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-2 items-center">
                        <span className="text-[#DAA520] font-['Cinzel'] font-bold tracking-wider text-[11px] uppercase">Brillo de Pantalla</span>
                        <span className="text-slate-350 font-semibold">{config.brillo}%</span>
                    </div>
                    <input type="range" min="50" max="150" value={config.brillo}
                        onChange={e => actualizarConfig('brillo', parseInt(e.target.value))}
                        className="custom-slider" />
                </div>

                
                <button onClick={() => setConfig({ ...VALORES_DEFECTO })}
                    className="w-full py-2.5 mt-2 border border-amber-500/35 rounded-none text-amber-400 text-xs font-['Cinzel'] font-bold
                               cursor-pointer bg-slate-950/40 hover:bg-amber-500 hover:text-black hover:border-transparent transition-all duration-300 uppercase tracking-widest">
                    Restablecer Valores
                </button>
            </div>
        </div>
    );
}
