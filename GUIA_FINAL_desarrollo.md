# Guía Final de Desarrollo - Ajedrez Mitología Griega

## Estado Actual del Proyecto
- **Frontend**: React 18 + Phaser 3 + Tailwind CSS v4
- **Backend**: Django 4.2 + Django REST Framework + Channels
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Auth**: JWT tokens
- **Multiplayer**: WebSocket via Django Channels

---

## FASE 1: Assets Visuales (Requerido)

### 1.1 Sprites de Piezas (12 archivos)
**Ubicación**: `frontend/public/assets/sprites/piezas/`

| Archivo | Descripción | Tamaño sugerido |
|---------|-------------|-----------------|
| rey_blanco.png | Rey bando Dioses | 128x128 px |
| reina_blanca.png | Reina bando Dioses | 128x128 px |
| torre_blanca.png | Torre bando Dioses | 128x128 px |
| alfil_blanco.png | Alfil bando Dioses | 128x128 px |
| caballo_blanco.png | Caballo bando Dioses | 128x128 px |
| peon_blanco.png | Peón bando Dioses | 128x128 px |
| rey_negro.png | Rey bando Titanes | 128x128 px |
| reina_negra.png | Reina bando Titanes | 128x128 px |
| torre_negra.png | Torre bando Titanes | 128x128 px |
| alfil_negro.png | Alfil bando Titanes | 128x128 px |
| caballo_negro.png | Caballo bando Titanes | 128x128 px |
| peon_negro.png | Peón bando Titanes | 128x128 px |

**Pasos para integrar**:
1. Crear/editar imágenes en cualquier editor (Photoshop, GIMP, Aseprite)
2. Colocar en la carpeta indicada
3. En `preload()` de `EscenaAjedrez.js`, descomentar las líneas de carga:
```js
this.load.image('sprite_R', 'assets/sprites/piezas/rey_blanco.png');
this.load.image('sprite_D', 'assets/sprites/piezas/reina_blanca.png');
// ... (ver dibujarPiezas en renderizado.js para la lista completa)
```
4. En `dibujarPiezas()` de `renderizado.js`, reemplazar `this.add.text()` por `this.add.image()`
5. En `create()` de `EscenaAjedrez.js`, comentar `generarTodasPiezas(this, 48)`

### 1.2 Tilesets de Tablero (3 archivos)
**Ubicación**: `frontend/public/assets/sprites/tilesets/`

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| tileset_olimpo.png | Tema Olimpo | 256x192 px |
| tileset_inframundo.png | Tema Inframundo | 256x192 px |
| tileset_monte_olimpo.png | Tema Monte Olimpo | 256x192 px |

**Formato del tileset** (4 columnas x 3 filas, tiles de 64x64):
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Tile 0       │ Tile 1       │ Tile 2       │ Tile 3       │
│ casilla_clara│ casilla_oscur│ casilla_espec│ casilla_inic │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Tile 4       │ Tile 5       │ Tile 6       │ Tile 7       │
│ borde_superio│ borde_lateral│ esquina      │ esquina_late │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Tile 8       │ Tile 9       │ Tile 10      │ Tile 11      │
│ efecto_selec │ efecto_movim │ efecto_jaque │ efecto_mate  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Pasos para integrar**:
1. Crear imágenes o usar las generadas dinámicamente
2. Colocar en la carpeta indicada
3. En `preload()` de `EscenaAjedrez.js`, descomentar:
```js
this.load.image('tileset_olimpo', 'assets/sprites/tilesets/tileset_olimpo.png');
this.load.image('tileset_inframundo', 'assets/sprites/tilesets/tileset_inframundo.png');
this.load.image('tileset_monte_olimpo', 'assets/sprites/tilesets/tileset_monte_olimpo.png');
this.load.tilemapTiledJSON('tablero_olimpo', 'assets/mapas/olimpo.json');
this.load.tilemapTiledJSON('tablero_inframundo', 'assets/mapas/inframundo.json');
this.load.tilemapTiledJSON('tablero_monte_olimpo', 'assets/mapas/monte_olimpo.json');
```
4. En `dibujarTablero()` de `renderizado.js`, descomentar el bloque Tiled

