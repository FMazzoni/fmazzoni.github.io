import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx']
		})
	],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: dev ? '' : '/fmazzoni.github.io',
			relative: false
		},
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for paths that don't match base path during prerender
				// This can happen when base path is set for GitHub Pages
				if (message.includes('does not begin with `base`')) {
					return;
				}
				// Otherwise, throw the error
				throw new Error(message);
			}
		}
	}
};

export default config;
