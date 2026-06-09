# Frontend React - Login + Bienvenida

Aplicación web en React que consume el backend FastAPI del proyecto para autenticar usuarios vía JWT.

## Funcionalidades

- Pantalla de **login** conectada al endpoint `POST /token` del backend.
- El `access_token` se guarda en `sessionStorage` (sesión del navegador).
- Pantalla de **bienvenida protegida** (`/welcome`):
  - Si no hay token de sesión, redirige automáticamente al login.
- Botón para **cerrar sesión** y limpiar el token.

## Requisitos

- Node.js 20+
- npm 10+
- Backend ejecutándose (por defecto en `http://localhost:8000`)

## Configuración

Puedes configurar la URL del backend con una variable de entorno:

```bash
VITE_API_URL=http://localhost:8000
```

Si no se define, se usa `http://localhost:8000` por defecto.

## Uso

Desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

Luego abre la URL mostrada por Vite (normalmente `http://localhost:5173`).

## Credenciales de prueba

Las credenciales del backend actual son:

- Usuario: `admin`
- Contraseña: `admin123`

## Scripts

- `npm run dev`: inicia el servidor de desarrollo
- `npm run build`: genera build de producción
- `npm run lint`: ejecuta ESLint
- `npm run preview`: previsualiza el build
