# 🏛️ Arquitectura: Estrategia Móvil vs Web

Mantener un único repositorio (codebase) que funcione perfectamente en **Nativo (Android/iOS)** y **Visores Web** es un gran desafío, sobre todo en aplicaciones basadas en mapas, ya que los motores de renderizado varían drásticamente según la plataforma.

> [!IMPORTANT]
> En lugar de forzar una única librería que funcione de manera deficiente en ambos lugares, implementamos un patrón de **Divergencia de Componentes (Component Divergence)**. Dividimos la responsabilidad en dos archivos distintos dependiendo de dónde se compile la aplicación.

---

## 📱 1. Entorno Móvil Nativo (`src/components/Map.jsx`)

Para las versiones móviles que compilan en Android e iOS, utilizamos **[`react-native-maps`](https://github.com/react-native-maps/react-native-maps)**.

### El Problema: El Motor "Fabric" de Android (Clipping Bug)
Normalmente, `react-native-maps` permite crear marcadores dinámicos usando código React estándar dentro la etiqueta `<Marker>`. Sin embargo, la nueva arquitectura moderna de Android en React Native (conocida como **Fabric**) tiene un error visual documentado. Cuando intentamos renderizar iconos vectoriales envueltos en contenedores (`Views`) redondeados, la plataforma nativa **recorta o esconde los marcadores** de manera aleatoria al desplazar el mapa.

### Nuestra Solución: Renderizado Pre-Horneado (PNGs)
Para evadir completamente el motor de renderizado interno de Fabric:
*   Pre-generamos todas las variaciones de nuestros iconos (color base + el icono de `@expo/vector-icons`) transformándolos en **imágenes estáticas (`.png`) de 90x90 píxeles.**
*   `react-native-maps` puede renderizar cientos de PNGs con **100% de fiabilidad y 60fps**, resolviendo el problema visual.

*(Para entender cómo se generan de forma automatizada estas imágenes, lee nuestra [Guía de Pipeline de Marcadores](../assets/marker-generation.md)).*

---

## 🌐 2. Entorno Web (`src/components/Map.web.jsx`)

Si se intenta utilizar `react-native-maps` en Web, el sistema intenta utilizar por debajo un envoltorio hacia la API de Google Maps (`react-native-web-maps`), lo cual es pesado y requiere gestión estricta de facturación/tokens (API Keys).

### Nuestra Solución: Utilizar `pigeon-maps`
Para la web, reemplazamos por completo esa dependencia en favor de **[`pigeon-maps`](https://github.com/mariusandra/pigeon-maps)**.

*   **¿Por qué Pigeon Maps?** Puesto que fue diseñado desde cero para trabajar con el DOM de React (a diferencia de opciones como Leaflet que requieren plugins extraños para inyectar React), podemos usar el componente `<Overlay>` para posicionar coordenadas.
*   **Iconos en Vivo (Live Vectors):** Al estar en un navegador y no sufrir del bug de Fabric de Android, en Web **NO utilizamos imágenes estáticas (`.png`)**. `Map.web.jsx` importa dinámicamente las fuentes vectoriales (ej. `<FontAwesome5>`) y las dibuja en vivo, garantizando nitidez infinita sin peso extra.

---

## 🛤️ El Empaquetador (Metro Bundler) al Rescate

Te estarás preguntando: *"Si importo dos librerías distintas, ¿no se vuelve la app súper pesada?"*

¡Para nada! El empaquetador de código de Expo (**Metro**) es inteligente. 
Cuando se ejecuta `npm run web`:
1. El bundler busca si el componente que se intenta importar en pantalla tiene un nombre terminado en `.web.jsx`.
2. Como encuentra a `Map.web.jsx`, lo empaqueta para la Web, **ignorando completamente** a `Map.jsx` (y con él, dejando atrás a `react-native-maps` en las versiones de escritorio).
3. De la misma forma, Android jamás descarga el pesado código de `pigeon-maps`.
