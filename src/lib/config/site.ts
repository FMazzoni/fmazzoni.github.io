import otherSites from './other-sites.json';

// The site's identity, in one place: components read it from here instead of repeating it.
export const site = {
	name: 'Fernando',
	url: 'https://fmazzoni.github.io',
	intro: 'Hi, I’m Fernando. I work on machine learning and data engineering.',
	description: 'Fernando’s projects and writing on machine learning, data engineering and physics.',
	social: [
		{ name: 'GitHub', url: 'https://github.com/FMazzoni' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/fernando-mazzoni' }
	]
} as const;

export const nav = [
	{ title: 'Projects', href: '/projects' },
	{ title: 'Writing', href: '/blog' },
	{ title: 'About', href: '/about' }
] as const;

/**
 * Paths on this domain that other repos' GitHub Pages serve (/geoid-globe/ and so on). SvelteKit's
 * router would render its own 404 for them, so links there must make the browser load the page.
 */
const otherSite = new RegExp(`^(https://fmazzoni\\.github\\.io)?/(${otherSites.join('|')})(/|$|\\?)`);
export const isOtherSite = (href: string): boolean => otherSite.test(href);
