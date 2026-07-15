

export function generarIndicadorMovimiento(escena, nombre = 'indicador_mov', radio = 10, color = 0x90EE90) {
    if (escena.textures.exists(nombre)) return;

    const tam = radio * 2 + 4;
    const canvas = document.createElement('canvas');
    canvas.width = tam;
    canvas.height = tam;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = tam / 2;
    const cy = tam / 2;

    
    ctx.beginPath();
    ctx.arc(cx + 1, cy + 1, radio, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();

    
    ctx.beginPath();
    ctx.arc(cx, cy, radio, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, radio);
    grad.addColorStop(0, '#AAFFAA');
    grad.addColorStop(1, `#${color.toString(16).padStart(6, '0')}`);
    ctx.fillStyle = grad;
    ctx.fill();

    escena.textures.addCanvas(nombre, canvas);
}

export function generarIndicadorCaptura(escena, nombre = 'indicador_captura', radio = 28, color = 0xFF4444) {
    if (escena.textures.exists(nombre)) return;

    const tam = radio * 2 + 4;
    const canvas = document.createElement('canvas');
    canvas.width = tam;
    canvas.height = tam;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = tam / 2;
    const cy = tam / 2;

    
    ctx.beginPath();
    ctx.arc(cx, cy, radio, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.stroke();

    
    ctx.beginPath();
    ctx.arc(cx, cy, radio - 3, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,68,68,0.3)';
    ctx.stroke();

    escena.textures.addCanvas(nombre, canvas);
}

export function generarSpritesUI(escena) {
    
    if (!escena.textures.exists('particula_confeti')) {
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(0, 0, 8, 8);
        }
        escena.textures.addCanvas('particula_confeti', canvas);
    }

    
    if (!escena.textures.exists('particula_estrella')) {
        const canvas = document.createElement('canvas');
        canvas.width = 12;
        canvas.height = 12;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const centroX = 6;
            const centroY = 6;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angulo = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                const metodo = i === 0 ? 'moveTo' : 'lineTo';
                ctx[metodo](centroX + Math.cos(angulo) * 5, centroY + Math.sin(angulo) * 5);
            }
            ctx.closePath();
            ctx.fillStyle = '#FFD700';
            ctx.fill();
        }
        escena.textures.addCanvas('particula_estrella', canvas);
    }
}
