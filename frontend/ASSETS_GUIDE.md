# Guía de Assets — Ajedrez Griego MVP 1.0.0

Guía completa para agregar sprites, mapas de Tiled Editor, efectos de audio y configurar el juego.

---

## Estructura de Carpetas

```
frontend/public/assets/
├── sprites/
│   ├── piezas/              ← Sprites de piezas de ajedrez (12 archivos)
│   ├── fondos/              ← Fondos de tablero y pantalla
│   └── ui/                  ← Elementos de interfaz
├── audio/
│   ├── musica/              ← Musica de fondo (loop)
│   ├── movimientos/         ← Efectos de movimiento de piezas
│   └── efectos/             ← Efectos de juego (jaque, mate, etc.)
└── mapas/                   ← Tilemaps de Tiled Editor (JSON)
```

---

## 1. SPRITES DE PIEZAS

### Requisitos

| Propiedad       | Valor                                          |
|-----------------|------------------------------------------------|
| Formato         | PNG con transparencia                          |
| Tamaño          | 64x64 px (recomendado) o 48x48 px              |
| Estilo          | Iconos de ajedrez stylizados, vista frontal    |
| Fondo           | Transparente (alpha channel)                   |

### Colores por Tema

| Equipo | Color Principal | Borde     | Sombra    | Brillo    |
|--------|----------------|-----------|-----------|-----------|
| Dioses (blancas) | Dorado #FFD700 | Marron #8B6914 | #5C4A0E | #FFFACD |
| Titanes (negras) | Gris #4A4A4A | Negro #1A1A1A | #000000 | #888888 |

### Archivos Requeridos

Colocar en `frontend/public/assets/sprites/piezas/`:

**Dioses (blancas):**
```
rey_blanco.png       ← Rey (Zeus)
reina_blanca.png     ← Reina (Hera)
torre_blanca.png     ← Torre (Pegaso)
alfil_blanco.png     ← Alfil (Oraculo)
caballo_blanco.png   ← Caballo (Centauro)
peon_blanco.png      ← Peon (Hoplita)
```

**Titanes (negras):**
```
rey_negro.png        ← Rey (Hades)
reina_negra.png      ← Reina (Atenea)
torre_negra.png      ← Torre (Minotauro)
alfil_negro.png      ← Alfil (Hermes)
caballo_negro.png    ← Caballo (Quimera)
peon_negro.png       ← Peon (Esqueleto)
```

### Cómo Crear Sprites con Tiled Editor

1. Abrir Tiled Editor
2. File > New Map:
   - Orientation: Orthogonal
   - Tile size: 64 x 64
   - Map size: 1 x 1 (una casilla por sprite)
3. New Tileset:
   - Name: nombre de la pieza
   - Tile size: 64 x 64
   - Importar imagen PNG del sprite
4. Dibujar el sprite en la única casilla
5. File > Export As > PNG (asegurar transparencia)

### Cómo Crear Sprites con GIMP/Photoshop

1. Crear lienzo 64x64 px con fondo transparente
2. Dibujar la pieza de ajedrez (silueta + detalles)
3. Aplicar gradiente radial: brillo arriba-izquierda, sombra abajo-derecha
4. Agregar borde de 2px en color oscuro
5. Exportar como PNG con transparencia

### Cómo Crear Sprites con Programas Gratis

Herramientas recomendadas:
- **Piskel** (piskelapp.com) — Editor de pixel art gratis online
- **Aseprite** — Editor de sprites (de pago, pero tiene free build)
- **LibreSprite** — Fork gratis de Aseprite

Pasos en Piskel:
1. Crear nuevo sprite 64x64
2. Dibujar pieza de ajedrez pixel a pixel
3. Usar paleta de colores del tema (dorado o gris)
4. Exportar como PNG

---

## 2. FONDOS DE TABLERO

### Requisitos

| Propiedad | Valor                     |
|-----------|---------------------------|
| Formato   | PNG o JPG                 |
| Tamaño    | 512x512 px (8x8 casillas) |
| Estilo    | Tablero con textura temática |

### Temas Disponibles

