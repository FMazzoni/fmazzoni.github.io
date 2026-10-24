// Projects, in the order the owner chose to show them. Featured ones get a screenshot on the home page.

export interface Shot {
	src: string;
	alt: string;
	width: number;
	height: number;
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
		shots: [{ src: '/images/projects/geoid-globe.webp', alt: 'The geoid as a deformed globe, coloured from −106 m to +85 m', width: 900, height: 562 }],
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
		shots: [{ src: '/images/projects/divisor-invariant.webp', alt: 'A grid of numbers with the invariant ones marked in green', width: 1240, height: 775 }],
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
		shots: [{ src: '/images/projects/quipu.webp', alt: 'The quipu documentation page with its install command', width: 1240, height: 775 }],
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
		links: [
			{ label: 'post', href: '/Boston311-Dashboard' },
			{ label: 'code', href: 'https://github.com/FMazzoni/boston311_paneldashboard' }
		],
		featured: false
	}
];
