// @ts-nocheck -- plain JS shared by the About scene and the home figure; checked by the Playwright run.
/* Shared by the About scene (scene.js) and the home page's Fig. 1 (hello.js). */

/** Theme colours from the page's own tokens on `el`: the background, and ink mixed over it at strength a. */
export function inkOver(el) {
  const css = getComputedStyle(el);
  const hex = (v, fallback) => { const m = /^#([0-9a-f]{6})$/i.exec((v || '').trim()); const h = m ? m[1] : fallback; return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const bg = hex(css.getPropertyValue('--bg'), '121519'), ink = hex(css.getPropertyValue('--ink'), 'e4e7ec');
  const rgb = c => `rgb(${c.join()})`;
  const mixc = a => ink.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
  return { css, hex, light: bg[0] > 128, bg: rgb(bg), mixc, mix: a => rgb(mixc(a)) };
}

/**
 * The person section of data.bin, starting at byte `o`: the owner waving at a 160x60 depth LiDAR
 * (2020), as `frames` frames of `M` points in scan order, then floor returns. Metres, feet at y=0,
 * z toward the sensor; `y` here is re-centred on the body. Returns the decoders and where it ends.
 */
export function readPerson(buf, o) {
  const dv = new DataView(buf);
  const M = dv.getUint16(o, true), frames = dv.getUint8(o + 2), fps = dv.getUint8(o + 3); o += 4;
  const pts = new Uint8Array(buf, o, frames * M * 3); o += frames * M * 3;
  const nfl = dv.getUint16(o, true), floor = new Uint8Array(buf, o + 2, nfl * 3); o += 2 + nfl * 3;
  const qx = v => v / 255 * 2.4 - 1.2, qy = v => v / 255 * 2 - 0.98;
  return { M, frames, fps, pts, nfl, floor, qx, qy, end: o };
}

/** Byte offset of the person section: data.bin holds stars, then the geoid and its outlines, then the person. */
export function personOffset(buf) {
  const dv = new DataView(buf); let o = 0;
  const u16 = () => { const v = dv.getUint16(o, true); o += 2; return v; };
  const ns = u16(); o += ns * 6; // x, y, G, BP-RP
  const ng = u16(); o += ng;
  const nb = u16(); o += nb * 5;
  return o;
}
