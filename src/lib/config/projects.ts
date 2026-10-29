// Projects, in the order the owner chose to show them. Featured ones get a screenshot on the home page.
// A post links itself to a project with `project: <name>` in its front matter; withPosts adds the link.

import { postPath } from './site';

export interface Shot {
	src: string;
	alt: string;
	width: number;
	height: number;
	/** The same view in the project's light theme, where it has one; shown in this site's light mode. */
	lightSrc?: string;
	/** Pane letter for a multi-pane figure, cited in the caption. */
	tag?: string;
}

export interface Project {
	name: string;
	year: number;
	stack: string;
	summary: string;
	/** Explains the panes of a multi-pane figure. */
	subcaption?: string;
	links: { label: string; href: string }[];
	/** One wide screenshot, or several phone screenshots side by side. */
	shots?: Shot[];
	featured: boolean;
}

export const projects: Project[] = [
	{
		name: 'herdr-pwa',
		year: 2026,
		stack: 'Python',
		summary: 'A phone dashboard for my coding agents. It shows which ones are stuck and lets me answer them.',
		subcaption: '(a) the feed, (b) answering a blocked agent, (c) reviewing a diff.',
		links: [{ label: 'code', href: 'https://github.com/FMazzoni/herdr-pwa' }],
		shots: [
			{ src: '/images/projects/herdr-feed-showcase.webp', alt: 'Feed: two agents need an answer, one is working, one is idle', width: 400, height: 866, tag: '(a)' },
			{ src: '/images/projects/herdr-agent-answer-menu.webp', alt: 'Answer menu for an agent asking whether to force-push', width: 400, height: 866, tag: '(b)' },
			{ src: '/images/projects/herdr-files-diff.webp', alt: 'A file diff on the phone', width: 400, height: 866, tag: '(c)' }
		],
		featured: true
	},
	{
		name: 'geoid-globe',
		year: 2025,
		stack: 'Python, Three.js',
		summary: 'Earth’s geoid in 3D, computed from the EGM2008 gravity model and exaggerated so you can see it.',
		links: [
			{ label: 'live', href: '/geoid-globe/' },
			{ label: 'code', href: 'https://github.com/FMazzoni/geoid-globe' }
		],
		shots: [{ src: '/images/projects/geoid-globe.webp', alt: 'The geoid as a deformed globe, blue where it lies below the ellipsoid and red where it rises above', width: 900, height: 562 }],
		featured: true
	},
	{
		name: 'divisor-invariant',
		year: 2025,
		stack: 'Python',
		summary: '13 and 31 are both prime; 15 and 51 both have four divisors. A map of which numbers up to a million keep their divisor count when you shuffle the digits.',
		links: [
			{ label: 'live', href: '/divisor-invariant/' },
			{ label: 'code', href: 'https://github.com/FMazzoni/divisor-invariant' }
		],
		shots: [{ src: '/images/projects/divisor-invariant.webp', lightSrc: '/images/projects/divisor-invariant-light.webp', alt: 'A grid of numbers with the invariant ones marked in green', width: 1240, height: 775 }],
		featured: true
	},
	{
		name: 'quipu',
		year: 2026,
		stack: 'Rust, SQLite',
		summary: 'A task database for agents: one SQLite file behind a small CLI. No longer maintained.',
		links: [
			{ label: 'docs', href: '/quipu/' },
			{ label: 'code', href: 'https://github.com/FMazzoni/quipu' }
		],
		shots: [{ src: '/images/projects/quipu.webp', lightSrc: '/images/projects/quipu-light.webp', alt: 'The quipu documentation page with its install command', width: 1240, height: 775 }],
		featured: true
	},
	{
		name: 'TriviaToday',
		year: 2025,
		stack: 'Python',
		summary: 'Generates trivia questions from any article-based website, using Claude through Atomic Agents.',
		links: [{ label: 'code', href: 'https://github.com/FMazzoni/TriviaToday' }],
		featured: false
	},
	{
		name: 'gmail-datalake-extractor',
		year: 2025,
		stack: 'Python, FastAPI, DuckLake',
		summary: 'A small service that pulls Gmail messages into a DuckLake data lake, on DuckDB locally or PostgreSQL in production.',
		links: [{ label: 'code', href: 'https://github.com/FMazzoni/gmail-datalake-extractor' }],
		featured: false
	},
	{
		name: 'Boston 311 dashboard',
		year: 2025,
		stack: 'Python, DuckDB, Panel',
		summary: 'Fourteen years of Boston’s 311 service requests on a map, in a weekend dashboard.',
		links: [{ label: 'code', href: 'https://github.com/FMazzoni/boston311_paneldashboard' }],
		featured: false
	}
];

/** The projects, each with a "post" link for every post whose front matter names it, placed before its code link. */
export function withPosts(posts: { slug: string; project?: string }[]): Project[] {
	return projects.map((project) => {
		const own = posts.filter((post) => post.project === project.name).map((post) => ({ label: 'post', href: postPath(post.slug) }));
		if (!own.length) return project;
		const code = project.links.findIndex((link) => link.label === 'code');
		const at = code < 0 ? project.links.length : code;
		return { ...project, links: [...project.links.slice(0, at), ...own, ...project.links.slice(at)] };
	});
}
