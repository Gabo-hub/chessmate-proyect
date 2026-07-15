

export const TAM_CASILLA = 72;

export const ALTURA_BARRA = 44;

export const ANCHO_TABLERO = TAM_CASILLA * 8;

export const ALTO_TABLERO = ALTURA_BARRA + TAM_CASILLA * 8 + 40;

export const POSICION_INICIAL = [
    ['T', 'C', 'A', 'D', 'R', 'A', 'C', 'T'],  
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],  
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],  
    ['t', 'c', 'a', 'd', 'r', 'a', 'c', 't'],  
];

export const SIMBOLOS_PIEZAS = {
    
    R: '♔',  
    D: '♕',  
    T: '♖',  
    A: '♗',  
    C: '♘',  
    P: '♙',  
    
    r: '♚',  
    d: '♛',  
    t: '♜',  
    a: '♝',  
    c: '♞',  
    p: '♟',  
};

export const COLORES_PIEZAS = {
    dioses: {
        relleno: '#FFD700',
        borde: '#8B6914',
        sombra: '#5C4A0E',
        brillo: '#FFFACD',
    },
    titanes: {
        relleno: '#4A4A4A',
        borde: '#1A1A1A',
        sombra: '#000000',
        brillo: '#888888',
    },
};

export const VALOR_PIEZAS = {
    p: 100,   
    c: 320,   
    a: 330,   
    t: 500,   
    d: 900,   
    r: 20000, 
};

export const VALOR_POSICION = [
    [0, 0, 0, 0, 0, 0, 0, 0],      
    [50, 50, 50, 50, 50, 50, 50, 50], 
    [10, 10, 20, 30, 30, 20, 10, 10], 
    [5, 5, 10, 25, 25, 10, 5, 5],    
    [0, 0, 0, 20, 20, 0, 0, 0],      
    [5, -5, -10, 0, 0, -10, -5, 5],  
    [5, 10, 10, -20, -20, 10, 10, 5], 
    [0, 0, 0, 0, 0, 0, 0, 0],       
];

export const TEMAS_TABLERO = {
    olimpo: {
        clara: 0xF5DEB3,      
        oscura: 0x8B4513,     
        fondo: '#1a1a2e',     
        nombre: 'Olimpo',     
    },
    inframundo: {
        clara: 0x5A5A5A,      
        oscura: 0x2A0A0A,     
        fondo: '#1a0a0a',
        nombre: 'Inframundo',
    },
    monte_olimpo: {
        clara: 0xA8D5A2,      
        oscura: 0x3B6B3B,     
        fondo: '#0a1a0a',
        nombre: 'Monte Olimpo',
    },
};

export const IMAGENES_FONDO_LADO = {
    dioses: '/assets/sprites/fondos/dioses.svg',
    titanes: '/assets/sprites/fondos/titanes.svg',
};

export const RUTAS_SPRITES = {
    
    R: 'sprites/piezas/rey_blanco.png',
    D: 'sprites/piezas/reina_blanca.png',
    T: 'sprites/piezas/torre_blanca.png',
    A: 'sprites/piezas/alfil_blanco.png',
    C: 'sprites/piezas/caballo_blanco.png',
    P: 'sprites/piezas/peon_blanco.png',
    
    r: 'sprites/piezas/rey_negro.png',
    d: 'sprites/piezas/reina_negra.png',
    t: 'sprites/piezas/torre_negra.png',
    a: 'sprites/piezas/alfil_negro.png',
    c: 'sprites/piezas/caballo_negro.png',
    p: 'sprites/piezas/peon_negro.png',
};

export const RUTAS_TILEMAPS = {
    olimpo: 'mapas/olimpo.json',
    inframundo: 'mapas/inframundo.json',
    monte_olimpo: 'mapas/monte_olimpo.json',
};

export const DIFICULTADES = {
    humano: {
        nombre: '2 Jugadores',
        descripcion: 'Sin IA, dos jugadores humanos',
        profundidad: 0,
        icono: '⚔',
    },
    campeon: {
        nombre: 'Campeón',
        descripcion: 'IA nivel intermedio',
        profundidad: 2,
        icono: '🏛',
    },
    olympus: {
        nombre: 'Olympus',
        descripcion: 'IA nivel experto',
        profundidad: 3,
        icono: '⚡',
    },
};

export const MODOS_JUEGO = {
    partida: {
        nombre: 'Partida',
        descripcion: 'Jugar contra la IA',
        icono: '⚔',
    },
    online: {
        nombre: 'Online',
        descripcion: 'Jugar contra otro jugador',
        icono: '🌐',
    },
    puzzle: {
        nombre: 'Puzzles',
        descripcion: 'Resolver problemas tácticos',
        icono: '🧩',
    },
};