| Tema | Color Claro | Color Oscuro | Estilo |
|------|-------------|--------------|--------|
| Olimpo | Beige #F5DEB3 | Marron #8B4513 | Templo griego, mármol |
| Inframundo | Gris #5A5A5A | Rojo oscuro #2A0A0A | Rocas, lava |
| Monte Olimpo | Verde #A8D5A2 | Verde oscuro #3B6B3B | Naturaleza, bosque |

### Cómo Crear Fondos con Tiled Editor

1. File > New Map:
   - Orientation: Orthogonal
   - Tile size: 64 x 64
   - Map size: 8 x 8
2. New Tileset:
   - Importar imagen de textura (mármol, roca, hojas, etc.)
   - Tile size: 64 x 64
3. Crear capa "Tablero":
   - Pintar casillas alternando tile claro/oscuro en patrón de ajedrez
4. Crear capa "Decoración" (opcional):
   - Agregar detalles: grietas, musgo, relieves, etc.
5. File > Export As > JSON
6. Guardar en `frontend/public/assets/mapas/`

### Patrón de Tablero (casillas)

```
Claro  Oscuro  Claro  Oscuro  Claro  Oscuro  Claro  Oscuro
Oscuro Claro   Oscuro Claro   Oscuro Claro   Oscuro Claro
Claro  Oscuro  Claro  Oscuro  Claro  Oscuro  Claro  Oscuro
Oscuro Claro   Oscuro Claro   Oscuro Claro   Oscuro Claro
Claro  Oscuro  Claro  Oscuro  Claro  Oscuro  Claro  Oscuro
Oscuro Claro   Oscuro Claro   Oscuro Claro   Oscuro Claro
Claro  Oscuro  Claro  Oscuro  Claro  Oscuro  Claro  Oscuro
Oscuro Claro   Oscuro Claro   Oscuro Claro   Oscuro Claro
```

### Estructura JSON del Tilemap (Tiled Export)

```json
{
  "width": 8,
  "height": 8,
  "tilewidth": 64,
  "tileheight": 64,
  "layers": [
    {
      "name": "Tablero",
      "type": "tilelayer",
      "data": [1,2,1,2,1,2,1,2, 2,1,2,1,2,1,2,1, ...]
    }
  ],
  "tilesets": [
    {
      "name": "MiTileset",
      "firstgid": 1,
      "tilewidth": 64,
      "tileheight": 64,
      "image": "textura.png",
      "imagewidth": 128,
      "imageheight": 64,
      "tilecount": 2,
      "columns": 2
    }
  ]
}
```

---

## 3. EFECTOS DE SONIDO

### Requisitos

| Propiedad | Valor             |
|-----------|-------------------|
| Formato   | MP3 (máxima compatibilidad) |
| Calidad   | 128 kbps o superior |
| Canales   | Mono o Stereo      |

### Efectos de Movimiento

Colocar en `frontend/public/assets/audio/movimientos/`:

| Archivo | Duración | Descripción | Cómo Obtenerlo |
|---------|----------|-------------|----------------|
| `movimiento.mp3` | 0.2-0.5s | Click suave de pieza al tablero | Grabar click de teclado, filtrar |
| `captura.mp3` | 0.3-0.8s | Impacto fuerte de captura | Sonido de golpe suave + eco |
| `enroque.mp3` | 0.5-1.0s | Movimiento doble (rey + torre) | Dos clicks rápidos |
| `promocion.mp3` | 0.5-1.0s | Transformación de peón | Sonido mágico ascendente |

### Efectos de Juego

Colocar en `frontend/public/assets/audio/efectos/`:

| Archivo | Duración | Descripción | Cómo Obtenerlo |
|---------|----------|-------------|----------------|
| `jaque.mp3` | 0.5-1.0s | Alerta dramática | Timbal + eco |
| `jaque_mate.mp3` | 2-4s | Fanfarria épica | Trompetas + percusión |
| `tablas.mp3` | 1-2s | Sonido neutro/derrota | Campana suave |
| `seleccion.mp3` | 0.1-0.3s | Click de selección | Click corto |
| `error.mp3` | 0.3-0.5s | Error buzzer | Buzzer corto |
| `boton.mp3` | 0.1-0.2s | Click de botón | Click muy corto |
| `puzzle_completado.mp3` | 1-2s | Puzzle resuelto | Triunfo breve |

