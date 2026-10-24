import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// GitHub Pages serves 404.html for unknown paths; the app renders the random-walk 404 there.
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, message }) => {
				// The project sites under /geoid-globe/, /divisor-invariant/ and /quipu/ are other repos'
				// GitHub Pages, so links to them don't resolve inside this build.
				if (/^\/(geoid-globe|divisor-invariant|quipu)(\/|$)/.test(path)) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
