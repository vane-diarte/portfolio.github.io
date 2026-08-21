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

En los casos de estudio hay figuras que todavía no tienen su archivo. En la
página se ven como un recuadro punteado que dice **«Falta …»** con el nombre
exacto que hay que usar, por ejemplo `images/work/backoffice-wf-informes.png`.

Para completarlas **no hace falta tocar el HTML**: alcanza con guardar la
imagen en `images/work/` con ese nombre y ese formato. El recuadro punteado
desaparece solo y la figura queda con su epígrafe y su visor ampliado.

Las que faltan hoy en `proyectos/backoffice-banca.html`:

| Archivo | Qué imagen va |
| --- | --- |
| `backoffice-personas.png` | Las user personas de los siete roles |
| `backoffice-roles.png` | El mapa de roles y permisos (o el journey map) |
| `backoffice-wf-empresas.png` | Wireframe del listado de empresas (banca empresa) |
| `backoffice-wf-seleccion.png` | Wireframe de la tabla con selección múltiple y acciones en lote |
| `backoffice-wf-confirmacion.png` | Wireframe del diálogo de confirmación sobre el listado |
| `backoffice-wf-dispositivo.png` | Wireframe de la ficha de dispositivo seguro |
| `backoffice-wf-informes.png` | Wireframe del tablero de informes con los indicadores |
| `backoffice-design-system.png` | Los componentes del design system |
| `backoffice-prototipo.png` | Vista general del prototipo V2 |

Exportar desde Figma en PNG a 2x, con un ancho de entre 1600 y 2000 px.

## Accesibilidad y rendimiento

- Sin dependencias externas salvo las tipografías de Google Fonts.
- Respeta `prefers-reduced-motion`: las animaciones se desactivan solas.
- Navegación por teclado y `aria-label` en los controles interactivos.
- Imágenes con `loading="lazy"` fuera del primer pliegue.
