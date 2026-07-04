# Frontend - El Cazador BI + IA

Frontend base construido con React, Vite, TypeScript y Tailwind CSS.

Incluye dashboard BI, paginas narrativas, graficos Recharts, simulador predictivo y chat del asistente IA.

## Instalacion

```powershell
cd C:\PolleriaElCazador\frontend
npm install
```

## Ejecutar

```powershell
npm run dev
```

## Verificar

Abrir:

```txt
http://localhost:5173
```

La pantalla inicial debe cargar y consultar `http://localhost:8000/api/health` si el backend esta activo.

Para apuntar a otro backend, define `VITE_API_URL` o `VITE_API_BASE_URL`.

## Build

```powershell
npm run build
```
