/* Generador determinista de avatares pixelados: el mismo texto da el mismo avatar. */
(function (raiz) {
  "use strict";

  function hashFNV1a(texto) {
    let hash = 0x811c9dc5;
    for (const caracter of String(texto)) {
      hash ^= caracter.codePointAt(0);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  function crearAleatorio(semilla) {
    let estado = semilla >>> 0;
    return function () {
      estado = (estado + 0x6d2b79f5) >>> 0;
      let t = estado;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generarAvatar(texto, tamano) {
    const n = tamano || 8;
    if (!Number.isInteger(n) || n < 3 || n > 32) {
      throw new RangeError("El tamaño debe ser un entero entre 3 y 32");
    }
    const aleatorio = crearAleatorio(hashFNV1a(texto));
    const tono = Math.floor(aleatorio() * 360);
    const matriz = [];
    const mitad = Math.ceil(n / 2);

    for (let fila = 0; fila < n; fila++) {
      const izquierda = [];
      for (let col = 0; col < mitad; col++) {
        izquierda.push(aleatorio() < 0.5);
      }
      const derecha = izquierda.slice(0, Math.floor(n / 2)).reverse();
      matriz.push(izquierda.concat(derecha));
    }

    return {
      matriz: matriz,
      color: "hsl(" + tono + ", 65%, 50%)",
      fondo: "hsl(" + tono + ", 40%, 92%)",
    };
  }

  function generarSVG(avatar, lado) {
    const n = avatar.matriz.length;
    const px = lado || 256;
    const celdas = [];
    avatar.matriz.forEach(function (fila, y) {
      fila.forEach(function (activa, x) {
        if (activa) {
          celdas.push('<rect x="' + x + '" y="' + y + '" width="1" height="1"/>');
        }
      });
    });
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + px + '" height="' + px +
      '" viewBox="0 0 ' + n + " " + n + '" shape-rendering="crispEdges">' +
      '<rect width="' + n + '" height="' + n + '" fill="' + avatar.fondo + '"/>' +
      '<g fill="' + avatar.color + '">' + celdas.join("") + "</g></svg>"
    );
  }

  const api = { hashFNV1a: hashFNV1a, generarAvatar: generarAvatar, generarSVG: generarSVG };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    raiz.PixelAvatar = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
