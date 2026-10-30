import otherSites from './other-sites.json';

// The site's identity, in one place: components read it from here instead of repeating it.
export const site = {
	name: 'Fernando',
	url: 'https://fmazzoni.github.io',
	intro: 'I work in data science, machine learning and AI.',
	background: 'These days I build things on\u00a0the side, mostly with coding agents.',
	description: 'Fernando’s projects and blog posts on data science, machine learning, AI and physics.',
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

/**
 * The site's parts and the one name each goes by. The nav, the section headings and the page titles
 * read these, so a part is called the same everywhere: the blog holds posts, and its address matches.
 */
export const sections = {
	projects: { title: 'Projects', href: '/projects' },
	blog: { title: 'Blog', href: '/blog' },
	about: { title: 'About', href: '/about' },
	papers: { title: 'Papers', href: '/about#papers' }
} as const;

export const nav = [sections.projects, sections.blog, sections.about] as const;

/**
 * Paths on this domain that other repos' GitHub Pages serve (/geoid-globe/ and so on). SvelteKit's
 * router would render its own 404 for them, so links there must make the browser load the page.
 */
const otherSite = new RegExp(`^(https://fmazzoni\\.github\\.io)?/(${otherSites.join('|')})(/|$|\\?)`);
export const isOtherSite = (href: string): boolean => otherSite.test(href);