---

## FASE 2: Audio Real (Requerido)

### 2.1 Efectos de Sonido (8 archivos)
**Ubicación**: `frontend/public/assets/audio/efectos/`

| Archivo | Descripción | Duración sugerida |
|---------|-------------|-------------------|
| seleccion.mp3 | Clic en pieza | 0.2s |
| movimiento.mp3 | Mover pieza | 0.3s |
| captura.mp3 | Capturar pieza | 0.4s |
| jaque.mp3 | Rey en jaque | 0.5s |
| jaque_mate.mp3 | Jaque mate | 1.0s |
| tablas.mp3 | Empate | 0.8s |
| boton.mp3 | Clic en botón | 0.1s |
| error.mp3 | Acción inválida | 0.3s |

### 2.2 Música de Fondo (5 archivos)
**Ubicación**: `frontend/public/assets/audio/musica/`

| Archivo | Descripción | Duración sugerida |
|---------|-------------|-------------------|
| menu.mp3 | Menú principal | Loop 2-3 min |
| partida.mp3 | Durante partida | Loop 3-5 min |
| puzzle.mp3 | Modo puzzles | Loop 2-3 min |
| victoria.mp3 | Pantalla victoria | 1-2 min |
| derrota.mp3 | Pantalla derrota | 1-2 min |

### 2.3 Música de Movimientos (4 archivos)
**Ubicación**: `frontend/public/assets/audio/movimientos/`

| Archivo | Descripción | Duración sugerida |
|---------|-------------|-------------------|
| captura.mp3 | Captura especial | 0.5s |
| enroque.mp3 | Enroque | 0.4s |
| promocion.mp3 | Promoción de peón | 0.5s |
| movimiento.mp3 | Movimiento normal | 0.3s |

**Fuentes de audio gratuitas**:
- https://freesound.org
- https://pixabay.com/music
- https://opengameart.org

---

## FASE 3: Base de Datos PostgreSQL (Requerido)

### 3.1 Instalar PostgreSQL
```bash
# Windows: descargar desde https://www.postgresql.org/download/windows/
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# Crear usuario y BD:
sudo -u postgres psql
CREATE USER chess_user WITH PASSWORD 'chess_pass';
CREATE DATABASE chess_game OWNER chess_user;
GRANT ALL PRIVILEGES ON DATABASE chess_game TO chess_user;
\q
```

### 3.2 Configurar Variables de Entorno
Crear archivo `backend/.env`:
```env
DJANGO_SECRET_KEY=tu-clave-secreta-aqui
DJANGO_DEBUG=True
DB_NAME=chess_game
DB_USER=chess_user
DB_PASSWORD=chess_pass
DB_HOST=localhost
DB_PORT=5432
```

### 3.3 Instalar dependencia PostgreSQL
```bash
cd backend
pip install psycopg2-binary
```

### 3.4 Ejecutar Migraciones
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 3.5 Cambiar Configuración
En `configuracion/ajustes/desarrollo.py`, comentar la línea de SQLite:
```python
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
```

---

## FASE 4: Pruebas (Recomendado)

### 4.1 Tests Backend
Crear `backend/aplicaciones/motor_ajedrez/tests.py`:
```python
from django.test import TestCase
from .tablero import TableroAjedrez

class TableroTestCase(TestCase):
    def setUp(self):
        self.tablero = TableroAjedrez()
    
    def test_posicion_inicial(self):
        self.assertEqual(len(self.tablero.piezas), 32)
    
    def test_movimiento_peon(self):
        movimientos = self.tablero.obtener_movimientos(6, 0)
        self.assertIn((5, 0), movimientos)
```

### 4.2 Tests Frontend
```bash
cd frontend
npm install --save-dev vitest @testing-library/react
```

Crear `frontend/src/__tests__/motorAjedrez.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { calcularMovimientosPosibles } from '../motor/motorAjedrez';

describe('Motor de Ajedrez', () => {
  it('debe calcular movimientos de peón', () => {
    const tablero = Array(8).fill(null).map(() => Array(8).fill(null));
    tablero[6][0] = 'P';
    const movimientos = calcularMovimientosPosibles(tablero, 6, 0);
    expect(movimientos).toContainEqual({fila: 5, columna: 0});
  });
});
```

