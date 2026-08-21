# Portafolio — Vanessa Diarte

Sitio personal de Vanessa Diarte: diseñadora gráfica senior y especialista en UX/UI.

**En vivo:** https://vane-diarte.github.io/portfolio.github.io/

## Cómo está hecho

Sitio estático, sin frameworks ni build step. Solo tres archivos:

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | Todo el contenido y la estructura de la página |
| `assets/css/style.css` | Estilos, tokens de color y tema claro/oscuro |
| `assets/js/app.js` | Interacciones (tema, menú, lightbox, animaciones) |

Las imágenes viven en `images/` (logos de herramientas y trabajos anteriores) y
`images/work/` (proyectos recientes).

## Verlo en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
npx http-server -p 8080
# luego abrir http://127.0.0.1:8080
```

## Editar el contenido

Todo el texto está en `index.html`, en español y ordenado por secciones
(`#inicio`, `#servicios`, `#proyectos`, `#sobre-mi`, `#herramientas`, `#contacto`).

Para cambiar los colores de la marca, editar las variables al inicio de
`assets/css/style.css`:

```css
:root {
  --accent: #c83d1d;   /* color principal (tema claro) */
  --accent-2: #1c7f96; /* color secundario */
}
```

El tema oscuro usa el mismo bloque bajo `:root[data-theme="dark"]`.

### Agregar un proyecto

Copiar un bloque `<article class="project">` dentro de `<div class="work">`, o uno
`<article class="mini">` dentro de `<div class="work-grid">` para los proyectos
secundarios. Las imágenes con `data-full` y `data-caption` se abren en el visor
ampliado automáticamente.

### Subir una imagen que falta en un caso de estudio

Las figuras se escriben siempre con su `<img>` real apuntando al nombre
definitivo. Si ese archivo no está en `images/work/`, la página muestra en su
lugar un recuadro punteado que dice **«Falta …»** con el nombre exacto que
espera.

Por eso agregar una imagen **no requiere tocar el HTML**: alcanza con guardarla
en `images/work/` con ese nombre. El recuadro desaparece solo y la figura queda
con su epígrafe y su visor ampliado.

Exportar desde Figma en PNG a 2x, con un ancho de entre 1600 y 2000 px.

> **Antes de exportar:** el caso del sistema interno está bajo acuerdo de
> confidencialidad y escrito en términos genéricos a propósito. Conviene
> revisar que en la captura no queden nombres de módulos del cliente, datos de
> personas ni marcas, y reemplazarlos por datos de ejemplo en Figma antes de
> exportar.

## Accesibilidad y rendimiento

- Sin dependencias externas salvo las tipografías de Google Fonts.
- Respeta `prefers-reduced-motion`: las animaciones se desactivan solas.
- Navegación por teclado y `aria-label` en los controles interactivos.
- Imágenes con `loading="lazy"` fuera del primer pliegue.
