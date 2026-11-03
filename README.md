# Pixel Avatar

Genera avatares pixelados a partir de cualquier texto y los descarga como SVG o PNG. El mismo texto produce siempre el mismo avatar. No usa servidor ni librerías externas.

## Uso

Abre `index.html` en el navegador, escribe un texto, elige la cuadrícula y pulsa **Descargar SVG** o **Descargar PNG**. El PNG mide 512 × 512 píxeles.

También puedes usar el generador desde tu propio código:

```js
const { generarAvatar, generarSVG } = require("./avatar.js");

const svg = generarSVG(generarAvatar("ana", 8), 256);
```

## Pruebas

Requiere Node.js 18 o superior.

```bash
node --test
```

## Licencia

MIT
