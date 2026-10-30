import { defineConfig, devices } from '@playwright/test';

// Its own port, so it never collides with a dev server or another preview.
const port = 4179;
const url = `http://127.0.0.1:${port}`;

// Visual loop: builds the static site, serves it with `vite preview`, and drives it
// in Chromium at desktop and phone sizes. Screenshots land in shots/ (gitignored).
export default defineConfig({
	testDir: 'tests/visual',
	timeout: 60_000,
	// Chromium's screenshot capture fails now and then for no reason in the page; one retry absorbs it.
	retries: 1,
	// Many parallel full-page captures make Chromium fail some ("Unable to capture screenshot").
	workers: 2,
	outputDir: 'test-results',
	reporter: [['list']],
	use: { baseURL: url },
	webServer: {
		// Always a fresh server: a preview started before a build serves stale assets.
		command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
		url,
		reuseExistingServer: false,
		timeout: 120_000
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
		{ name: 'laptop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
		{ name: 'phone', use: { ...devices['Pixel 7'] } }
	]
});
