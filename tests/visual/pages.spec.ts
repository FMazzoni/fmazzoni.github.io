import { test, expect, type Page } from '@playwright/test';

// Every page the site serves, checked in both themes. Add a route here when the site gains one.
const ROUTES = ['/', '/blog', '/about', '/Geoid-Globe-Visualization', '/Boston311-Dashboard'];
const THEMES = ['dark', 'light'] as const;

function slugOf(route: string): string {
	return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
}

async function openInTheme(page: Page, route: string, theme: (typeof THEMES)[number]) {
	await page.addInitScript((t) => localStorage.setItem('blog-theme', t), theme);
	await page.goto(route, { waitUntil: 'networkidle' });
}

for (const route of ROUTES) {
	for (const theme of THEMES) {
		test(`${route} (${theme})`, async ({ page }, info) => {
			const errors: string[] = [];
			page.on('pageerror', (e) => errors.push(e.message));
			page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

			await openInTheme(page, route, theme);
			await page.screenshot({
				path: `shots/${info.project.name}/${slugOf(route)}-${theme}.png`,
				fullPage: true
			});

			// No sideways scroll at any width.
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth
			);
			expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(0);

			// Every image loaded.
			const broken = await page.$$eval('img', (imgs) =>
				imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src)
			);
			expect(broken, 'broken images').toEqual([]);

			expect(errors, 'console errors').toEqual([]);
		});
	}
}
