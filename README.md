# ♟ ChessMate - Ajedrez Griego

Juego de ajedrez con temática de mitología griega, construido con React + Phaser 3 en el frontend y Django REST Framework en el backend.

## 🏛 Características

- **Modo vs IA** — Tres niveles de dificultad (Humano, Campeón, Olympus)
- **Modo vs Jugador** — Partida local para dos jugadores
- **Puzzles** — Desafíos tácticos con pistas progresivas
- **Temas visuales** — Olimpo, Inframundo y Monte Olimpo
- **Sprites procedurales** — Piezas generadas dinámicamente con estilo griego
- **Audio inmersivo** — Música y efectos de sonido temáticos

## 🛠 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Phaser 3, Vite, Zustand, Axios |
| Backend | Django 4.2, Django REST Framework, Django Channels |
| Base de datos | SQLite (desarrollo) / PostgreSQL (producción) |
| Autenticación | JWT (SimpleJWT) |

## 📁 Estructura del Proyecto

```
chessmate-proyect/
├── frontend/          # Aplicación React + Phaser
│   ├── src/
│   │   ├── motor/     # Motor de ajedrez (reglas, IA, renderizado)
│   │   ├── escenas/   # Escenas de Phaser
│   │   ├── componentes/ # Componentes React
│   │   ├── servicios/ # API REST y WebSocket
│   │   └── almacen/   # Estado global (Zustand)
│   └── public/        # Assets estáticos
├── backend/           # API Django
│   ├── aplicaciones/
│   │   ├── cuentas/   # Autenticación y perfiles
│   │   ├── partidas/  # Gestión de partidas
│   │   └── motor_ajedrez/ # Motor Python
│   └── configuracion/ # Settings Django
└── README.md
```

## 🚀 Instalación

### Backend
```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👥 Equipo

Proyecto final — Lenguaje de Programación III

## 📄 Licencia

Proyecto académico — Todos los derechos reservados.
