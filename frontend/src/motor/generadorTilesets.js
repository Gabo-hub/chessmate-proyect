

import { TEMAS_TABLERO } from '../constantes';

export function generarTileset(escena, tema) {
    const colores = TEMAS_TABLERO[tema];
    if (!colores) return;

    const TAM = 64;
    const COLS = 4;
    const TOTAL = 12;
    const FILAS = Math.ceil(TOTAL / COLS);
    const ancho = COLS * TAM;
    const alto = FILAS * TAM;

    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext('2d');

    
    ctx.fillStyle = '#' + colores.clara.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, TAM, TAM);

    
    ctx.fillStyle = '#' + colores.oscura.toString(16).padStart(6, '0');
    ctx.fillRect(TAM, 0, TAM, TAM);

    
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(TAM * 2, 0, TAM, TAM);
    ctx.fillStyle = 'rgba(255,215,0,0.3)';
    ctx.fillRect(TAM * 2, 0, TAM, TAM);

    
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(TAM * 3, 0, TAM, TAM);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(TAM * 3, 0, TAM, TAM);

    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, TAM, TAM, TAM);
    ctx.fillStyle = 'rgba(0,100,0,0.4)';
    ctx.fillRect(0, TAM, TAM, 4);

    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(TAM, TAM, TAM, TAM);
    ctx.fillStyle = 'rgba(0,100,0,0.4)';
    ctx.fillRect(TAM, TAM, 4, TAM);

    
    ctx.fillStyle = '#006400';
    ctx.fillRect(TAM * 2, TAM, TAM, TAM);

    
    ctx.fillStyle = '#006400';
    ctx.fillRect(TAM * 3, TAM, TAM, TAM);

    
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(0, TAM * 2, TAM, TAM);
    ctx.fillStyle = 'rgba(65,105,225,0.5)';
    ctx.fillRect(0, TAM * 2, TAM, TAM);
    ctx.strokeStyle = '#87CEEB';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, TAM * 2 + 2, TAM - 4, TAM - 4);

    
    ctx.fillStyle = 'rgba(50,205,50,0.4)';
    ctx.fillRect(TAM, TAM * 2, TAM, TAM);
    ctx.beginPath();
    ctx.arc(TAM + TAM / 2, TAM * 2 + TAM / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(50,205,50,0.7)';
    ctx.fill();

    
    ctx.fillStyle = 'rgba(255,0,0,0.4)';
    ctx.fillRect(TAM * 2, TAM * 2, TAM, TAM);
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4;
    ctx.strokeRect(3, TAM * 2 + 3, TAM - 6, TAM - 6);

    
    ctx.fillStyle = 'rgba(139,0,0,0.5)';
    ctx.fillRect(TAM * 3, TAM * 2, TAM, TAM);
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    ctx.strokeRect(3, TAM * 2 + 3, TAM - 6, TAM - 6);

    
    const nombreTextura = `tileset_${tema}`;
    escena.textures.addCanvas(nombreTextura, canvas);
}

export function generarTodosTilesets(escena) {
    for (const tema of Object.keys(TEMAS_TABLERO)) {
        generarTileset(escena, tema);
    }
}