

import { TAM_CASILLA, ALTURA_BARRA } from '../constantes';

export function capturarPieza(escena, x, y, color = 0xFF4444, cantidad = 12) {
    const textura = escena.textures.exists('particula_confeti')
        ? 'particula_confeti'
        : '__DEFAULT';

    for (let i = 0; i < cantidad; i++) {
        const angulo = (i / cantidad) * Math.PI * 2;
        const distancia = Phaser.Math.Between(30, 60);
        const destinoX = x + Math.cos(angulo) * distancia;
        const destinoY = y + Math.sin(angulo) * distancia;

        const particula = escena.add.circle(x, y, Phaser.Math.Between(2, 5), color, 1);
        particula.setDepth(200);

        escena.tweens.add({
            targets: particula,
            x: destinoX,
            y: destinoY,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: Phaser.Math.Between(300, 600),
            ease: 'Cubic.easeOut',
            onComplete: () => particula.destroy(),
        });
    }
}

export function efectoJaque(escena, x, y) {
    const anillo = escena.add.circle(x, y, 10, 0xFF0000, 0);
    anillo.setDepth(190);
    anillo.setStrokeStyle(3, 0xFF0000, 0.8);

    escena.tweens.add({
        targets: anillo,
        radius: 40,
        alpha: 0,
        strokeAlpha: 0,
        duration: 800,
        ease: 'Cubic.easeOut',
        onComplete: () => anillo.destroy(),
    });
}

export function efectoJaqueMate(escena, centerX, centerY, cantidad = 40) {
    const centroX = centerX || 8 * TAM_CASILLA / 2;
    const centroY = centerY || ALTURA_BARRA + 8 * TAM_CASILLA / 2;
    const colores = [0xFFD700, 0xFF4444, 0x44FF44, 0x4444FF, 0xFF44FF, 0xFFFF44];

    
    const flash = escena.add.circle(centroX, centroY, 5, 0xFFD700, 0.8);
    flash.setDepth(250);
    escena.tweens.add({
        targets: flash,
        radius: 100,
        alpha: 0,
        duration: 500,
        ease: 'Cubic.easeOut',
        onComplete: () => flash.destroy(),
    });

    
    for (let i = 0; i < cantidad; i++) {
        const color = Phaser.Utils.Array.GetRandom(colores);
        const tam = Phaser.Math.Between(3, 8);
        const x = centroX + Phaser.Math.Between(-20, 20);
        const y = centroY + Phaser.Math.Between(-20, 20);

        const particula = escena.add.circle(x, y, tam, color, 1);
        particula.setDepth(240);

        const destinoX = x + Phaser.Math.Between(-200, 200);
        const destinoY = y + Phaser.Math.Between(100, 350);

        escena.tweens.add({
            targets: particula,
            x: destinoX,
            y: destinoY,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0,
            duration: Phaser.Math.Between(1000, 2500),
            delay: Phaser.Math.Between(0, 400),
            ease: 'Cubic.easeOut',
            onComplete: () => particula.destroy(),
        });
    }
}

export function efectoSeleccion(escena, x, y) {
    const anillo = escena.add.circle(x, y, 30, 0x00FF00, 0);
    anillo.setDepth(180);
    anillo.setStrokeStyle(2, 0x00FF00, 0.6);

    escena.tweens.add({
        targets: anillo,
        radius: 38,
        alpha: 0.3,
        duration: 200,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => anillo.destroy(),
    });
}

export function efectoVictoria(escena, cantidad = 50) {
    const colores = [0xFFD700, 0xFF4444, 0x44FF44, 0x4444FF, 0xFF44FF];
    const anchoCanvas = 8 * TAM_CASILLA;

    for (let i = 0; i < cantidad; i++) {
        const color = Phaser.Utils.Array.GetRandom(colores);
        const x = Phaser.Math.Between(20, anchoCanvas - 20);
        const tam = Phaser.Math.Between(3, 7);

        const particula = escena.add.circle(x, -10, tam, color, 1);
        particula.setDepth(240);

        escena.tweens.add({
            targets: particula,
            y: Phaser.Math.Between(400, 700),
            x: x + Phaser.Math.Between(-80, 80),
            alpha: 0,
            duration: Phaser.Math.Between(2000, 4000),
            delay: Phaser.Math.Between(0, 1500),
            ease: 'Sine.easeIn',
            onComplete: () => particula.destroy(),
        });
    }
}

export function efectoMovimiento(escena, xOrigen, yOrigen, xDestino, yDestino, color = 0xFFD700) {
    const pasos = 6;

    for (let i = 0; i <= pasos; i++) {
        const t = i / pasos;
        const x = xOrigen + (xDestino - xOrigen) * t;
        const y = yOrigen + (yDestino - yOrigen) * t;

        const punto = escena.add.circle(x, y, 3, color, 0.6);
        punto.setDepth(170);

        escena.tweens.add({
            targets: punto,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 400,
            delay: i * 50,
            ease: 'Cubic.easeOut',
            onComplete: () => punto.destroy(),
        });
    }
}

export function efectoError(escena, x, y) {
    const flash = escena.add.circle(x, y, 30, 0xFF0000, 0.4);
    flash.setDepth(190);

    escena.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 400,
        yoyo: true,
        repeat: 1,
        onComplete: () => flash.destroy(),
    });
}

export default {
    capturarPieza,
    efectoJaque,
    efectoJaqueMate,
    efectoSeleccion,
    efectoVictoria,
    efectoMovimiento,
    efectoError,
};