export const NIVELES_PUZZLES = [
    {
        nombre: 'Mate en 1 — Torre',
        turno: true,
        descripcion: 'La torre puede dar jaque mate al rey enemigo en una sola jugada.',
        guia: 'Las torres se mueven en línea recta horizontal o vertical. El rey negro esta atrapado en la columna f sin casillas de escape. Usa la torre para cortar su fila y dar mate.',
        pistas: [
            'El rey negro esta en f6, sin escapatoria arriba ni abajo.',
            'La torre blanca en a8 puede bajar a la columna f.',
            'Mueve la torre de a1 a f1 para dar jaque mate.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            ['T', null, null, null, 'R', null, null, 'T'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, 'r', null, null],
            ['t', null, null, 'D', null, null, null, 't'],
        ],
    },
    {
        nombre: 'Mate en 1 — Reina',
        turno: true,
        descripcion: 'La reina puede cortar la diagonal y dar mate.',
        guia: 'La reina combina el movimiento de torre y alfil. Controla filas, columnas y diagonales. Busca la casilla desde la cual la reina ataque al rey sin escapatoria.',
        pistas: [
            'El rey negro esta en h8, bloqueado por sus propios peones.',
            'La reina blanca esta en d4, controlando la diagonal.',
            'La diagonal d4-h8 lleva directo al rey.',
            'Mueve la reina de d4 a h8 para dar mate.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, null, null, null, 'r'],
            [null, null, null, null, null, null, 'p', 'p'],
            [null, null, null, null, null, null, null, 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, 'D', null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, 'R'],
        ],
    },
    {
        nombre: 'Mate en 1 — Caballo',
        turno: true,
        descripcion: 'El caballo puede dar mate saltando por encima de las piezas.',
        guia: 'El caballo se mueve en forma de L: 2 casillas en una direccion y 1 en perpendicular. Es la unica pieza que puede saltar sobre otras, lo que lo hace ideal para ataques sorpresa.',
        pistas: [
            'El rey negro esta en g8, bloqueado por sus propias torres.',
            'El caballo blanco esta en h5.',
            'El caballo puede saltar a f6 con jaque mate.',
            'Mueve el caballo de h5 a f6.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, null, null, 't', 'r'],
            [null, null, null, null, null, null, 't', 't'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, 'R', null],
        ],
    },
    {
        nombre: 'Mate en 2 — Combo',
        turno: true,
        descripcion: 'Reina y caballo combinan para el mate en dos jugadas.',
        guia: 'Las combinaciones de piezas son devastadoras. La reina controla filas, columnas y diagonales, mientras el caballo amenaza casillas que otras piezas no alcanzan. Juntos pueden crear jaques imposibles de defender.',
        pistas: [
            'Primero: busca un jaque con la reina que obligue al rey a moverse.',
            'El rey negro esta en h8, con peones en g7 y h7.',
            'La reina puede ir a h7 con jaque.',
            'Luego el caballo da el mate final.',
        ],
        jugadasEsperadas: 2,
        tablero: [
            [null, null, null, null, null, null, null, 'R'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, 'D', null, null, null, null, null],
            ['P', 'P', null, null, null, null, 'p', 'r'],
            [null, null, null, null, null, null, 'p', null],
        ],
    },
    {
        nombre: 'Mate en 2 — Alfil',
        turno: true,
        descripcion: 'Alfil y reina cazan al rey en dos jugadas.',
        guia: 'El alfil se mueve en diagonal y controla todas las casillas de un mismo color. Cuando se combina con la reina, pueden crear patrones de ataque que cubren multiples direcciones a la vez.',
        pistas: [
            'El alfil blanco esta en e3, controlando la diagonal.',
            'La reina blanca esta en d1, lista para atacar.',
            'El rey negro esta en h8, atrapado.',
            'Usa el alfil para abrir camino y la reina para dar mate.',
        ],
        jugadasEsperadas: 2,
        tablero: [
            [null, null, null, null, null, null, null, 'r'],
            [null, null, null, null, null, null, null, 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, 'A', null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, 'D', null, null, null, 'R'],
        ],
    },
    {
        nombre: 'Mate en 2 — Torre',
        turno: true,
        descripcion: 'Doble torre: mate en dos jugadas.',
        guia: 'Las torres son devastadoras en parejas. Mientras una controla una fila, la otra puede atacar otra direccion. Coordinar torres es una habilidad fundamental del ajedrez.',
        pistas: [
            'El rey negro esta en h8, con peones que lo bloquean.',
            'Una torre puede subir a la octava fila.',
            'La segunda torre refuerza el ataque.',
            'Coordina ambas torres para el mate.',
        ],
        jugadasEsperadas: 2,
        tablero: [
            [null, null, null, null, null, null, null, 'r'],
            [null, null, null, null, null, null, null, 'p'],
            [null, null, null, null, null, null, null, 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['T', null, null, null, null, null, null, null],
            [null, null, 'T', null, null, null, null, 'R'],
        ],
    },
    {
        nombre: 'Gana la Reina',
        turno: true,
        descripcion: 'Caballo al frente: gana la dama enemiga.',
        guia: 'Un caballo bien colocado puede amenazar multiples piezas a la vez. Este tipo de tactic se llama doble ataque o clavada. Identifica que piezas estan en riesgo.',
        pistas: [
            'El caballo blanco esta en c3.',
            'La dama negra esta en h1.',
            'El caballo puede saltar a una casilla que ataque la dama.',
            'Busca una jugada que ataque dos piezas a la vez.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, 'R', null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, 'C', null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, 'r', null, null, 'd'],
        ],
    },
    {
        nombre: 'Clavada — Alfil',
        turno: true,
        descripcion: 'Caballo clavado: capturalo gratis con el alfil.',
        guia: 'Una clavada ocurre cuando una pieza no puede moverse sin exponer una pieza de mayor valor detras de ella. El alfil es excelente para crear clavadas en diagonales.',
        pistas: [
            'El caballo negro esta en d2, protegido por el rey.',
            'El alfil blanco esta en c1.',
            'El alfil puede atacar el caballo en la diagonal.',
            'El caballo no puede escapar sin exponer al rey.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, 'c', null, null, null, null],
            [null, null, 'T', null, null, 'r', null, null],
        ],
    },
    {
        nombre: 'Clavada — Torre',
        turno: true,
        descripcion: 'Torre al fondo: gana pieza por clavada.',
        guia: 'Las torres en la septima u octava fila son extremadamente peligrosas. Pueden clavar piezas contra el rey y ganar material gratis.',
        pistas: [
            'El caballo negro esta en f1, con el rey detras en g1.',
            'La torre blanca esta en a1.',
            'La torre puede ir a f1 para clavar al caballo.',
            'El caballo no puede moverse sin exponer al rey.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['T', null, null, null, null, 't', 'r', null],
        ],
    },
    {
        nombre: 'Ataque Descubierto',
        turno: true,
        descripcion: 'Mueve el caballo y descubre el alfil.',
        guia: 'Un ataque descubierto ocurre cuando mueves una pieza y descubres el ataque de otra pieza detras de ella. Es una de las tacticas mas poderosas del ajedrez.',
        pistas: [
            'El caballo blanco esta en d3, bloqueando el alfil en e2.',
            'El alfil blanco esta en e2, apuntando al rey negro en f1.',
            'Mueve el caballo a una casilla que no bloquee el alfil.',
            'El alfil quedara descubierto atacando al rey.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, 'C', null, null, null, null],
            [null, null, null, null, 'A', null, null, null],
            [null, null, null, null, null, 'r', null, null],
        ],
    },
    {
        nombre: 'Ahogado — Empate',
        turno: true,
        descripcion: 'Fuerza tablas con una jugada maestra.',
        guia: 'El ahogado ocurre cuando el rey no esta en jaque pero no tiene movimientos legales. Es una forma de empate que puede salvar una partida perdedora.',
        pistas: [
            'El rey negro esta en a8, con peones bloqueandolo.',
            'Tu rey esta en a3, muy cerca del rey enemigo.',
            'Mueve tu rey a una casilla que deje al rey sin movimientos.',
            'El rey negro quedara ahogado.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            ['r', null, null, null, null, null, null, null],
            ['p', null, null, null, null, null, null, null],
            ['R', null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ],
    },
    {
        nombre: 'Doble Ataque',
        turno: true,
        descripcion: 'Caballo ataca rey y torre a la vez.',
        guia: 'El caballo es la unica pieza que puede atacar dos piezas enemigas simultaneamente sin que estas lo amenacen. Aprovecha esto para ganar material.',
        pistas: [
            'El caballo blanco esta en c2.',
            'El rey negro esta en e1 y la torre en g1.',
            'El caballo puede saltar a una casilla que ataque ambos.',
            'Busca la casilla perfecta para el doble ataque.',
        ],
        jugadasEsperadas: 1,
        tablero: [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, 'C', null, null, null, null, null],
            [null, null, null, null, 'r', null, 't', null],
        ],
    },
];
