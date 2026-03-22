# 🗺️ Mapa USM

¡Bienvenido al repositorio de **Mapa USM**! 

Esta es una aplicación interactiva desarrollada en **React Native / Expo** que proporciona un mapa interactivo (en 2D y 3D) para explorar el campus de la Universidad Santa María (USM).

---

## ✨ Características Principales

*   📱 **Multiplataforma Real:** Funciona de forma nativa en **Android e iOS** (usando `react-native-maps`) y de manera impecable en **Navegadores Web** (usando `pigeon-maps`).
*   🔍 **Navegación Intuitiva:** Una barra lateral (`Sidebar`) permite filtrar Puntos de Interés (POI) dinámicamente: Facultades, Cafeterías, Servicios Médicos, y más.
*   ℹ️ **Información Detallada:** Un panel interactivo inferior (`MapLegend` / `Bottom Sheet`) muestra las direcciones y departamentos específicos del lugar seleccionado.

---

## 🚀 Guía de Inicio Rápido (Quickstart)

Sigue estos sencillos pasos para levantar el entorno de desarrollo local y comenzar a aportar al proyecto.

### 1. Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada).

### 2. Instalación de Dependencias
Clona este repositorio y ejecuta el siguiente comando en la raíz del proyecto para instalar todos los paquetes necesarios:

```bash
npm install
```

### 3. Ejecutar el Servidor de Desarrollo
Inicia el servidor (Metro bundler) de Expo:

```bash
npx expo start
```

> [!TIP]
> Una vez que el servidor esté corriendo en tu terminal:
> *   Presiona **`a`** para abrir la aplicación en tu emulador de **Android**.
> *   Presiona **`w`** para abrir la versión **Web** directamente en tu navegador.

---

## 📚 Documentación Técnica

Dado que la aplicación funciona en múltiples plataformas, existen desafíos arquitectónicos particulares, especialmente en cómo se dibujan los mapas y se manejan los iconos. 

Hemos preparado documentación detallada para ayudarte a entender la base de código rápidamente. **Te recomendamos leerlos en el siguiente orden:**

1. 🏛️ **[Arquitectura: Móvil vs Web](./docs/architecture/mobile-vs-web.md)**
   Aprende cómo y por qué dividimos los componentes principales (`Map.jsx` y `Map.web.jsx`) para evitar bugs nativos.
2. 🗄️ **[Estructuras de Datos](./docs/api/data-structures.md)**
   Descubre cómo funcionan los archivos JSON subyacentes (`menuData.js`, `markersData.js`) que alimentan la interfaz y vinculan los menús con los mapas.
3. 🎨 **[Generación de Assets (Marcadores)](./docs/assets/marker-generation.md)**
   Entiende nuestra herramienta en Node.js para auto-generar imágenes `.png` perfectas a partir de vectores para resolver problemas de la plataforma Android.
