$ErrorActionPreference = "Stop"

cd c:\Users\Admin\Documents\Programacion\Javascript\Proyecto_Final_Lenguaje_3
$env:GITHUB_TOKEN = ""

# Fase 4
git checkout develop
git pull origin develop
git checkout -b feature/motor-ajedrez-frontend
git add frontend/src/motor/constantesAjedrez.js
git commit -m "feat(frontend): agregar constantes del motor de ajedrez"
git add frontend/src/motor/motorAjedrez.js
git commit -m "feat(frontend): implementar motor de ajedrez con reglas completas"
git add frontend/src/motor/movimientosEscena.js
git commit -m "feat(frontend): agregar logica de movimientos en escena"
git add frontend/src/utilidades.js frontend/src/constantes.js
git commit -m "feat(frontend): agregar utilidades generales y constantes de la app"
git checkout develop
git merge --no-ff feature/motor-ajedrez-frontend -m "Merge branch 'feature/motor-ajedrez-frontend' into develop"
git push origin develop
git push origin feature/motor-ajedrez-frontend

# Fase 5
git checkout -b feature/ia-ajedrez
git add frontend/src/motor/iaAjedrez.js
git commit -m "feat(frontend): implementar IA de ajedrez con minimax y evaluacion"
git checkout develop
git merge --no-ff feature/ia-ajedrez -m "Merge branch 'feature/ia-ajedrez' into develop"
git push origin develop
git push origin feature/ia-ajedrez

# Fase 6
git checkout -b feature/ui-phaser
git add frontend/src/motor/generadorSprites.js
git commit -m "feat(frontend): agregar generador procedural de sprites de piezas"
git add frontend/src/motor/generadorTilesets.js
git commit -m "feat(frontend): agregar generador procedural de tilesets"
git add frontend/src/motor/renderizado.js
git commit -m "feat(frontend): implementar sistema de renderizado del tablero"
git add frontend/src/escenas/EscenaAjedrez.js
git commit -m "feat(frontend): implementar escena principal de ajedrez en Phaser"
git add frontend/src/componentes/PhaserGame.jsx
git commit -m "feat(frontend): agregar componente PhaserGame con integracion React"
git add frontend/public/
git commit -m "feat(frontend): agregar assets de audio, sprites y mapas"
git checkout develop
git merge --no-ff feature/ui-phaser -m "Merge branch 'feature/ui-phaser' into develop"
git push origin develop
git push origin feature/ui-phaser

# Fase 7
git checkout -b feature/ui-react
git add frontend/src/componentes/MenuPrincipal.jsx
git commit -m "feat(frontend): agregar menu principal con selector de modos"
git add frontend/src/componentes/FondoEstrellas.jsx
git commit -m "feat(frontend): agregar componente de fondo animado con estrellas"
git add frontend/src/componentes/PanelConfiguracion.jsx
git commit -m "feat(frontend): agregar panel de configuracion de audio y brillo"
git add frontend/src/almacen/
git commit -m "feat(frontend): agregar almacen de estado con Zustand"
git add frontend/src/servicios/api.js
git commit -m "feat(frontend): agregar servicio API REST con Axios"
git add frontend/src/servicios/websocket.js
git commit -m "feat(frontend): agregar servicio WebSocket para partidas online"
git add frontend/src/App.jsx frontend/src/estilos/
git commit -m "feat(frontend): implementar componente App principal y estilos"
git checkout develop
git merge --no-ff feature/ui-react -m "Merge branch 'feature/ui-react' into develop"
git push origin develop
git push origin feature/ui-react

# Fase 9
git checkout -b feature/audio-efectos
git add frontend/src/motor/gestorAudio.js
git commit -m "feat(frontend): implementar gestor de audio con musica y efectos"
git add frontend/src/motor/gestorEfectos.js
git commit -m "feat(frontend): implementar gestor de efectos visuales y particulas"
git checkout develop
git merge --no-ff feature/audio-efectos -m "Merge branch 'feature/audio-efectos' into develop"
git push origin develop
git push origin feature/audio-efectos

# Fase 10 (Release)
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main para release v1.0.0"
git tag v1.0.0
git push origin main --tags
git checkout develop

# Add any remaining untracked files if any, to a final cleanup commit (just in case)
git add .
$status = git status --porcelain
if ($status) {
    git commit -m "chore: cleanup final de archivos restantes"
    git push origin develop
}
