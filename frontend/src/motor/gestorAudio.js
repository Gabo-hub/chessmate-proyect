

const RECURSOS_AUDIO = {
    
    musica_menu:       { ruta: 'assets/audio/musica/menu.mp3',        volumen: 0.3, loop: true },
    musica_partida:    { ruta: 'assets/audio/musica/partida.mp3',     volumen: 0.25, loop: true },
    musica_puzzle:     { ruta: 'assets/audio/musica/puzzle.mp3',      volumen: 0.2, loop: true },

    
    movimiento:        { ruta: 'assets/audio/movimientos/movimiento.mp3', volumen: 0.5, loop: false },
    captura:           { ruta: 'assets/audio/movimientos/captura.mp3',    volumen: 0.6, loop: false },
    enroque:           { ruta: 'assets/audio/movimientos/enroque.mp3',    volumen: 0.5, loop: false },
    promocion:         { ruta: 'assets/audio/movimientos/promocion.mp3',  volumen: 0.5, loop: false },

    
    jaque:             { ruta: 'assets/audio/efectos/jaque.mp3',              volumen: 0.6, loop: false },
    jaque_mate:        { ruta: 'assets/audio/efectos/jaque_mate.mp3',         volumen: 0.7, loop: false },
    tablas:            { ruta: 'assets/audio/efectos/tablas.mp3',             volumen: 0.5, loop: false },
    seleccion:         { ruta: 'assets/audio/efectos/seleccion.mp3',          volumen: 0.4, loop: false },
    error:             { ruta: 'assets/audio/efectos/error.mp3',              volumen: 0.5, loop: false },
    boton:             { ruta: 'assets/audio/efectos/boton.mp3',              volumen: 0.3, loop: false },
    puzzle_completado: { ruta: 'assets/audio/efectos/puzzle_completado.mp3',  volumen: 0.6, loop: false },
};

const NOMBRES_RECURSOS = Object.keys(RECURSOS_AUDIO);

export function cargarAudio(escena) {
    for (const nombre of NOMBRES_RECURSOS) {
        const recurso = RECURSOS_AUDIO[nombre];
        try {
            escena.load.audio(nombre, recurso.ruta);
        } catch (error) {
            console.warn(`Audio no disponible: ${nombre} (${recurso.ruta})`);
        }
    }
}

export function verificarAudio(escena) {
    const disponibles = [];
    const faltantes = [];

    for (const nombre of NOMBRES_RECURSOS) {
        if (escena.cache.audio.exists(nombre)) {
            disponibles.push(nombre);
        } else {
            faltantes.push(nombre);
        }
    }

    return { disponibles, faltantes };
}

export function reproducir(escena, nombre) {
    if (!escena.cache.audio.exists(nombre)) return;

    try {
        escena.sound.play(nombre, {
            volume: RECURSOS_AUDIO[nombre]?.volumen ?? 0.5,
            loop: RECURSOS_AUDIO[nombre]?.loop ?? false,
        });
    } catch (error) {
        
    }
}

export function detenerTodo(escena) {
    try {
        escena.sound.stopAll();
    } catch (error) {
        
    }
}

export function reproducirMusica(escena, nombre, duracionFade = 1000) {
    detenerTodo(escena);

    if (!escena.cache.audio.exists(nombre)) return;

    try {
        const musica = escena.sound.add(nombre, {
            volume: 0,
            loop: RECURSOS_AUDIO[nombre]?.loop ?? true,
        });

        musica.play();

        escena.tweens.add({
            targets: musica,
            volume: RECURSOS_AUDIO[nombre]?.volumen ?? 0.3,
            duration: duracionFade,
            ease: 'Sine.easeIn',
        });

        return musica;
    } catch (error) {
        return null;
    }
}

export function silenciar(escena, silenciar) {
    try {
        escena.sound.mute = silenciar;
    } catch (error) {
        
    }
}

export default {
    cargarAudio,
    verificarAudio,
    reproducir,
    detenerTodo,
    reproducirMusica,
    silenciar,
    RECURSOS_AUDIO,
    NOMBRES_RECURSOS,
};
