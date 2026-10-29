// @ts-nocheck -- plain JS, like scene.js; its behaviour is checked by the Playwright run.
/* Home page Fig. 1: the owner's real LiDAR wave, drawn live from the About scene's data.bin so it is
 * sharp at any pixel density and in the page's own ink. Plays the wave at the sensor's 9 fps, rests,
 * and waves WAVES times while on screen, then settles; hovering waves again. Under reduced motion it
 * draws one frame with the hand up and stops. */
import { inkOver, personOffset, readPerson } from './points.js';

const YAW = -0.3, PITCH = 0.12, DIST = 4, EXT = [0.62, 1.04], REST_S = 3, STILL_FRAME = 11, WAVES = 3;

/** Draws into `fig`'s canvas. Resolves once the first frame is up; returns a function that stops it. */
export async function mountHello(fig) {
  const cv = fig.querySelector('canvas'), ctx = cv.getContext('2d', { alpha: false });
  const buf = await fetch('/about-scene/data.bin').then(r => { if (!r.ok) throw r.status; return r.arrayBuffer(); });
  const p = readPerson(buf, personOffset(buf));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ca = Math.cos(YAW), sa = Math.sin(YAW), cp = Math.cos(PITCH), sp = Math.sin(PITCH);
  const loopS = p.frames / p.fps + REST_S;
  let W = 0, H = 0, dpr = 1, col, raf = 0, visible = false, shown = -1, t0 = 0, stopped = false;

  const paint = () => { const c = inkOver(fig); col = { bg: c.bg, lv: [c.mix(0.62), c.mix(0.8), c.mix(1)] }; shown = -1; };
  function draw(k) {
    if (k === shown) return; shown = k;
    ctx.fillStyle = col.bg; ctx.fillRect(0, 0, W, H);
    const s = Math.min(W / (2 * EXT[0]), H / (2 * EXT[1])), sz = Math.max(1, s * 0.0085), base = k * p.M * 3;
    for (let lv = 0; lv < 3; lv++) { // nearer the sensor is darker ink, as in the About scene
      ctx.fillStyle = col.lv[lv];
      for (let i = 0; i < p.M; i++) {
        const q = base + i * 3, x = p.qx(p.pts[q]), y = p.qy(p.pts[q + 1]), z = p.qx(p.pts[q + 2]);
        if ((z > 0.06 ? 2 : z > -0.04 ? 1 : 0) !== lv) continue;
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = DIST / (DIST - z2) * s;
        ctx.fillRect(W / 2 + x1 * f - sz / 2, H / 2 - y2 * f - sz / 2, sz, sz);
      }
    }
  }
  const settled = t => t >= WAVES * loopS - REST_S; // after the last wave it rests for good
  const frameAt = t => settled(t) ? p.frames - 1 : Math.min(p.frames - 1, Math.floor((t % loopS) * p.fps));
  function tick(now) {
    raf = 0;
    if (stopped || !visible || document.hidden) return;
    if (!t0) t0 = now;
    const t = (now - t0) / 1000;
    draw(frameAt(t));
    if (!settled(t)) raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
  const again = () => { if (t0 && settled((performance.now() - t0) / 1000)) { t0 = 0; kick(); } };
  function resize() {
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    dpr = Math.min(3, window.devicePixelRatio || 1);
    W = cv.width = Math.round(r.width * dpr); H = cv.height = Math.round(r.height * dpr);
    shown = -1; draw(still ? STILL_FRAME : frameAt(t0 ? (performance.now() - t0) / 1000 : 0));
  }

  paint(); resize();
  const ro = new ResizeObserver(resize); ro.observe(cv);
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; kick(); }); io.observe(cv);
  const repaint = () => { paint(); resize(); };
  const mo = new MutationObserver(repaint); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const scheme = matchMedia('(prefers-color-scheme: light)'); scheme.addEventListener('change', repaint);
  document.addEventListener('visibilitychange', kick);
  fig.addEventListener('pointerenter', again);
  return () => {
    fig.removeEventListener('pointerenter', again);
    stopped = true; cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect(); mo.disconnect();
    scheme.removeEventListener('change', repaint); document.removeEventListener('visibilitychange', kick);
  };
}
