import type { RequestHandler } from './$types';
import { nav, postPath, site } from '$lib/config/site';
import { getPosts } from '$lib/utils/content.server';

export const prerender = true;

// Every page of this site, for search engines; robots.txt points here. Other repos' Pages on this
// domain (/geoid-globe/ and so on) keep their own.
export const GET: RequestHandler = () => {
	const paths = ['', ...nav.map((n) => n.href), ...getPosts().map((p) => postPath(p.slug))];
	const lastmod: Record<string, string> = Object.fromEntries(getPosts().map((p) => [postPath(p.slug), p.date]));
	const urls = paths
		.map((p) => `<url><loc>${site.url}${p}</loc>${lastmod[p] ? `<lastmod>${lastmod[p]}</lastmod>` : ''}</url>`)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
