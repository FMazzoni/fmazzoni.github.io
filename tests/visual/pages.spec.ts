import { test, expect, type Page, type TestInfo } from '@playwright/test';

// Visual loop: every page in each theme, at the sizes the config's projects set (desktop, phone).
// Screenshots go to shots/<project>/; look at them after any visual change. Dark is the default;
// THEMES=dark,light adds the light theme.
const ROUTES = ['/', '/projects', '/blog', '/about', '/Geoid-Globe-Visualization', '/Boston311-Dashboard'];
const THEMES = (process.env.THEMES ?? 'dark').split(',') as ('dark' | 'light')[];

const slugOf = (route: string) => (route === '/' ? 'home' : route.slice(1).replace(/\//g, '_'));

/** Problems the page itself causes. Third-party embeds (the Hugging Face iframe) are not counted. */
function collectProblems(page: Page): string[] {
	const problems: string[] = [];
	const ours = (url: string) => url.startsWith('http://127.0.0.1');
	page.on('pageerror', (e) => problems.push(`error: ${e.message}`));
	page.on('console', (m) => {
		if (m.type() === 'error' && ours(m.location().url)) problems.push(`console: ${m.text()} (${m.location().url})`);
	});
	page.on('requestfailed', (r) => {
		if (ours(r.url())) problems.push(`failed: ${r.url()}`);
	});
	return problems;
}

async function open(page: Page, route: string, theme: 'dark' | 'light') {
	// The loop checks this site, not the apps embedded in posts (a live WebGL globe, a Hugging Face
	// space), which make headless runs slow and flaky; their frames stay empty here.
	await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
	await page.addInitScript((t) => {
		// Init scripts also run in the blocked embeds' frames, where storage is denied.
		if (window !== window.top) return;
		localStorage.setItem('theme', t);
	}, theme);
	return page.goto(route, { waitUntil: 'networkidle' });
}

/** Scroll through the page so lazy images load, then return to the top. */
async function loadEverything(page: Page) {
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 500) {
			scrollTo(0, y);
			await new Promise((r) => setTimeout(r, 60));
		}
		scrollTo(0, 0);
	});
	// Lazy images may still be in flight after the scroll; load them all and wait until each has
	// settled (a broken one also counts as complete, and checkLayout then reports it).
	await page.evaluate(() => document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')));
	await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 });
	await page.evaluate(() => document.fonts.ready);
}

async function checkLayout(page: Page) {
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
	expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(0);
	const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
	expect(broken, 'broken images').toEqual([]);
	const libertinus = await page.evaluate(() => document.fonts.check('16px "Libertinus Web"'));
	expect(libertinus, 'Libertinus loaded').toBe(true);
}

// Chromium can't capture a page taller than about 16,000 device pixels in one go, so a long post
// (the Boston 311 one, on a phone) is saved in parts: name.png, name-2.png, ...
const MAX_CAPTURE_PX = 14000;
async function shot(page: Page, info: TestInfo, name: string) {
	const { height, width, dpr } = await page.evaluate(() => ({
		height: document.documentElement.scrollHeight,
		width: document.documentElement.clientWidth,
		dpr: devicePixelRatio
	}));
	const part = Math.floor(MAX_CAPTURE_PX / dpr);
	for (let y = 0, i = 1; y < height; y += part, i++) {
		await page.screenshot({
			path: `shots/${info.project.name}/${name}${i > 1 ? `-${i}` : ''}.png`,
			fullPage: true,
			clip: { x: 0, y, width, height: Math.min(part, height - y) }
		});
	}
}

for (const theme of THEMES) {
	for (const route of ROUTES) {
		test(`${route} (${theme})`, async ({ page }, info) => {
			const problems = collectProblems(page);
			const response = await open(page, route, theme);
			expect(response?.status()).toBe(200);
			await loadEverything(page);
			await checkLayout(page);
			await shot(page, info, `${slugOf(route)}-${theme}`);
			expect(problems).toEqual([]);
		});
	}

	test(`about scene, all stages (${theme})`, async ({ page }, info) => {
		const problems = collectProblems(page);
		await open(page, '/about', theme);
		const figure = page.locator('figure.scene');
		await figure.scrollIntoViewIfNeeded();
		await expect(figure).toHaveAttribute('data-ready', '1', { timeout: 10000 });
		for (let stage = 1; stage <= 5; stage++) {
			if (stage > 1) await figure.locator('button.next').click();
			await page.waitForTimeout(stage === 5 ? 9000 : 3000);
			await figure.screenshot({ path: `shots/${info.project.name}/about-stage${stage}-${theme}.png` });
		}
		await expect(figure.locator('button.next')).toBeDisabled();
		expect(problems).toEqual([]);
	});

	test(`404 walk (${theme})`, async ({ page }, info) => {
		const problems = collectProblems(page);
		await open(page, '/no-such-page', theme);
		await expect(page.locator('h1')).toHaveText('This page wandered off.');
		await page.waitForTimeout(1000);
		await shot(page, info, `404-running-${theme}`);
		await expect(page.locator('button.again')).toBeEnabled({ timeout: 20000 });
		await shot(page, info, `404-done-${theme}`);
		await checkLayout(page);
		// The document itself answers 404, which the browser logs; that is the point of the page.
		expect(problems.filter((p) => !p.includes('/no-such-page'))).toEqual([]);
	});
}

// Other repos serve /geoid-globe/ and the like on this domain. A link there has to make the browser
// load that page; if SvelteKit's router took it, visitors would get this site's 404 instead.
test('links to project sites leave the app', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	const link = page.locator('a[href="/geoid-globe/"]').first();
	await expect(link).toHaveAttribute('data-sveltekit-reload');
	const documentRequest = page.waitForRequest((r) => r.url().endsWith('/geoid-globe/') && r.resourceType() === 'document');
	await link.click();
	await documentRequest;
});

// The About figure plays through by itself once visible, and Pause holds it where it is.
test('about figure autoplays and pauses', async ({ page }) => {
	await page.goto('/about', { waitUntil: 'networkidle' });
	const figure = page.locator('figure.scene');
	await figure.scrollIntoViewIfNeeded();
	await expect(figure).toHaveAttribute('data-ready', '1', { timeout: 10000 });
	const count = figure.locator('.count');
	await expect(count).toHaveText('2 of 5', { timeout: 12000 });
	await figure.locator('button.play').click();
	await expect(figure.locator('button.play')).toHaveText('Play');
	const held = await count.textContent();
	await page.waitForTimeout(8000);
	await expect(count).toHaveText(held!);
});
