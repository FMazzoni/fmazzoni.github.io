import otherSites from './other-sites.json';

// The site's identity, in one place: components read it from here instead of repeating it.
export const site = {
	name: 'Fernando',
	url: 'https://fmazzoni.github.io',
	intro: 'I work in data science, machine learning and AI.',
	background: 'These days I build things on\u00a0the side, mostly with coding agents.',
	description: 'Fernando’s projects and writing on data science, machine learning, AI and physics.',
	social: [
		{ name: 'GitHub', url: 'https://github.com/FMazzoni' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/fernando-mazzoni' }
	]
} as const;

/** Where a post is served. Posts sit under /blog/ so they never share the root with other repos' Pages. */
export const postPath = (slug: string): string => `/blog/${slug}`;

/**
 * What the home page shows. Projects appear in the order of projects.ts: the first `figures`
 * featured ones get a screenshot, the next `lines` get a line each, then a link to the rest.
 */
export const home = { figures: 2, lines: 3 } as const;

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
