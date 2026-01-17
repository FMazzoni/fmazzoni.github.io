export const siteConfig = {
	name: 'blog',
	author: 'fmaz',
	email: '',
	url: 'https://fmazzoni.github.io',
	timezone: 'America/New_York',
	defaultLang: 'en',

	social: [
		{ name: 'GitHub', url: 'https://github.com/FMazzoni', icon: 'fab fa-github' },
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/fernando-mazzoni',
			icon: 'fab fa-linkedin'
		}
	],

	links: [
		{ title: 'Python', url: 'https://www.python.org/' },
		{ title: 'Pelican', url: 'https://getpelican.com/' },
		{ title: 'Jinja2', url: 'https://palletsprojects.com/p/jinja/' }
	],

	pagination: {
		postsPerPage: 10
	}
};