### Música de Fondo

Colocar en `frontend/public/assets/audio/musica/`:

| Archivo | Duración | Descripción | Estilo |
|---------|----------|-------------|--------|
| `menu.mp3` | Loop | Música del menú principal | Orchestral épico, heroico |
| `partida.mp3` | Loop | Música durante la partida | Tensa, estratégica, percusiva |
| `puzzle.mp3` | Loop | Música de puzzles | Contemplativa, calmada |

### Cómo Obtener Audio Gratis

Fuentes de audio libre:
- **Freesound.org** — Buscar por keyword (chess, click, impact, etc.)
- **Zapsplat.com** — Efectos de sonido gratis (requiere registro)
- **Pixabay Music** — Música de fondo gratis
- **Incompetech.com** — Música royalty-free

### Cómo Crear Audio con Audacity

1. Descargar Audacity (audacityteam.org)
2. Para efectos cortos:
   - Generar tono (Generate > Tone)
   - Aplicar envolvente (Envelope Tool)
   - Exportar como MP3 128kbps
3. Para música:
   - Usar samples o grabar instruments
   - Mezclar capas
   - Normalizar (Effects > Normalize)
   - Exportar como MP3 128kbps

---

## 4. MAPAS DE TILED EDITOR (Paso a Paso)

### Instalar Tiled Editor

1. Ir a https://www.mapeditor.org/
2. Descargar la versión para tu SO
3. Instalar y abrir

### Paso 1: Crear el Tileset del Tablero

1. File > New Tileset
2. Configurar:
   - Name: `tablero_olimpo` (o el tema que quieras)
   - Tile size: **64 x 64**
   - Source: Seleccionar imagen de textura
3. La imagen debe tener al menos 2 tiles (claro + oscuro)
4. Guardar como `.tsx` (Tileset de Tiled)

### Paso 2: Crear el Mapa

1. File > New Map
2. Configurar:
   - Orientation: **Orthogonal**
   - Tile size: **64 x 64**
   - Map size: **8 x 8**
3. Se abre el editor con cuadrícula 8x8

### Paso 3: Agregar el Tileset al Mapa

1. Panel derecho > Tilesets > Click derecho > Add Tileset
2. Seleccionar el `.tsx` creado en Paso 1
3. Aparecen los tiles disponibles en el panel

### Paso 4: Pintar el Tablero

1. Seleccionar capa "Tablero" (o crear una)
2. En el panel de tiles, seleccionar tile claro
3. Pintar casillas en patrón de ajedrez:
   - Fila 0: claro, oscuro, claro, oscuro, ...
   - Fila 1: oscuro, claro, oscuro, claro, ...
4. Alternar hasta completar 8x8

### Paso 5: Agregar Decoración (Opcional)

1. Crear nueva capa: Layers > Add > Tile Layer
2. Nombre: "Decoracion"
3. Pintar detalles encima del tablero:
   - Grietas en el mármol (Olimpo)
   - Gotas de lava (Inframundo)
   - Hojas y musgo (Monte Olimpo)
4. Ajustar opacidad de la capa si es necesario

### Paso 6: Exportar como JSON

1. File > Export As
2. Formato: **JSON**
3. Guardar en `frontend/public/assets/mapas/`
4. Nombre: `olimpo.json`, `inframundo.json`, o `monte_olimpo.json`

### Estructura del JSON Exportado

```json
{
  "compressionlevel": -1,
  "height": 8,
  "width": 8,
  "infinite": false,
  "layers": [
    {
      "id": 1,
      "name": "Tablero",
      "type": "tilelayer",
      "width": 8,
      "height": 8,
      "data": [
        1, 2, 1, 2, 1, 2, 1, 2,
        2, 1, 2, 1, 2, 1, 2, 1,
        ...
      ]
    }
  ],
  "tilesets": [
    {
      "firstgid": 1,
      "name": "MiTileset",
      "tilewidth": 64,
      "tileheight": 64,
      "tilecount": 2,
      "columns": 2,
      "image": "textura.png",
      "imagewidth": 128,
      "imageheight": 64
    }
  ],
  "tiledversion": "1.10",
  "orientation": "orthogonal",
  "renderorder": "right-down",
  "type": "map"
}
```

