// The 404 page's random walk. A walker steps on a square lattice until it gets home or about 15 s
// pass; on wide screens the lattice is drawn in perspective and sags where the walk lingers, on
// narrow ones it is a flat plot. It pauses off-screen and in hidden tabs, and under reduced motion it
// draws the finished walk at once.

type Point = [number, number];

export interface WalkView {
	canvas: HTMLCanvasElement;
	/** Receives the sentence that describes the walk as it runs and when it ends. */
	setNote: (text: string) => void;
	/** Receives whether a walk is running, to disable "Walk again". */
	setRunning: (running: boolean) => void;
}

const RUNNING_NOTE = 'In two dimensions a random walk always finds its way home, though it can take a while.';
const MAX_STEPS = 150;
const MAX_REACH = 6;
const MIN_STEPS = 40;
const MAX_MS = 15000;

// Perspective camera, in lattice units.
const W = 960, H = 360, R = 13, ST = 4, N = 2 * R * ST + 1, V0 = -4, SAG = 1.6, F = 330, D = 19, HC = 6.5, HZ = -40;
const FLAT = 440;

function rng(seed: number): () => number {
	let s = seed | 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A walk that comes home within MAX_STEPS without straying more than MAX_REACH from it. */
function findWalk(seed: { next: number }): Point[] {
	for (;;) {
		const r = rng(seed.next++);
		const walk: Point[] = [[0, 0]];
		let x = 0, y = 0;
		for (let i = 0; i < MAX_STEPS; i++) {
			const d = (r() * 4) | 0;
			x += [1, -1, 0, 0][d];
			y += [0, 0, 1, -1][d];
			walk.push([x, y]);
			if (Math.abs(x) > MAX_REACH || Math.abs(y) > MAX_REACH) break;
			if (!x && !y) {
				if (walk.length > MIN_STEPS) return walk;
				break;
			}
		}
	}
}

/** Starts a walk; the returned function stops it, and its `again` starts a new walk. */
export function startWalk(view: WalkView): (() => void) & { again: () => void } {
	const { canvas } = view;
	const cx = canvas.getContext('2d');
	if (!cx) return Object.assign(() => {}, { again: () => {} });
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	const narrow = matchMedia('(max-width: 600px)');
	const seed = { next: 79 };

	const target = new Float32Array(N * N), shown = new Float32Array(N * N);
	const at = (u: number, v: number) => Math.round((v + R) * ST) * N + Math.round((u + R) * ST);
	const sag = (t: number) => -SAG * (1 - Math.exp(-t / 2.2));
	const project = (u: number, v: number, h: number): Point => [W / 2 + (F * u) / (D + v), HZ + (F * (HC - h)) / (D + v)];
	function bump(a: number, b: number) {
		const r = 3 * ST;
		for (let j = -r; j <= r; j++)
			for (let i = -r; i <= r; i++) {
				const u = a + i / ST, v = b + j / ST;
				if (Math.abs(u) > R || Math.abs(v) > R) continue;
				target[at(u, v)] += Math.exp(-((i / ST) ** 2 + (j / ST) ** 2) / 1.1);
			}
	}

	let walk: Point[] = [[0, 0]];
	let step = 0, done = true, settling = false, raf = 0, onScreen = true, active = 0, lastStep = 0, prev = 0;
	let quadrant = 0; // where the "home" label goes: the quadrant the walk visits least
	const colour: Record<string, string> = {};

	const visible = () => onScreen && !document.hidden;
	function readTokens() {
		const style = getComputedStyle(document.documentElement);
		for (const name of ['--bg', '--ink', '--muted', '--lat', '--latmaj', '--path', '--home', '--serif'])
			colour[name] = style.getPropertyValue(name).trim();
	}
	function size() {
		const w = canvas.clientWidth || W;
		const dpr = Math.min(devicePixelRatio || 1, 2);
		const flat = narrow.matches;
		const h = flat ? w : (w * H) / W;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.height = `${h}px`;
		const k = (dpr * w) / (flat ? FLAT : W);
		cx!.setTransform(k, 0, 0, k, 0, 0);
	}

	function drawLattice(c: CanvasRenderingContext2D) {
		c.fillStyle = colour['--bg'];
		c.fillRect(0, 0, W, H);
		c.lineWidth = 1;
		for (const major of [false, true]) {
			c.strokeStyle = colour[major ? '--latmaj' : '--lat'];
			c.beginPath();
			for (let k = -R; k <= R; k++) {
				if ((k % 5 === 0) !== major) continue;
				for (const across of [false, true])
					for (let s = 0; s < N; s += 2) {
						const t = s / ST - R, u = across ? t : k, v = across ? k : t;
						const [X, Y] = project(u, v, sag(shown[at(u, v)]));
						if (s) c.lineTo(X, Y);
						else c.moveTo(X, Y);
					}
			}
			c.stroke();
		}
		const onLattice = ([x, y]: Point) => project(x, y + V0, sag(shown[at(x, y + V0)]));
		c.strokeStyle = colour['--path'];
		c.lineWidth = 2;
		c.lineJoin = 'round';
		c.beginPath();
		for (let i = 0; i <= step; i++) {
			const [X, Y] = onLattice(walk[i]);
			if (i) c.lineTo(X, Y);
			else c.moveTo(X, Y);
		}
		c.stroke();
		const [hx, hy] = onLattice([0, 0]);
		c.fillStyle = colour['--home'];
		c.beginPath();
		c.arc(hx, hy, 5, 0, 7);
		c.fill();
		const right = quadrant & 1, down = quadrant & 2;
		c.strokeStyle = colour['--muted'];
		c.lineWidth = 1;
		c.beginPath();
		c.moveTo(hx + (right ? 6 : -6), hy + (down ? 5 : -5));
		c.lineTo(hx + (right ? 36 : -116), hy + (down ? 40 : -57));
		c.stroke();
		c.fillStyle = colour['--ink'];
		c.font = `italic 17px ${colour['--serif']}`;
		c.fillText('home', hx + (right ? 40 : -150), hy + (down ? 56 : -62));
		if (!done) {
			const [wx, wy] = onLattice(walk[step]);
			c.fillStyle = colour['--path'];
			c.beginPath();
			c.arc(wx, wy, 4, 0, 7);
			c.fill();
		}
	}

	function drawFlat(c: CanvasRenderingContext2D) {
		const u = 24, r = 8, mid = FLAT / 2;
		c.fillStyle = colour['--bg'];
		c.fillRect(0, 0, FLAT, FLAT);
		for (let i = -r; i <= r; i++) {
			c.strokeStyle = colour[i % 5 ? '--lat' : '--latmaj'];
			c.lineWidth = 1;
			c.beginPath();
			c.moveTo(mid + i * u, mid - r * u);
			c.lineTo(mid + i * u, mid + r * u);
			c.moveTo(mid - r * u, mid + i * u);
			c.lineTo(mid + r * u, mid + i * u);
			c.stroke();
		}
		c.fillStyle = colour['--muted'];
		c.font = `13px ${colour['--serif']}`;
		c.textAlign = 'center';
		for (const k of [-5, 0, 5]) {
			const label = k < 0 ? `−${-k}` : `${k}`;
			c.fillText(label, mid + k * u, mid + r * u + 16);
			c.fillText(label, mid - r * u - 12, mid - k * u + 4);
		}
		c.textAlign = 'start';
		c.strokeStyle = colour['--path'];
		c.lineWidth = 2;
		c.lineJoin = 'round';
		c.beginPath();
		for (let i = 0; i <= step; i++) {
			const [x, y] = walk[i];
			if (i) c.lineTo(mid + x * u, mid - y * u);
			else c.moveTo(mid + x * u, mid - y * u);
		}
		c.stroke();
		c.fillStyle = colour['--home'];
		c.beginPath();
		c.arc(mid, mid, 5, 0, 7);
		c.fill();
		const right = quadrant & 1, down = quadrant & 2;
		c.strokeStyle = colour['--muted'];
		c.lineWidth = 1;
		c.beginPath();
		c.moveTo(mid + (right ? 5 : -5), mid + (down ? 5 : -5));
		c.lineTo(mid + (right ? 68 : -68), mid + (down ? 68 : -68));
		c.stroke();
		c.fillStyle = colour['--ink'];
		c.font = `italic 15px ${colour['--serif']}`;
		c.fillText('home', mid + (right ? 72 : -108), mid + (down ? 84 : -72));
		if (!done) {
			const [x, y] = walk[step];
			c.fillStyle = colour['--path'];
			c.beginPath();
			c.arc(mid + x * u, mid - y * u, 4, 0, 7);
			c.fill();
		}
	}

	const draw = () => (narrow.matches ? drawFlat(cx) : drawLattice(cx));

	function finish() {
		done = true;
		view.setRunning(false);
		const [x, y] = walk[step];
		const lattice = narrow.matches ? '' : '; the lattice sags where it lingered';
		view.setNote(
			x || y
				? 'In two dimensions a random walk always finds its way home. This one ran out of time first.'
				: `In two dimensions a random walk always finds its way home. This one took ${step} steps${lattice}.`
		);
	}

	function settle(): boolean {
		let moving = false;
		for (let i = 0; i < shown.length; i++) {
			const d = target[i] - shown[i];
			if (d > 1e-3) {
				shown[i] += d * 0.18;
				moving = true;
			} else shown[i] = target[i];
		}
		return moving;
	}

	function tick(now: number) {
		raf = 0;
		if (!visible()) return;
		if (now - prev < 32) {
			raf = requestAnimationFrame(tick);
			return;
		}
		active += Math.min(now - prev, 50);
		prev = now;
		const dt = Math.min(13000 / walk.length, 120);
		while (!done && active - lastStep >= dt) {
			lastStep += dt;
			step++;
			const [x, y] = walk[step];
			bump(x, y + V0);
			if (step === walk.length - 1 || active > MAX_MS) finish();
		}
		settling = settle();
		draw();
		if (!done || settling) raf = requestAnimationFrame(tick);
	}

	function run() {
		walk = findWalk(seed);
		const visits = [0, 0, 0, 0];
		for (const [x, y] of walk) if (x || y) visits[Number(x > 0) + 2 * Number(y < 0)]++;
		quadrant = visits.indexOf(Math.min(...visits));
		step = 0;
		done = false;
		target.fill(0);
		shown.fill(0);
		bump(0, V0);
		view.setRunning(true);
		view.setNote(RUNNING_NOTE);
		if (reduced.matches) {
			for (step = 1; step < walk.length; step++) bump(walk[step][0], walk[step][1] + V0);
			step = walk.length - 1;
			shown.set(target);
			finish();
			draw();
			return;
		}
		active = lastStep = 0;
		prev = performance.now();
		if (!raf) raf = requestAnimationFrame(tick);
	}

	const resume = () => {
		if (visible() && !raf && (!done || settling)) {
			prev = performance.now();
			raf = requestAnimationFrame(tick);
		}
	};
	const halt = () => {
		cancelAnimationFrame(raf);
		raf = 0;
	};
	const seen = new IntersectionObserver((entries) => {
		onScreen = entries[0].isIntersecting;
		if (visible()) resume();
		else halt();
	});
	seen.observe(canvas);
	const onVisibility = () => (visible() ? resume() : halt());
	document.addEventListener('visibilitychange', onVisibility);
	const redraw = () => {
		size();
		draw();
	};
	addEventListener('resize', redraw);
	narrow.addEventListener('change', redraw);
	const retheme = () => {
		readTokens();
		draw();
	};
	const lightScheme = matchMedia('(prefers-color-scheme: light)');
	lightScheme.addEventListener('change', retheme);
	const themeAttr = new MutationObserver(retheme);
	themeAttr.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	readTokens();
	size();
	run();
	document.fonts?.ready.then(retheme);

	const stop = () => {
		halt();
		seen.disconnect();
		themeAttr.disconnect();
		document.removeEventListener('visibilitychange', onVisibility);
		removeEventListener('resize', redraw);
		narrow.removeEventListener('change', redraw);
		lightScheme.removeEventListener('change', retheme);
	};
	return Object.assign(stop, { again: run });
}
