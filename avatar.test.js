const test = require("node:test");
const assert = require("node:assert");
const { hashFNV1a, generarAvatar, generarSVG } = require("./avatar.js");

test("el mismo texto produce el mismo avatar", () => {
  assert.deepStrictEqual(generarAvatar("ana"), generarAvatar("ana"));
});

test("textos distintos producen avatares distintos", () => {
  assert.notDeepStrictEqual(generarAvatar("ana").matriz, generarAvatar("luis").matriz);
});

test("el hash admite emojis y texto vacío", () => {
  assert.strictEqual(typeof hashFNV1a("🌅"), "number");
  assert.strictEqual(hashFNV1a(""), 0x811c9dc5);
});

test("la matriz es simétrica y del tamaño pedido", () => {
  for (const tamano of [5, 8, 13]) {
    const { matriz } = generarAvatar("simetria", tamano);
    assert.strictEqual(matriz.length, tamano);
    for (const fila of matriz) {
      assert.strictEqual(fila.length, tamano);
      assert.deepStrictEqual(fila, [...fila].reverse());
    }
  }
});

test("rechaza tamaños no válidos", () => {
  assert.throws(() => generarAvatar("x", 2), RangeError);
  assert.throws(() => generarAvatar("x", 33), RangeError);
  assert.throws(() => generarAvatar("x", 4.5), RangeError);
});

test("el SVG tiene una celda por cada píxel activo", () => {
  const avatar = generarAvatar("svg", 8);
  const svg = generarSVG(avatar, 128);
  const activas = avatar.matriz.flat().filter(Boolean).length;
  assert.strictEqual(svg.match(/width="1"/g)?.length ?? 0, activas);
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="128"/);
});