**IMPORTANTE:** El array `data` usa IDs de tiles empezando desde 1 (no 0):
- `1` = tile claro (primera imagen del tileset)
- `2` = tile oscuro (segunda imagen del tileset)

---

## 5. INTEGRACIÓN DE TILEMAPS CON PHASER

### Cómo Cargar un Tilemap en el Juego

1. Colocar el JSON exportado de Tiled en `public/assets/mapas/`
2. En `EscenaAjedrez.js`, cargar en `preload()`:
   ```javascript
   this.load.tilemapTiledJSON('tablero_olimpo', 'assets/mapas/olimpo.json');
   ```
3. En `create()`, crear el tilemap:
   ```javascript
   const mapa = this.make.tilemap({ key: 'tablero_olimpo' });
   const tileset = mapa.addTilesetImage('Olimpo');
   const capaTablero = mapa.createLayer('Tablero', tileset);
   ```

### Capas del Tilemap

Cada tilemap puede tener múltiples capas:

| Capa | Tipo | Uso |
|------|------|-----|
| Tablero | tilelayer | Casillas del tablero (claro/oscuro) |
| Decoración | tilelayer | Detalles visuales (grietas, hojas) |
| Piezas | objectlayer | Posiciones iniciales de piezas (opcional) |

### Propiedades de Tiles Personalizadas

En Tiled, puedes agregar propiedades a cada tile:
1. Seleccionar un tile en el tileset
2. Panel derecho > Properties
3. Agregar propiedades:
   - `tipo`: "claro" o "oscuro"
   - `efecto`: "lava", "agua", "brillo" (para efectos visuales)

---

## 6. SISTEMA DE FALLBACK

El juego funciona SIN assets reales. El sistema genera automáticamente:

| Elemento | Placeholder Generado |
|----------|---------------------|
| Piezas | Círculo con gradiente dorado/gris + inicial Unicode |
| Indicadores movimiento | Punto verde con gradiente |
| Indicadores captura | Anillo rojo |
| UI | Partículas de confeti y estrellas |
| Audio | Silencioso (no genera error) |

Para reemplazar un placeholder, simplemente colocar la imagen en la ruta correcta.

---

## 7. SISTEMA DE AUDIO INTEGRADO

El juego ya tiene integrado un gestor de audio completo en `src/motor/gestorAudio.js`.

### Archivos de Audio Requeridos

Colocar los siguientes archivos MP3 en `public/assets/audio/`:

**Música (loop):**
```
musica/menu.mp3        ← Música del menú (épica, heroica)
musica/partida.mp3     ← Música de partida (tensa, estratégica)
musica/puzzle.mp3      ← Música de puzzles (contemplativa)
```

**Efectos de Movimiento:**
```
movimientos/movimiento.mp3   ← Click suave al mover pieza (0.2-0.5s)
movimientos/captura.mp3      ← Impacto fuerte al capturar (0.3-0.8s)
movimientos/enroque.mp3      ← Movimiento doble del enroque (0.5-1s)
movimientos/promocion.mp3    ← Transformación de peón (0.5-1s)
```

**Efectos de Juego:**
```
efectos/seleccion.mp3          ← Click al seleccionar pieza (0.1-0.3s)
efectos/boton.mp3              ← Click de botón (0.1-0.2s)
efectos/error.mp3              ← Error buzzer (0.3-0.5s)
efectos/jaque.mp3              ← Alerta de jaque (0.5-1s)
efectos/jaque_mate.mp3         ← Fanfarria de jaque mate (2-4s)
efectos/tablas.mp3             ← Sonido de tablas/empate (1-2s)
efectos/puzzle_completado.mp3  ← Puzzle resuelto (1-2s)
```

### Cómo Probar el Audio

1. Colocar un archivo MP3 (ej: `movimiento.mp3`) en la carpeta correspondiente
2. Recargar el navegador
3. Abrir consola (F12) y buscar: `Audio disponible (X/14)`
4. Hacer un movimiento en el tablero — se escuchará el efecto

---

## 8. EFECTOS VISUALES INTEGRADOS

El juego tiene efectos de partículas en `src/motor/gestorEfectos.js`.

### Efectos Automáticos

