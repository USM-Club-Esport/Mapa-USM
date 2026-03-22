# 🎨 Pipeline de Assets: Generación de Marcadores

Tal y como explicamos en el documento de [Topología Móvil vs Web](../architecture/mobile-vs-web.md), la versión Móvil Nativa de la app exige que utilicemos imágenes estáticas (`.png`) para cada marcador, evitando los infames errores gráficos de renderizado del motor **Fabric** introducido en Android.

Por otro lado, la Web renderiza vectores precisos tomados directamente de `@expo/vector-icons`.

> [!TIP]
> **El Reto:** ¿Cómo nos aseguramos de que el icono gráfico (`.png`) de Android se vea *idéntico* en forma y precisión al vector vectorial que se carga en la vista Web? 
> **La Solución:** Implementamos un script conversor en **Node.js** que dibuja y hornea vectores precisos convirtiéndolos en `.png` perfectos.

---

## ⚙️ Conoce el Script: `generate_icons_v2.js`

Este archivo, ubicado en `scripts/generate_icons_v2.js`, actúa como un horno de activos automatizado:

1.  Se comunica mediante una solicitud asíncrona a la **[Iconify API](https://iconify.design/)**. Esta base de datos aloja copias vectoriales de altísima calidad idénticas a los empaquetados por Expo (`FontAwesome5`, `Ionicons`, etc.).
2.  Incrusta este `path` obtenido en el molde en forma de púa invertida de nuestro marcador de mapa en memoria (como si fuera un archivo `.svg` temporal).
3.  Llama a la poderosa biblioteca gráfica **`sharp`** para convertir mágicamente esa capa vectorial infinita a un archivo `.png` pre-escalado a **90x90px** provisto de la mayor suavidad (anti-aliasing) disponible.

---

## 👨‍💻 ¿Cómo utilizo esta herramienta?

Solo requerirás poner en marcha esta tarea administrativa bajo dos escenarios específicos:
*   Si de pronto un diseñador o usuario solicitó **cambiar los esquemas de colores** de todos los pines (ej: pasar de "azul y verde" a "rojo y naranja" como colores primarios).
*   Si se agrega una **nueva Facultad o Categoría** en el código fuente de menús (`src/data/menuData.js`), la cual depende de un Ícono en particular que jamás ha sido "horneado" mediante nuestra herramienta.

### Paso 1: Configurar un Ícono Nuevo

Abre y revisa el archivo `scripts/generate_icons_v2.js`. Localiza el diccionario superior llamado `iconMappings`.  

Aquí dentro mapeamos el `id` propio de nuestra data, y del lado derecho referenciamos el Endpoint particular en la API de Iconify (Iconify URL Slug).

Por ejemplo, si el equipo decide añadir un nuevo subítem de "Ingeniería" portando el ícono `cogs` originario de `FontAwesome5`:

```javascript
const iconMappings = {
    // ... tus otros mapeos
    'f20': 'fa-solid/cogs' // Referencia del nuevo elemento (URL slug válido en Iconify)
};
```

### Paso 2: Ejecutar la Generación Local (Horneado)

Puesto que **`sharp`** es una maquinaria gráfica sumamente masiva y enfocada del lado del servidor (C++), existe una norma de oro: **Jamás debe importarse, requerirse ni registrarse directamente el el ecosistema del empaquetador móvil (`package.json`)**. De hacerse, la app fallará drásticamente en compilar. 

Para operar, sigue estos tres simples comandos provisionales:

```bash
# 1. Descargamos e instalamos `sharp` en el espacio de trabajo local SIN guardarlo en las dependencias permanentes de la app (--no-save)
npm install sharp --no-save

# 2. Invocamos nuestro motor de empaquetado personalizado
node scripts/generate_icons_v2.js

# 3. Y finalizamos el trabajo desinstalándolo para limpiar totalmente nuestra instancia reactiva.
npm uninstall sharp
```

¡Hecho! Observa cómo los nuevos y nítidos archivos `.png` acaban de aparecer automáticamente en la raíz destino de `src/assets/markers/`. React Native Mobile, por ende, ya está preparado para recibirlos nativamente sin errores de "clipping".