Ejecutar: `npm run test`

---

## FASE 5: Limpieza de Archivos (Post-Desarrollo)

### 5.1 Archivos a ELIMINAR después de completar el desarrollo:

```
# Archivos temporales y de prueba
frontend/index_test.html                    # Página de prueba HTML
frontend/crear_assets.bat                   # Script de creación de assets
frontend/generar_audios.py                  # Generador de audios placeholder
frontend/django_log.txt                     # Log temporal de Django
frontend/vite_log.txt                       # Log temporal de Vite
frontend/documentacion/                     # Carpeta de documentación temporal

# Migraciones iniciales (regenerar después de cambios en modelos)
backend/aplicaciones/*/migrations/0001_initial.py  # Regenerar con makemigrations

# Archivos de configuración temporales
frontend/.env.example                       # Si existe, eliminar
backend/.env                                # NO subir a git (agregar a .gitignore)
```

### 5.2 Archivos que se MANTIENEN:
```
# Assets reales (NO eliminar)
frontend/public/assets/sprites/piezas/*.png       # Sprites de piezas
frontend/public/assets/sprites/tilesets/*.png     # Tilesets de tablero
frontend/public/assets/sprites/fondos/*.svg       # Fondos de pantalla
frontend/public/assets/audio/**/*.mp3             # Audios reales
frontend/public/assets/mapas/*.json               # Tilemaps Tiled

# Configuración
frontend/public/assets/mapas/puzzles/*.json       # Puzzles del juego
```

### 5.3 Actualizar .gitignore
Agregar si no existe:
```gitignore
# Archivos de entorno
backend/.env
frontend/.env

# Logs
*.log
frontend/django_log.txt
frontend/vite_log.txt

# Archivos temporales
frontend/index_test.html
frontend/crear_assets.bat
frontend/generar_audios.py

# Base de datos
backend/db.sqlite3
*.pyc
__pycache__/
```

---

## FASE 6: Verificación Final

### 6.1 Checklist de Funcionalidad
- [ ] Login/Register funciona
- [ ] Menú principal muestra 3 temas
- [ ] Tablero se dibuja correctamente
- [ ] Piezas se muestran con sprites reales
- [ ] Movimientos de piezas funcionan
- [ ] IA responde en 3 niveles
- [ ] Puzzles cargan y se resuelven
- [ ] Audio de selección/movimiento funciona
- [ ] Música de fondo suena
- [ ] Modo online conecta 2 jugadores
- [ ] Jaque mate muestra pantalla final
- [ ] Tablero se voltea al jugar como Titanes

### 6.2 Checklist Técnico
- [ ] No hay console.log en producción
- [ ] No hay archivos .map en build final
- [ ] PostgreSQL configurado y funcionando
- [ ] Migraciones ejecutadas
- [ ] CORS configurado para dominio final
- [ ] WebSocket funciona con SSL (wss://)
- [ ] Archivos estáticos servidos por Nginx/CDN

---

## Resumen de Archivos a Crear

| Cantidad | Tipo | Ubicación |
|----------|------|-----------|
| 12 | Sprites piezas PNG | `public/assets/sprites/piezas/` |
| 3 | Tilesets tablero PNG | `public/assets/sprites/tilesets/` |
| 8 | Efectos sonido MP3 | `public/assets/audio/efectos/` |
| 5 | Música fondo MP3 | `public/assets/audio/musica/` |
| 4 | Música movimientos MP3 | `public/assets/audio/movimientos/` |
| **32** | **Total archivos multimedia** | |

## Resumen de Archivos a Eliminar

| Cantidad | Tipo | Razón |
|----------|------|-------|
| 1 | `index_test.html` | Página de prueba temporal |
| 1 | `crear_assets.bat` | Script temporal Windows |
| 1 | `generar_audios.py` | Generador temporal |
| 2 | `*.log` | Logs temporales |
| 1 | `documentacion/` | Carpeta temporal |
| **6** | **Total archivos a eliminar** | |