Los efectos se ejecutan solos cuando ocurren eventos de juego:

| Evento | Efecto | Descripción |
|--------|--------|-------------|
| Seleccionar pieza | `efectoSeleccion` | Anillo verde que pulsa |
| Mover pieza | `efectoMovimiento` | Estela de puntos dorados |
| Capturar pieza | `capturarPieza` | Explosión de partículas rojas |
| Jaque | `efectoJaque` | Anillo rojo expandiéndose |
| Jaque mate | `efectoJaqueMate` | Explosión dorada + confeti |
| Victoria | `efectoVictoria` | Lluvia de confeti multicolor |
| Error | `efectoError` | Parpadeo rojo |

---

## 9. CONTROLES DEL JUEGO

### Menú de Audio y Brillo

El juego incluye un menú de configuración accesible desde el menú principal:

| Control | Rango | Descripción |
|---------|-------|-------------|
| Volumen Música | 0-100% | Controla el volumen de la música de fondo |
| Volumen Efectos | 0-100% | Controla el volumen de los efectos de sonido |
| Brillo | 50-150% | Ajusta el brillo de la pantalla |

### Cómo Usar los Controles

1. Desde el menú principal, hacer clic en "Config"
2. Ajustar los sliders de volumen y brillo
3. Los cambios se aplican inmediatamente
4. La configuración se guarda en localStorage

---

## 10. CHECKLIST RÁPIDO

### Sprites (Opcional — el juego funciona sin ellos)
- [ ] 12 PNGs de piezas en `public/assets/sprites/piezas/`
- [ ] Fondos de tablero en `public/assets/sprites/fondos/`

### Audio (Recomendado — mejora la experiencia)
- [ ] `musica/menu.mp3` — Música del menú
- [ ] `musica/partida.mp3` — Música de partida
- [ ] `movimientos/movimiento.mp3` — Efecto de movimiento
- [ ] `movimientos/captura.mp3` — Efecto de captura
- [ ] `efectos/seleccion.mp3` — Click de selección
- [ ] `efectos/jaque.mp3` — Alerta de jaque
- [ ] `efectos/jaque_mate.mp3` — Fanfarria de jaque mate

### Mapas Tiled (Opcional — el juego usa colores por defecto)
- [ ] `mapas/olimpo.json` — Tilemap tema Olimpo
- [ ] `mapas/inframundo.json` — Tilemap tema Inframundo
- [ ] `mapas/monte_olimpo.json` — Tilemap tema Monte Olimpo

### Verificación
- [ ] Abrir consola del navegador (F12)
- [ ] Verificar que no hay errores rojos
- [ ] Verificar mensaje: `Audio disponible (X/14)`
- [ ] Probar seleccionar pieza, mover, capturar
- [ ] Probar jaque (mover rey a casilla amenazada)
- [ ] Probar menú de audio y brillo

---

## 11. GUÍA DE INTEGRACIÓN: ELIMINAR PLACEHOLDERS Y AGREGAR ASSETS REALES

Esta sección explica paso a paso qué **eliminar**, **comentar** o **modificar** para pasar del modo placeholder a assets reales.

### Antes de Empezar

**NO eliminar** estos archivos (son esenciales):
- `src/constantes.js` — Configuración del juego
- `src/utilidades.js` — Funciones helper
- `src/motor/gestorAudio.js` — Sistema de audio
- `src/motor/gestorEfectos.js` — Efectos visuales
- `src/escenas/EscenaAjedrez.js` — Escena principal

**SÍ eliminar** o **reemplazar**:
- `src/motor/generadorSprites.js` — Solo si usas sprites PNG reales

---

### PASO 1: Integrar Sprites de Piezas

#### Qué hacer:
1. Colocar los 12 PNGs en `public/assets/sprites/piezas/`
2. Modificar `EscenaAjedrez.js`:

#### En `preload()`, descomentar:
```javascript
const piezas = ['R', 'D', 'T', 'A', 'C', 'P', 'r', 'd', 't', 'a', 'c', 'p'];
const nombresArchivos = {
    R: 'rey_blanco', D: 'reina_blanca', T: 'torre_blanca',
    A: 'alfil_blanco', C: 'caballo_blanco', P: 'peon_blanco',
    r: 'rey_negro', d: 'reina_negra', t: 'torre_negra',
    a: 'alfil_negro', c: 'caballo_negro', p: 'peon_negro',
};
for (const id of piezas) {
    this.load.image(`sprite_${id}`, `assets/sprites/piezas/${nombresArchivos[id]}.png`);
}
```

