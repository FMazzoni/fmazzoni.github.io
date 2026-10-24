import { defineConfig, devices } from '@playwright/test';

// Visual loop: builds the static site, serves it with `vite preview`, and drives it
// in Chromium at desktop and phone sizes. Screenshots land in shots/ (gitignored).
export default defineConfig({
	testDir: 'tests/visual',
	timeout: 60_000,
	// Chromium's screenshot capture fails now and then for no reason in the page; one retry absorbs it.
	retries: 1,
	outputDir: 'test-results',
	reporter: [['list']],
	use: { baseURL: 'http://127.0.0.1:4173' },
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: true,
		timeout: 120_000
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
		{ name: 'laptop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
		{ name: 'phone', use: { ...devices['Pixel 7'] } }
	]
});
