# Mapa-USM

Aplicación multiplataforma de mapas interactivos para la Universidad Santa María (USM).
Android, iOS y Web desde un solo código base con Expo.

## Stack

- **Framework:** Expo SDK 54 + React Native 0.81
- **UI:** React 19 con JSX (JavaScript, sin TypeScript)
- **Mapas nativos:** `react-native-maps` (Android/iOS)
- **Mapas web:** `pigeon-maps` (web)
- **3D:** `@react-three/fiber` + `@react-three/drei` + `three`
- **Navegación:** No hay router — pantalla única con switch de plataforma
- **Estado:** `useState` / `useReducer` local (sin stores globales)

## Estructura del proyecto

```
src/
├── App.jsx                        # Raíz — decide MobileView vs WebView
├── components/
│   ├── Map.jsx                    # Mapa nativo (Android/iOS)
│   ├── Map.web.jsx                # Mapa web (pigeon-maps)
│   ├── Map3D.jsx                  # Escena 3D con Three.js
│   ├── MobileView.jsx             # Layout móvil
│   ├── WebView.jsx                # Layout web
│   ├── UserLocationMarker.jsx     # Punto azul de ubicación
│   ├── mobile/
│   │   ├── MapLegend.jsx          # Panel inferior con info del POI
│   │   ├── SearchBar.jsx          # Barra de búsqueda
│   │   └── SidebarMenu.jsx        # Menú lateral de categorías
│   └── ui/
│       ├── BottomControls.jsx     # Botones 2D/3D y settings
│       ├── CenterLocationButton.jsx
│       └── MenuItem.jsx
├── data/
│   ├── markersData.js             # POIs con coordenadas, direcciones, departamentos
│   ├── buildings3DData.js         # Polígonos de edificios para vista 3D
│   ├── menuData.js                # Categorías y submenús del sidebar
│   └── iconUtils.js               # Resuelve íconos de marcadores
├── styles/
│   ├── MobileViewStyles.js
│   └── WebViewStyles.js
└── utils/
    └── mapCalculations.js         # Utilidades geoespaciales
```

## Convenciones de código

- **Punto y coma:** siempre
- **Comillas:** simples en JS, dobles en JSX attributes
- **Indentación:** 4 espacios (no tabs)
- **Coma final (trailing comma):** sí, en multilínea
- **Imports:** agrupados (React → RN → librerías → locales), separados por línea en blanco
- **Exports default:** para componentes principales (App, Map, MobileView, etc.)
- **Exports nombrados:** para subcomponentes, datos, utilidades
- **JSX:** self-closing tags con espacio antes de `/>`, props en líneas separadas si son muchas

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm start` | Inicia servidor Expo |
| `pnpm run web` | Inicia Expo + abre web |
| `pnpm run android` | Inicia Expo + emulador Android |
| `pnpm run ios` | Inicia Expo + simulador iOS |
| `pnpm run build:web` | Exporta build web estático |
| `pnpm run clean` | Expo start con caché limpia |
| `pnpm run tunnel` | Expo start por tunnel (para WSL/firewall) |
| `pnpm run lint` | Ejecuta ESLint en `src/` |
| `pnpm run lint:fix` | ESLint con auto-fix |
| `pnpm run format` | Formatea código con Prettier |
| `pnpm run format:check` | Verifica formato sin modificar |
| `pnpm test` | Ejecuta tests con Jest |
| `pnpm run test:watch` | Jest en modo watch (útil para TDD) |
| `pnpm run test:ci` | Jest con cobertura para CI |

## Pre-commit hooks (Husky)

- `eslint --fix` + `prettier --write` se ejecutan automáticamente en cada `git commit` sobre los archivos staged
- Si hay errores, el commit se rechaza con el mensaje de ESLint
- Para saltar: `git commit --no-verify`

## Notas importantes

- `Map.jsx` solo funciona en Android/iOS (usa `react-native-maps`)
- `Map.web.jsx` solo funciona en web (usa `pigeon-maps`)
- `Map3D.jsx` es experimental y puede tener problemas de rendimiento en dispositivos low-end
- Los marcadores se generan con `scripts/generate_icons_v2.js` (requiere Sharp)
- No hay ruteo — `App.jsx` detecta plataforma con `Platform.OS`
- El proyecto se despliega en Vercel (web) y Expo EAS (móvil)