#### En `dibujarPiezas()`, reemplazar el loop por:
```javascript
for (let fila = 0; fila < 8; fila++) {
    this.elementosPiezas[fila] = [];
    for (let col = 0; col < 8; col++) {
        const pieza = this.tablero[fila][col];
        const posicionX = col * TAM_CASILLA + TAM_CASILLA / 2;
        const posicionY = fila * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;

        if (pieza && this.textures.exists(`sprite_${pieza}`)) {
            const sprite = this.add.image(posicionX, posicionY, `sprite_${pieza}`)
                .setDisplaySize(TAM_CASILLA * 0.8, TAM_CASILLA * 0.8)
                .setDepth(10);
            this.elementosPiezas[fila][col] = sprite;
        } else {
            // Fallback a Unicode si no hay sprite
            const esDios = pieza ? pieza === pieza.toUpperCase() : false;
            const textoPieza = this.add.text(posicionX, posicionY, pieza ? SIMBOLOS_PIEZAS[pieza] : '', {
                fontSize: '50px',
                color: esDios ? '#FFD700' : '#333',
                fontStyle: 'bold',
                stroke: esDios ? '#8B6914' : '#000',
                strokeThickness: esDios ? 1 : 2,
            }).setOrigin(0.5).setDepth(10);
            this.elementosPiezas[fila][col] = textoPieza;
        }
    }
}
```

#### En `mostrarPieza()`, actualizar:
```javascript
mostrarPieza(fila, columna, idPieza) {
    const posicionX = columna * TAM_CASILLA + TAM_CASILLA / 2;
    const posicionY = fila * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA;
    const elemento = this.elementosPiezas[fila][columna];
    if (!elemento) return;

    if (this.textures.exists(`sprite_${idPieza}`)) {
        elemento.setTexture(`sprite_${idPieza}`).setPosition(posicionX, posicionY);
    } else if ('setText' in elemento) {
        elemento.setText(SIMBOLOS_PIEZAS[idPieza]).setPosition(posicionX, posicionY);
    }
}
```

#### Opcional: Eliminar generadorSprites.js
Si ya no necesitas el generador de placeholders, puedes eliminar:
```bash
rm src/motor/generadorSprites.js
```
Y eliminar el import en `EscenaAjedrez.js`:
```javascript
// Eliminar esta línea:
import { generarTodasPiezas, generarSpritesUI } from '../motor/generadorSprites';
```
Y eliminar las llamadas en `create()`:
```javascript
// Eliminar estas líneas:
generarTodasPiezas(this, 48);
generarSpritesUI(this);
```

---

### PASO 2: Integrar Tilemaps de Tiled

#### Qué hacer:
1. Crear tilemaps en Tiled Editor (ver Sección 4)
2. Exportar como JSON a `public/assets/mapas/`
3. Modificar `EscenaAjedrez.js`:

#### En `preload()`, descomentar:
```javascript
this.load.tilemapTiledJSON('tablero_olimpo', 'assets/mapas/olimpo.json');
this.load.tilemapTiledJSON('tablero_inframundo', 'assets/mapas/inframundo.json');
this.load.tilemapTiledJSON('tablero_monte_olimpo', 'assets/mapas/monte_olimpo.json');
```

