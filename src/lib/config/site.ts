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
