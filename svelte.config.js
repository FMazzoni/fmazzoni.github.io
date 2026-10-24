import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import otherSites from './src/lib/config/other-sites.json' with { type: 'json' };

const otherSite = new RegExp(`^/(${otherSites.join('|')})(/|$)`);

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
				// Other repos' GitHub Pages sites live under these paths, so links to them don't resolve here.
				if (otherSite.test(path)) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