#### En `dibujarTablero()`, reemplazar todo el bloque por:
```javascript
dibujarTablero() {
    // Cargar tilemap
    const mapa = this.make.tilemap({ key: `tablero_${this.temaTablero}` });
    const tileset = mapa.addTilesetImage(this.temaTablero);
    const capaTablero = mapa.createLayer('Tablero', tileset, 0, ALTURA_BARRA);

    // Capa de decoración (opcional)
    if (mapa.layers.find(l => l.name === 'Decoracion')) {
        const capaDecoracion = mapa.createLayer('Decoracion', tileset, 0, ALTURA_BARRA);
    }

    // Guardar referencia para lógica
    this.mapaTilemap = mapa;
    this.capaTablero = capaTablero;

    // Borde dorado del tablero
    const graficosBorde = this.add.graphics();
    graficosBorde.lineStyle(3, 0xDAA520);
    graficosBorde.strokeRect(0, ALTURA_BARRA, 8 * TAM_CASILLA, 8 * TAM_CASILLA);

    // Etiquetas de columnas y filas
    const letrasColumnas = 'ABCDEFGH';
    for (let col = 0; col < 8; col++) {
        this.add.text(col * TAM_CASILLA + TAM_CASILLA / 2, 8 * TAM_CASILLA + ALTURA_BARRA + 14, letrasColumnas[col], {
            fontSize: '14px', color: '#DAA520', fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
    for (let fila = 0; fila < 8; fila++) {
        this.add.text(-12, fila * TAM_CASILLA + TAM_CASILLA / 2 + ALTURA_BARRA, `${8 - fila}`, {
            fontSize: '14px', color: '#DAA520', fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}
```

#### Eliminar colores de constantes.js (opcional):
Si ya no usas colores placeholder, puedes eliminar `TEMAS_TABLERO` o mantenerlo como fallback.

---

### PASO 3: Integrar Audio

#### Qué hacer:
1. Colocar los 14 archivos MP3 en las carpetas correspondientes
2. **NO modificar código** — el audio ya está integrado

#### Verificar funcionamiento:
1. Abrir consola del navegador (F12)
2. Buscar mensaje: `Audio disponible (14/14)`
3. Si dice `0/14`, los archivos no están en la ruta correcta

#### Estructura de carpetas esperada:
```
public/assets/audio/
├── musica/
│   ├── menu.mp3
│   ├── partida.mp3
│   └── puzzle.mp3
├── movimientos/
│   ├── movimiento.mp3
│   ├── captura.mp3
│   ├── enroque.mp3
│   └── promocion.mp3
└── efectos/
    ├── seleccion.mp3
    ├── boton.mp3
    ├── error.mp3
    ├── jaque.mp3
    ├── jaque_mate.mp3
    ├── tablas.mp3
    └── puzzle_completado.mp3
```

---

### PASO 4: Limpiar Código Placeholder

#### Archivos que PUEDES eliminar (si no los usas):
```bash
# Generador de sprites (solo si usas PNGs reales)
rm src/motor/generadorSprites.js

# Fondo de estrellas (si no lo necesitas)
rm src/componentes/FondoEstrellas.jsx
```

#### Archivos que NO debes eliminar:
```bash
# Estos son esenciales para el juego
src/constantes.js          ← Configuración
src/utilidades.js          ← Funciones helper
src/motor/gestorAudio.js   ← Sistema de audio
src/motor/gestorEfectos.js ← Efectos visuales
src/escenas/EscenaAjedrez.js ← Escena principal
```

---

### PASO 5: Verificar que Todo Funciona

#### Checklist final:
1. [ ] Sprites de piezas se muestran correctamente
2. [ ] Tilemap del tablero se carga y dibuja
3. [ ] Audio se reproduce al hacer movimientos
4. [ ] Efectos visuales funcionan (selección, captura, jaque)
5. [ ] IA funciona correctamente
6. [ ] Menú de configuración de audio funciona
7. [ ] No hay errores en la consola (F12)

#### Errores comunes:
- **"Texture not found"**: El sprite PNG no está en la ruta correcta
- **"Tilemap not found"**: El JSON de Tiled no está en `public/assets/mapas/`
- **Audio no suena**: El archivo MP3 no está en la ruta correcta o tiene formato incorrecto

---

### Resumen Rápido

| Acción | Archivos Afectados |
|--------|-------------------|
| Agregar sprites PNG | `public/assets/sprites/piezas/` + `EscenaAjedrez.js` |
| Agregar tilemaps | `public/assets/mapas/` + `EscenaAjedrez.js` |
| Agregar audio | `public/assets/audio/` (no modificar código) |
| Eliminar placeholders | `motor/generadorSprites.js` (opcional) |
| Mantener siempre | `constantes.js`, `utilidades.js`, `gestorAudio.js`, `gestorEfectos.js` |
