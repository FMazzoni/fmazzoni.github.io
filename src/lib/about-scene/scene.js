// @ts-nocheck -- plain JS ported from the About-scene prototype; its behaviour is checked by the Playwright run.
/* About-page scene. One cloud of points re-forms through five stages of the owner's work.
 * It plays through once when it comes into view, holding each stage long enough to read its
 * caption, and stops on the last; Pause, Previous and Next take over at any point.
 * data.bin (built outside this repo) holds:
 *   stars   Gaia DR3 field around SDSS J151905.90+500702.9 (target of ApJ 881, 49)
 *   geoid   EGM2008 undulation grid from FMazzoni/geoid-globe
 *   person  SYNTHETIC LiDAR-style scan of a parametric body waving. Not a real scan.
 * Generated here:
 *   walks   SIMULATED Brownian and Levy walkers (a simulation, as in the paper, not measured data)
 *   now     SYNTHETIC illustration: agents on parallel lanes merging back.
 */
/** Runs the scene inside `fig` (the About page's <figure class="scene">). Returns a function that stops it. */
export function mountScene(fig) {
  let stopped = false, resizeObs, seenObs, themeObs, unpaint;
  const lightScheme = matchMedia('(prefers-color-scheme: light)');
  const stillM = /[?&]still=(\d)/.exec(location.search);
  const STILL = stillM ? +stillM[1] - 1 : -1;
  const N = 4000;
  const cv = fig.querySelector('canvas');
  const ctx = cv.getContext('2d', { alpha: false });
  const prevB = fig.querySelector('.prev'), nextB = fig.querySelector('.next'), playB = fig.querySelector('.play');
  const countEl = fig.querySelector('.count'), capEl = fig.querySelector('.live');
  const caps = [...fig.querySelectorAll('.stills .c')].map(p => p.innerHTML);

  // Colours come from the page's own tokens, so the figure sits on the page in either theme: points
  // are the ink at several strengths over the background, labels the muted text, rules the line colour.
  const hex = (v, fallback) => { const m = /^#([0-9a-f]{6})$/i.exec((v || '').trim()); const h = m ? m[1] : fallback; return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const turbo = x => { // polynomial fit of Google's turbo; x clipped above the purple end
    x = 0.13 + 0.8 * x;
    const r = 0.1357 + x * (4.6154 + x * (-42.6603 + x * (132.1311 + x * (-152.9424 + x * 59.2864))));
    const g = 0.0914 + x * (2.1942 + x * (4.843 + x * (-14.185 + x * (4.2773 + x * 2.8296))));
    const b = 0.1067 + x * (12.6419 + x * (-60.582 + x * (110.3628 + x * (-89.9031 + x * 27.3482))));
    return `rgb(${[r, g, b].map(v => Math.round(255 * Math.min(1, Math.max(0, v)))).join()})`;
  };
  const TB = 12;
  let BG, MUTED, RULE, LINK;
  const COL = [];
  function paint() {
    const css = getComputedStyle(fig);
    const bg = hex(css.getPropertyValue('--bg'), '141516'), ink = hex(css.getPropertyValue('--ink'), 'e7e4dd');
    const rgb = c => `rgb(${c.join()})`, mix = a => rgb(ink.map((c, i) => Math.round(c * a + bg[i] * (1 - a))));
    BG = rgb(bg); MUTED = css.getPropertyValue('--muted').trim() || '#a29e96';
    RULE = css.getPropertyValue('--line').trim() || '#2b2d31'; LINK = css.getPropertyValue('--link').trim() || '#9dc4f2';
    COL.length = 0;
    COL.push(...[0.2, 0.32, 0.46, 0.62, 0.8, 1].map(mix)); // 0..5 ink levels
    COL.push(LINK); // 6
    for (let i = 0; i < TB; i++) COL.push(turbo(i / (TB - 1))); // 7..18
    COL.push(mix(0.12)); // 19: far side of the globe
    COL.push(BG); // 20: bot eyes, drawn last as holes
  }
  paint();
  const NB = COL.length, ORDER = [19, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 0, 1, 2, 3, 4, 5, 6, 20]; // ink after turbo so outlines sit on top

  let rs = 7; // seeded generator, so the simulation and the illustration are the same on every load
  const rnd = () => { rs |= 0; rs = rs + 0x6D2B79F5 | 0; let t = Math.imul(rs ^ rs >>> 15, 1 | rs); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  let W = 0, H = 0, dpr = 1, step = 1;
  const S = []; // stages
  const mk = (o) => Object.assign({ ex: new Float32Array(N), ey: new Float32Array(N), ez: new Float32Array(N), sz: new Float32Array(N).fill(1.6), cb: new Uint8Array(N), idx: new Uint16Array(N), hold: 0, yaw: () => 0, pitch: 0, dist: 0, ext: [1, 1], cover: false, delay: null, ann: null }, o);

  function build(buf) {
    const dv = new DataView(buf); let o = 0;
    const u16 = () => { const v = dv.getUint16(o, true); o += 2; return v; };
    // ---- 1 stars (real, Gaia DR3). Element 0 is the target. Elements past the catalogue repeat faint stars.
    const ns = u16(), sxy = new Uint16Array(buf.slice(o, o + ns * 4)); o += ns * 4;
    const sg = new Uint8Array(buf, o, ns); o += ns;
    const st = mk({ ext: [0.42, 0.42], cover: true, ann: annStars }); // the square inside the 0.6 deg field
    for (let e = 0; e < N; e++) {
      const k = e < ns ? e : ns - 1 - (e % (ns >> 1));
      const G = sg[k] / 20 + 8;
      st.ex[e] = -(sxy[2 * k] / 65535 * 1.2 - 0.6); // east to the left, as on the sky
      st.ey[e] = sxy[2 * k + 1] / 65535 * 1.2 - 0.6;
      st.sz[e] = Math.max(1, 5 - (G - 10) * 0.42);
      st.cb[e] = e === 0 ? 6 : G < 13 ? 5 : G < 15.5 ? 4 : G < 17.5 ? 3 : G < 19 ? 2 : 1;
    }
    st.sz[0] = 3;
    // ---- geoid (real, EGM2008), on a Fibonacci sphere matching tools/prep.py
    const ng = u16(), gh = new Uint8Array(buf, o, ng); o += ng;
    const nb = u16(), bll = new Uint16Array(buf.slice(o, o + nb * 4)); o += nb * 4; // country outlines (geoid-globe repo)
    const bh = new Uint8Array(buf, o, nb); o += nb;
    const ge = mk({ ext: [1.2, 1.2], dist: 4.5, pitch: 0.38, hold: 6.5, ann: annGeoid });
    const PHI = Math.PI * (3 - Math.sqrt(5)), K = 5000 / 6371000; // 5,000x exaggeration
    ge.h = new Float32Array(N);
    ge.out = new Uint8Array(N);
    for (let e = 0; e < N; e++) {
      let lat, lon, h;
      if (e < ng) { lat = Math.asin(1 - 2 * (e + 0.5) / ng); lon = (PHI * e) % 6.2832 - Math.PI; h = gh[e]; }
      else { const k = (e - ng) % nb; lat = (bll[2 * k] / 65535 * 180 - 90) * Math.PI / 180; lon = (bll[2 * k + 1] / 65535 * 360 - 180) * Math.PI / 180; h = bh[k]; ge.out[e] = 1; }
      h = h / 255 * 200 - 110; const r = 1 + K * h, z = Math.sin(lat);
      ge.h[e] = h;
      ge.ex[e] = r * Math.cos(lat) * Math.sin(lon); ge.ey[e] = r * z; ge.ez[e] = r * Math.cos(lat) * Math.cos(lon);
    }
    const L0 = 75 * Math.PI / 180, L1 = -15 * Math.PI / 180; // facing the India low, then turning to the Atlantic
    ge.yaw = t => -(L0 + (L1 - L0) * ease(Math.min(1, t / ge.hold)));
    // ---- person (SYNTHETIC: parametric body, simulated spinning-LiDAR rings, back half occluded)
    const np_ = u16(), pd = new Uint8Array(buf, o, np_ * 4); o += np_ * 4;
    const pe = mk({ ext: [0.9, 1.12], dist: 4, pitch: 0.2, hold: 3.05, yaw: () => -0.42 });
    const SX = 0.9, SY = 1.1, SZ = 5, EX = -0.4, EY = 1.53, sc = 1 / 1.02; // sensor and elbow, m
    pe.r = new Float32Array(N); pe.wave = new Uint8Array(N); pe.rx = new Float32Array(N); pe.ry = new Float32Array(N);
    for (let e = 0; e < N; e++) {
      const k = e < np_ ? e : (e * 7) % np_, q = 4 * k;
      const X = pd[q] / 255 * 3 - 1.5, Y = pd[q + 1] / 255 * 2, Z = pd[q + 2] / 255 * 6 - 3, fl = pd[q + 3];
      pe.rx[e] = X; pe.ry[e] = Y; pe.ez[e] = Z * sc; pe.wave[e] = fl === 1;
      const r = Math.hypot(X - SX, Y - SY, Z - SZ); // range from the sensor: nearer is brighter
      pe.cb[e] = fl === 2 ? (r < 5.2 ? 2 : 1) : r < 4.93 ? 5 : r < 5.05 ? 4 : 3;
      pe.sz[e] = fl === 2 ? 1.6 : 1.8;
    }
    pe.pose = t => { // forearm swings about the elbow in the frontal plane: 3.5 swings, then rests
      const a = 0.5 * Math.sin(t / pe.hold * 3.5 * 6.2832) * Math.min(1, t / 0.25) * Math.min(1, (pe.hold - t) / 0.25 + 0.0001);
      const c = Math.cos(a), si = Math.sin(a);
      for (let e = 0; e < N; e++) {
        let x = pe.rx[e], y = pe.ry[e];
        if (pe.wave[e]) { const dx = x - EX, dy = y - EY; x = EX + dx * c - dy * si; y = EY + dx * si + dy * c; }
        pe.ex[e] = (x - 0.15) * sc; pe.ey[e] = (y - 0.95) * sc;
      }
    };
    pe.ann = annTag; pe.tag = 'Illustration, not a real scan';
    // ---- walks (SIMULATED). Same speed, same number of samples; Levy step lengths ~ l^-2.
    const wk = mk({ ext: [1.14, 0.7], ann: annWalk, delay: new Float32Array(N) });
    const half = N >> 1; wk.u = new Float32Array(N); wk.v = new Float32Array(N); wk.cov = [];
    for (let w = 0; w < 2; w++) {
      let x = 0.5, y = 0.5, dx = 0, dy = 0, rem = 0; const v0 = 0.0065, seen = new Set();
      for (let i = 0; i < half; i++) {
        if (rem <= 0) {
          const a = rnd() * 6.2832; dx = Math.cos(a); dy = Math.sin(a);
          rem = w ? Math.min(1.2, v0 / Math.max(1e-4, rnd())) : v0;
        }
        x += dx * v0; y += dy * v0; rem -= v0;
        if (x < 0) { x = -x; dx = -dx; } if (x > 1) { x = 2 - x; dx = -dx; }
        if (y < 0) { y = -y; dy = -dy; } if (y > 1) { y = 2 - y; dy = -dy; }
        const e = w * half + i; wk.u[e] = x; wk.v[e] = y; wk.delay[e] = i / half;
        seen.add((x * 20 | 0) * 20 + (y * 20 | 0));
      }
      wk.cov.push(Math.round(seen.size / 4));
    }
    // ---- now (SYNTHETIC illustration): fig[data-variant] picks 'merge' (default) or 'plan'
    const nw = fig.dataset.variant === 'plan' ? planStage() : mergeStage();
    nw.ann = annNow; nw.tag = 'Illustration';
    S.push(st, pe, wk, ge, nw);
  }
  const sstep = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
  // Fan out, merge back: main forks into four agent lanes; each agent paints its lane at its own pace
  // (agent 3 stalls for a while), the lanes merge back, then main continues. Drawn left to right.
  function mergeStage() {
    // Four little bots, each built from ~35 of the cloud's points, stand on main, walk out onto their
    // lanes at their own pace (bot 3 stalls, its antenna tip blinking under a "?"), then merge back and
    // line up side by side on main.
    const s = mk({ ext: [1.5, 0.86] });
    const LY = [-0.62, -0.25, 0.25, 0.62], X0 = -1.45, XF = -0.9, XL = -0.6, XR = 0.36, XM = 0.62, X1 = 1.45;
    const TF = 0.55, DUR = [1.9, 2.7, 3.2, 2.3], TM = 0.35, V = 0.7;
    const ARR = [0.35, 0.5, 0.65, 0.8]; // when each bot reaches the fork
    const stall = (p, i) => i !== 2 ? p : p < 0.3 ? p * 1.7 : p < 0.66 ? 0.51 : 0.51 + (p - 0.66) / 0.34 * 0.49;
    const waiting = (i, t) => { if (i !== 2) return 0; const p = (t - ARR[i] - TF) / DUR[i]; return p > 0.3 && p < 0.66; };
    const fin = DUR.map((d, i) => ARR[i] + TF + d), order = [0, 1, 2, 3].sort((a, b) => fin[a] - fin[b]);
    const slot = []; order.forEach((i, r) => { slot[i] = 3 - r; }); // first to finish walks furthest
    s.lanes = LY;
    // bot template in pixel units (feet at y=0): role 0 body/head/antenna, 1 eye, 2 left foot, 3 right foot, 4 antenna tip, 5 "?"
    const BW = [4, 3, 4, 3], HW = [5, 4, 4, 5], AH = [1, 2, 1, 3], T = [];
    for (let i = 0; i < 4; i++) {
      const b = [[-1.2, 0, 2], [-0.6, 0, 2], [0.6, 0, 3], [1.2, 0, 3]];
      for (let y = 1; y <= 3; y++) for (let c = 0; c < BW[i]; c++) b.push([c - (BW[i] - 1) / 2, y, 0]);
      const ex = HW[i] === 5 ? 1 : 0.5;
      for (let y = 0; y < 3; y++) for (let c = 0; c < HW[i]; c++) { const x = c - (HW[i] - 1) / 2; b.push([x, 4.3 + y, y === 1 && Math.abs(Math.abs(x) - ex) < 0.01 ? 1 : 0]); }
      for (let a = 0; a < AH[i]; a++) b.push([0, 7.3 + a, 0]);
      const tp = 7.3 + AH[i]; b.push([0, tp, 4]);
      if (i === 2) [[1.5, 2.6], [2.4, 3.3], [3.3, 2.6], [3.0, 1.6], [2.4, 0.9], [2.4, -0.6]].forEach(([x, y]) => b.push([x, tp + y, 5])); // a '?' up and to the right
      T.push(b);
    }
    const nb = T.reduce((a, b) => a + b.length, 0), np = N - nb;
    const segs = [[0, -1, XF - X0], [1, -1, XM - XF], [2, -1, X1 - XM]];
    for (let i = 0; i < 4; i++) segs.push([3, i, 0.42], [4, i, XR - XL], [5, i, 0.4]);
    const tot = segs.reduce((a, g) => a + g[2], 0);
    s.k = new Uint8Array(N); s.ln = new Int8Array(N); s.u = new Float32Array(N); s.ox = new Float32Array(N); s.oy = new Float32Array(N); s.role = new Uint8Array(N); s.keep = new Uint8Array(N);
    let e = 0;
    for (const [k, i, len] of segs) { const n = Math.round(len / tot * np); for (let m = 0; m < n && e < np; m++, e++) { s.k[e] = k; s.ln[e] = i; s.u[e] = (m + rnd()) / n; s.oy[e] = (rnd() - 0.5) * 0.01; } }
    for (; e < np; e++) { s.k[e] = 1; s.ln[e] = -1; s.u[e] = rnd(); }
    T.forEach((b, i) => b.forEach(([x, y, r]) => { s.k[e] = 6; s.ln[e] = i; s.ox[e] = x; s.oy[e] = y; s.role[e] = r; s.keep[e] = 1; e++; }));
    const curve = (u, ya, yb, xa, xb) => [xa + (xb - xa) * u, ya + (yb - ya) * sstep(u)];
    let sp = 0.1;
    const botPos = (i, t) => { // [x, y, moving]
      const sx = XF - 0.06 - (i + 0.5) * sp, ex = XM + 0.06 + (slot[i] + 0.5) * sp;
      if (t < ARR[i]) { const q = t / ARR[i]; return [sx + (XF - sx) * q, 0, 1]; }
      if (t < ARR[i] + TF) { const [x, y] = curve((t - ARR[i]) / TF, 0, LY[i], XF, XL); return [x, y, 1]; }
      const p = (t - ARR[i] - TF) / DUR[i];
      if (p < 1) return [XL + (XR - XL) * stall(p, i), LY[i], waiting(i, t) ? 0 : 1];
      if (t < fin[i] + TM) { const [x, y] = curve((t - fin[i]) / TM, LY[i], 0, XR, XM); return [x, y, 1]; }
      const w = (ex - XM) / V, q = (t - fin[i] - TM) / w;
      return q < 1 ? [XM + (ex - XM) * q, 0, 1] : [ex, 0, 0];
    };
    const arrive = [0, 1, 2, 3].map(i => fin[i] + TM + (0.06 + (slot[i] + 0.5) * 0.18) / V);
    const TE = Math.max(...arrive); s.hold = TE + 0.7;
    s.pose = t => {
      const phone = step > 1, k = fit(s), px = phone ? 3.2 : 5.2, p = px * dpr / k; // bot pixel, CSS px
      sp = 6.3 * p;
      const bsz = px * 0.82 / (phone ? 1.15 : 1);
      for (let e = 0; e < N; e++) {
        const kd = s.k[e], i = s.ln[e], u = s.u[e]; let x, y, lit;
        if (kd === 6) {
          const [bx, by, mv] = botPos(i, t), r = s.role[e], ph = Math.sin(t * 13 + i);
          let oy = s.oy[e]; if (mv && r === 2) oy += Math.max(0, ph) * 0.9; if (mv && r === 3) oy += Math.max(0, -ph) * 0.9;
          s.ex[e] = bx + s.ox[e] * p; s.ey[e] = by + (oy + 0.5) * p;
          const wt = waiting(i, t);
          s.cb[e] = r === 1 ? 20 : r === 4 ? (wt && (t * 3.3 | 0) % 2 ? 0 : 5) : 5;
          s.sz[e] = r === 5 ? (wt ? bsz * 0.8 : 0) : r === 1 ? bsz * 0.9 : bsz;
          continue;
        }
        if (kd === 0) { x = X0 + (XF - X0) * u; y = 0; lit = 1; }
        else if (kd === 1) { x = XF + (XM - XF) * u; y = 0; lit = 1; }
        else if (kd === 2) { x = XM + (X1 - XM) * u; y = 0; lit = t > TE + 0.5 * u; }
        else if (kd === 3) { [x, y] = curve(u, 0, LY[i], XF, XL); lit = t > ARR[i] + TF * u; }
        else if (kd === 4) { x = XL + (XR - XL) * u; y = LY[i]; const a = botPos(i, t); lit = t > ARR[i] + TF && (a[0] >= x || t > fin[i]); }
        else { [x, y] = curve(u, LY[i], 0, XR, XM); lit = t > fin[i] + TM * u; }
        s.ex[e] = x; s.ey[e] = y + s.oy[e]; s.cb[e] = lit ? 3 : 0; s.sz[e] = lit ? 1.9 : 0.9;
      }
    };
    return s;
  }
  // Walkers get a plan: three agents work through a small dependency graph, each claiming a ready
  // task, finishing it and moving to the next ready one. Schedule is computed greedily below.
  function planStage() {
    const s = mk({ ext: [1.45, 0.86] });
    const P = [[-1.15, 0], [-0.5, -0.52], [-0.5, 0.02], [-0.5, 0.55], [0.15, -0.26], [0.15, 0.42], [0.72, 0.06], [1.2, 0.06]];
    const DEP = [[], [0], [0], [0], [1, 2], [2, 3], [4, 5], [6]], DUR = [0.5, 0.9, 0.55, 1.1, 0.75, 0.6, 0.55, 0.45], V = 2.4, NA = 3;
    const ED = []; DEP.forEach((d, j) => d.forEach(i => ED.push([i, j])));
    const done = P.map(() => Infinity), claim = P.map(() => Infinity), seg = [[], [], []], ag = [];
    for (let a = 0; a < NA; a++) ag.push({ at: 0, free: 0 });
    for (let guard = 0; guard < 60; guard++) {
      const a = ag.reduce((m, x, i) => x.free < ag[m].free ? i : m, 0), A = ag[a], t = A.free;
      if (A.free === Infinity) break;
      const ready = P.map((_, j) => j).filter(j => claim[j] === Infinity && DEP[j].every(i => done[i] <= t));
      if (!ready.length) { const nx = Math.min(...done.filter(d => d > t)); A.free = nx === Infinity ? Infinity : nx; continue; }
      const j = ready.reduce((m, q) => Math.hypot(P[q][0] - P[A.at][0], P[q][1] - P[A.at][1]) < Math.hypot(P[m][0] - P[A.at][0], P[m][1] - P[A.at][1]) ? q : m);
      const tr = Math.hypot(P[j][0] - P[A.at][0], P[j][1] - P[A.at][1]) / V;
      claim[j] = t; seg[a].push([t, t + tr, A.at, j]); done[j] = t + tr + DUR[j]; A.at = j; A.free = done[j];
    }
    s.hold = Math.max(...done) + 0.4;
    const NR = 120, NF = 70, KN = 50, ne = N - P.length * (NR + NF) - NA * KN;
    const elen = ED.map(([i, j]) => Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1]) - 0.2), etot = elen.reduce((a, b) => a + b, 0);
    s.k = new Uint8Array(N); s.id = new Uint8Array(N); s.u = new Float32Array(N); s.ox = new Float32Array(N);
    let e = 0;
    ED.forEach((_, q) => { const n = Math.round(elen[q] / etot * ne); for (let m = 0; m < n && e < ne; m++, e++) { s.k[e] = 0; s.id[e] = q; s.u[e] = (m + rnd()) / n; } });
    for (; e < ne; e++) { s.k[e] = 0; s.id[e] = 0; s.u[e] = rnd(); }
    P.forEach((p, j) => { for (let m = 0; m < NR + NF; m++, e++) { s.k[e] = m < NR ? 1 : 2; s.id[e] = j; s.u[e] = m < NR ? m / NR : Math.sqrt(rnd()) * 0.07; s.ox[e] = rnd() * 6.2832; } });
    for (let a = 0; a < NA; a++) for (let m = 0; m < KN; m++, e++) { s.k[e] = 3; s.id[e] = a; s.u[e] = 0.028 * Math.sqrt(rnd()); s.ox[e] = rnd() * 6.2832; }
    const where = (a, t) => { // agent position at t
      let x = P[0][0], y = P[0][1];
      for (const [t0, t1, i, j] of seg[a]) { if (t < t0) break; const q = clamp01((t - t0) / Math.max(1e-3, t1 - t0)); x = P[i][0] + (P[j][0] - P[i][0]) * q; y = P[i][1] + (P[j][1] - P[i][1]) * q; }
      return [x + (a - 1) * 0.045, y + (a - 1) * 0.03]; // small offset so agents at one node stay distinct
    };
    const trav = ED.map(() => Infinity); // when an agent first walked each edge
    seg.forEach(L => L.forEach(([t0, , i, j]) => { const q = ED.findIndex(d => d[0] === i && d[1] === j); if (q >= 0) trav[q] = Math.min(trav[q], t0); }));
    s.pose = t => {
      for (let e = 0; e < N; e++) {
        const k = s.k[e], id = s.id[e], u = s.u[e];
        if (k === 0) {
          const [i, j] = ED[id], dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], L = Math.hypot(dx, dy), w = (0.1 + u * (L - 0.2)) / L;
          s.ex[e] = P[i][0] + dx * w; s.ey[e] = P[i][1] + dy * w;
          const lit = t >= done[j] || t >= trav[id] + (u * (L - 0.2) + 0.1) / V;
          s.cb[e] = lit ? 3 : 1; s.sz[e] = lit ? 1.6 : 1.3;
        } else if (k < 3) {
          const r = k === 1 ? 0.1 : u, a = k === 1 ? u * 6.2832 : s.ox[e];
          s.ex[e] = P[id][0] + r * Math.cos(a); s.ey[e] = P[id][1] + r * Math.sin(a);
          const st = t >= done[id] ? 3 : t >= claim[id] ? 2 : DEP[id].every(i => done[i] <= t) ? 1 : 0; // done, claimed, ready, waiting
          s.cb[e] = k === 1 ? [0, 2, 5, 3][st] : st === 3 ? 4 : 0; s.sz[e] = k === 1 ? (st === 2 ? 2.2 : 1.8) : st === 3 ? 1.7 : 1.1; // claimed ring is brightest; done fills in
        } else { const [x, y] = where(id, t); s.ex[e] = x + u * Math.cos(s.ox[e]); s.ey[e] = y + u * Math.sin(s.ox[e]); s.cb[e] = 6; s.sz[e] = 2; }
      }
    };
    return s;
  }
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

  // Projection of one stage at hold-time t into screen arrays.
  const TX = new Float32Array(N), TY = new Float32Array(N), TS = new Float32Array(N), TB_ = new Uint8Array(N);
  const DX = new Float32Array(N), DY = new Float32Array(N), DS = new Float32Array(N), DB = new Uint8Array(N);
  const FX = new Float32Array(N), FY = new Float32Array(N), FS = new Float32Array(N), FB = new Uint8Array(N);
  function fit(s) {
    const g = s === S[3] && W / H < 1.25 ? 1.3 : 1; // keep room for the colour bar on square frames
    return (s.cover ? Math.max : Math.min)(W / (2 * s.ext[0] * g), H / (2 * s.ext[1] * g));
  }
  let ca = 1, sa = 0, cp = 1, sp = 0, kk = 1, dd = 0;
  function cam(s, t) { if (s.pose && s.posed !== t) { s.pose(t); s.posed = t; } const a = s.yaw(t); ca = Math.cos(a); sa = Math.sin(a); const p = s.pt ? s.pt(t) : s.pitch; cp = Math.cos(p); sp = Math.sin(p); kk = fit(s); dd = s.dist; }
  function proj(s, t, e, out, warm) { // world -> screen for one element; returns depth
    if (!warm) cam(s, t);
    const x = s.ex[e], y = s.ey[e], z = s.ez[e];
    const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const f = dd ? dd / (dd - z2) * kk : kk;
    out[0] = W / 2 + x1 * f; out[1] = H / 2 - y2 * f; return z2;
  }
  const tmp = [0, 0];
  function project(s, t, X, Y, Z, B) {
    const u = dpr * (step > 1 ? 1.15 : 1);
    cam(s, t);
    for (let j = 0; j < N; j++) {
      const e = s.idx[j], d = proj(s, t, e, tmp, 1);
      X[j] = tmp[0]; Y[j] = tmp[1];
      let sz = s.sz[e], b = s.cb[e];
      if (s === S[3]) { // geoid: colour by undulation, far side dark
        if (d < -0.05) { b = 19; sz = 0.9; } else if (s.out[e]) { b = 5; sz = 2.2; } else { b = 7 + Math.round(Math.min(1, Math.max(0, (s.h[e] + 106.5) / 193.8)) * (TB - 1)); sz = 2.4; }
      }
      Z[j] = sz * u; B[j] = b;
    }
  }
  function layoutWalk() {
    const s = S[2], wide = W / H > 1.25;
    s.ext = wide ? [1.14, 0.66] : [0.62, 1.3];
    for (let e = 0; e < N; e++) {
      const w = e >= N >> 1 ? 1 : 0, ox = wide ? (w ? 0.04 : -1.04) : -0.5, oy = wide ? -0.5 : (w ? -1.08 : 0.2);
      s.ex[e] = ox + s.u[e]; s.ey[e] = oy + s.v[e]; s.cb[e] = w ? 4 : 3;
    }
  }
  function hil(x, y) { let d = 0; for (let s = 512; s > 0; s >>= 1) { const rx = (x & s) > 0 ? 1 : 0, ry = (y & s) > 0 ? 1 : 0; d += s * s * ((3 * rx) ^ ry); if (!ry) { if (rx) { x = 1023 - x; y = 1023 - y; } const q = x; x = y; y = q; } } return d; }
  function ranks() { // point j takes the j-th element along a Hilbert curve in every stage, so morphs stay local
    const key = new Float64Array(N), ids = new Uint16Array(N);
    for (const s of S) {
      cam(s, 0); for (let e = 0; e < N; e++) { proj(s, 0, e, tmp, 1); const qx = Math.max(0, Math.min(1023, tmp[0] / W * 1023 | 0)), qy = Math.max(0, Math.min(1023, tmp[1] / H * 1023 | 0)); key[e] = hil(qx, qy) + e / N; ids[e] = e; }
      ids.sort((a, b) => key[a] - key[b]); s.idx.set(ids);
      s.keepJ = new Uint8Array(N); if (s.keep) for (let j = 0; j < N; j++) s.keepJ[j] = s.keep[ids[j]];
    }
  }

  // ---- annotations (only where they carry meaning)
  let fs = 13;
  function text(t, x, y, al, it) { ctx.font = `${it ? 'italic ' : ''}${fs}px "Libertinus Web", "DejaVu Serif", serif`; ctx.textAlign = al || 'left'; ctx.fillText(t, x, y); }
  function annStars(s) {
    proj(s, 0, 0, tmp); const [x, y] = tmp, r = 9 * dpr;
    ctx.strokeStyle = LINK; ctx.lineWidth = dpr; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke();
    ctx.fillStyle = LINK; text('J1519+5007', x + r + 5 * dpr, y + fs * 0.35);
    const k = fit(s), m = 12 * dpr, len = 0.1 * k; // 0.1 degree scale bar
    ctx.fillStyle = MUTED; ctx.fillRect(m, H - m - fs * 1.4, len, dpr); text('6′', m + len / 2, H - m, 'center');
    const ax = W - m - 4 * dpr, ay = H - m - fs * 1.4, al = 22 * dpr; // north up, east left
    ctx.fillRect(ax - al, ay, al, dpr); ctx.fillRect(ax - dpr, ay - al, dpr, al);
    text('N', ax, ay - al - 4 * dpr, 'center'); text('E', ax - al - 4 * dpr, ay + fs * 0.35, 'right');
  }
  function annWalk(s) {
    const wide = W / H > 1.25, k = fit(s);
    ctx.strokeStyle = RULE; ctx.lineWidth = dpr; ctx.fillStyle = MUTED;
    const lab = ['Brownian', 'Lévy'];
    for (let w = 0; w < 2; w++) {
      const ox = wide ? (w ? 0.04 : -1.04) : -0.5, oy = wide ? -0.5 : (w ? -1.08 : 0.2);
      const x = W / 2 + ox * k, y = H / 2 - (oy + 1) * k;
      ctx.strokeRect(x, y, k, k);
      text(`${lab[w]}, ${s.cov[w]}%`, x, y + k + fs * 1.3);
    }
  }
  function annGeoid() {
    const m = 12 * dpr, bw = Math.min(130 * dpr, W * 0.3), bh = 6 * dpr, y = H - m - fs * 1.5;
    for (let i = 0; i < TB; i++) { ctx.fillStyle = COL[7 + i]; ctx.fillRect(m + i * bw / TB, y, bw / TB + 0.5, bh); }
    ctx.fillStyle = MUTED; text('−106 m', m, H - m); text('+87 m', m + bw, H - m, 'right');
  }
  function annTag(s) { ctx.fillStyle = MUTED; text(s.tag, W - 12 * dpr, 12 * dpr + fs, 'right', true); } // top right, clear of the figure
  function annNow(s) {
    annTag(s);
    if (!s.lanes) return;
    const k = fit(s), X = x => W / 2 + x * k, Y = y => H / 2 - y * k; ctx.fillStyle = MUTED;
    text('main', X(-1.45), Y(0) + fs * 1.25);
    s.lanes.forEach((y, i) => text(`agent ${i + 1}`, X(-0.56), Y(y) + fs * 1.25)); // below the line, clear of the bots
  }

  // ---- state and loop
  let cur = 0, P = 1, holdT = 0, raf = 0, last = 0, visible = true, D = 1.2;
  // Autoplay: after a stage's own motion ends, its caption stays up READ_S more seconds (at least
  // MIN_STAGE_S per stage in all) before the next morph. Time only counts while the figure is visible.
  const READ_S = 3.5, MIN_STAGE_S = 5;
  let auto = STILL < 0;
  const lastStage = () => cur === S.length - 1;
  const dwell = () => Math.max(S[cur].hold + READ_S, MIN_STAGE_S);
  const stats = window.__sceneStats = { frames: 0, ms: 0, max: 0 };
  function draw(annA) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    const cnt = new Int32Array(NB + 1), ord = draw.ord || (draw.ord = new Uint16Array(N));
    const KJ = S[cur].keepJ, vis = j => step < 2 || !(j & 1) || KJ[j]; // phone: half the points, but whole bots
    for (let j = 0; j < N; j++) if (vis(j)) cnt[DB[j] + 1]++;
    for (let b = 0; b < NB; b++) cnt[b + 1] += cnt[b];
    const pos = cnt.slice(); for (let j = 0; j < N; j++) if (vis(j)) ord[pos[DB[j]]++] = j;
    for (const b of ORDER) {
      if (cnt[b + 1] === cnt[b]) continue;
      ctx.fillStyle = COL[b]; let big = false;
      for (let k = cnt[b]; k < cnt[b + 1]; k++) {
        const j = ord[k], s = DS[j];
        if (s > 2.6 * dpr) { big = true; continue; }
        ctx.fillRect(DX[j] - s / 2, DY[j] - s / 2, s, s);
      }
      if (big) {
        ctx.beginPath();
        for (let k = cnt[b]; k < cnt[b + 1]; k++) { const j = ord[k], s = DS[j]; if (s > 2.6 * dpr) { ctx.moveTo(DX[j] + s / 2, DY[j]); ctx.arc(DX[j], DY[j], s / 2, 0, 6.2832); } }
        ctx.fill();
      }
    }
    if (annA > 0 && S[cur].ann) { ctx.globalAlpha = annA; S[cur].ann(S[cur], Math.min(holdT, S[cur].hold)); ctx.globalAlpha = 1; }
  }
  function render() {
    const t0 = performance.now(), s = S[cur];
    project(s, Math.min(holdT, s.hold), TX, TY, TS, TB_);
    if (P < 1) {
      const md = s.delay ? 0.62 : 0.3;
      for (let j = 0; j < N; j++) {
        const dl = s.delay ? s.delay[s.idx[j]] * md : j / N * md;
        const q = ease(Math.max(0, Math.min(1, (P - dl) / (1 - md))));
        DX[j] = FX[j] + (TX[j] - FX[j]) * q; DY[j] = FY[j] + (TY[j] - FY[j]) * q;
        DS[j] = FS[j] + (TS[j] - FS[j]) * q; DB[j] = q < 0.5 ? FB[j] : TB_[j];
      }
    } else { DX.set(TX); DY.set(TY); DS.set(TS); DB.set(TB_); }
    draw(P < 1 ? 0 : Math.min(1, holdT / 0.35));
    const ms = performance.now() - t0; stats.frames++; stats.ms += ms; stats.max = Math.max(stats.max, ms);
  }
  const busy = () => P < 1 || holdT < Math.max(S[cur].hold, 0.35) || (auto && !lastStage());
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) { last = 0; return; } // paused; resumes where it stopped
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    if (P < 1) P = Math.min(1, P + dt / D); else holdT += dt;
    if (auto && P >= 1 && !lastStage() && holdT >= dwell()) go(cur + 1);
    else if (auto && lastStage() && holdT >= S[cur].hold) { auto = false; ui(); }
    render();
    if (busy()) raf = requestAnimationFrame(frame); else last = 0;
  }
  const kick = () => { if (!stopped && !raf && visible && !document.hidden && busy()) raf = requestAnimationFrame(frame); };
  function go(k) {
    if (k < 0 || k >= S.length || k === cur) return;
    FX.set(DX); FY.set(DY); FS.set(DS); FB.set(DB); // morph from whatever is on screen now
    cur = k; P = 0; holdT = 0; D = S[k].delay ? 1.8 : 1.2; ui(); kick();
  }
  function ui() {
    prevB.disabled = cur === 0; nextB.disabled = cur === S.length - 1;
    playB.textContent = auto ? 'Pause' : lastStage() ? 'Play again' : 'Play';
    countEl.textContent = `${cur + 1} of ${S.length}`; capEl.innerHTML = caps[cur];
  }
  function resize() {
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.width = Math.round(r.width * dpr); H = cv.height = Math.round(r.height * dpr);
    step = r.width < 560 ? 2 : 1; fs = Math.round(Math.max(11, Math.min(13, r.width / 46)) * dpr);
    layoutWalk(); ranks(); P = 1; render(); kick();
  }

  fetch('/about-scene/data.bin').then(r => { if (!r.ok) throw r.status; return r.arrayBuffer(); }).then(async buf => {
    build(buf);
    try { await Promise.race([document.fonts.load(`13px "Libertinus Web"`), new Promise(r => setTimeout(r, 1500))]); } catch { /* fonts optional */ }
    if (STILL >= 0) { cur = STILL; holdT = STILL === 4 ? S[4].hold * 0.5 : 0.35; } // stage 5 still: mid-run, agents visible
    resize(); ui();
    if (stopped) return;
    resizeObs = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = 0; resize(); });
    resizeObs.observe(cv);
    seenObs = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; if (visible) kick(); });
    seenObs.observe(cv);
    document.addEventListener('visibilitychange', kick);
    // The page theme can change under the figure (the toggle, or the system setting).
    const repaint = () => { paint(); render(); };
    themeObs = new MutationObserver(repaint);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    lightScheme.addEventListener('change', repaint);
    unpaint = () => lightScheme.removeEventListener('change', repaint);
    // Stepping by hand takes over from autoplay.
    prevB.addEventListener('click', () => { auto = false; go(cur - 1); ui(); });
    nextB.addEventListener('click', () => { auto = false; go(cur + 1); ui(); });
    playB.addEventListener('click', () => {
      auto = !auto;
      if (auto && lastStage()) go(0);
      ui(); kick();
    });
    fig.dataset.ready = '1';
  }).catch(() => fig.classList.remove('js'));
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    resizeObs?.disconnect();
    seenObs?.disconnect();
    themeObs?.disconnect();
    unpaint?.();
    document.removeEventListener('visibilitychange', kick);
  };
}
