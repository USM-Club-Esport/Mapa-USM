# 🗄️ Estructuras de Datos y Modelo Relacional

La lógica principal de **Mapa USM** es impulsada íntegramente por datos (Data-Driven). Utilizamos tres archivos de base de datos estéticos ubicados en `src/data/`. 

Su propósito central es establecer una **relación directa** entre la interfaz de usuario (el menú lateral) y la ubicación geográfica (lo que se dibuja en el mapa).

---

## 📑 1. Gestión de Categorías y Menús (`menuData.js`)

Este archivo define qué es lo que el usuario ve escrito en la **Barra Lateral (Sidebar)** de la aplicación y administra la iconografía.

*   **`MENU_DATA`**: Alberga las grandes categorías generales del mapa (Ej: "Facultades", "Biblioteca").
*   **Grupos Secundarios (`FACULTIES_DATA`, `CAFETERIA_DATA`...)**: Actúan como sub-menús cuando las categorías base requieren desglose.

> [!NOTE]
> **Esquema de Ejemplo para un Elemento del Menú:**
> ```javascript
> {
>     id: 'f1', // ID Único. El prefijo comúnmente índica el contexto (ej. f = faculties, m = medical)
>     title: 'Estudios Internacionales',
>     iconFamily: 'FontAwesome5', // Determina la librería externa de @expo/vector-icons a cargar
>     iconName: 'chart-line',     // El nombre exacto del ícono dentro de esa librería
>     size: 24
> }
> ```

---

## 📍 2. Puntos de Interés Globales (`markersData.js`)

Contiene el arreglo maestro (array) con todos los **Puntos de Interés (POI)** que se deben dibujar en tu mapa 2D. 

El poder de este archivo recae en que no define manualmente qué icono lleva cada punto; en su lugar, utiliza lógica de bases de datos relacional para "apuntar" a los ítems existentes en `menuData.js` mediante la llave extranjera `categoryId`.

> [!IMPORTANT]
> **Esquema de Ejemplo para un Marcador:**
> ```javascript
> {
>     id: '1',
>     title: 'Facultad de Estudios Internacionales',
>     
>     // Relaciones hacia menuData.js:
>     categoryId: '1', // Lo clasifica bajo "Facultades"
>     subItemId: 'f1', // Específicamente, jalará el ícono configurado para "Estudios Internacionales" en FACULTIES_DATA
>     
>     // Ubicación Real:
>     coordinate: { latitude: 10.46338, longitude: -66.83063 },
>     
>     // Información Extendida para el Panel de Detalles (Opcional):
>     address: 'Edificio Central D',
>     departments: ['Escuela de Estudios Internacionales', 'Dirección'],
>     modules: ['D']
> }
> ```

---

## 🏢 3. Topografía de Edificios 3D (`buildings3DData.js`)

Al activar la vista 3D en la aplicación Web, se despliegan representaciones estructuradas (Polígonos Extruidos) que marcan la volumetría de los edificios reales en la USM. 

A diferencia de los marcadores (`markers`), las estructuras 3D **son completamente estáticas**, actúan como un mero fondo geográfico enriquecido y no se ven afectadas en absoluto por los filtros del `Sidebar`.

> [!NOTE]
> **Esquema de Ejemplo para un Edificio 3D:**
> ```javascript
> {
>     id: 'cruz',
>     type: 'polygon',
>     coordinates: [
>         { latitude: 10.464670, longitude: -66.833535 },
>         // ... + la lista completa de nudos perimetrales (esquinas) que forman la edificación real
>     ],
>     height: 15, // Altura gráfica de la extrusión 3D
>     fillColor: "rgba(128, 128, 128, 0.5)",
>     strokeColor: "rgba(100, 100, 100, 0.8)",
>     strokeWidth: 2
> }
> ```

---

## 🛠️ Flujo de Trabajo: ¿Cómo agregar una nueva locación al App?

Si deseas incorporar un nuevo edificio o lugar relevante:

1.  **Dibuja el Terreno (Opcional):** Ve a `buildings3DData.js` y define las coordenadas esféricas para crear el polígono 3D del edificio.
2.  **Crea el Filtro UI:** Ve a `menuData.js` (a su categoría adecuada) para registrar cómo quieres que este lugar se llame en el menú de filtrado y qué icono quieres que lo acompañe. *¡Recuerda su `id`!*
3.  **Ancla el Clavito Geográfico:** Finalmente agrega el sitio a `markersData.js` situando sus coordenadas exactas, relacionando su `categoryId` o `subItemId` con el identificador del paso anterior para que este herede visualmente el icono.
