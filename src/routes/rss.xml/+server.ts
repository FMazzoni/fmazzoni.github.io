import type { RequestHandler } from './$types';
import { postPath, sections, site } from '$lib/config/site';
import { getPosts } from '$lib/utils/content.server';

export const prerender = true;

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: RequestHandler = () => {
	const items = getPosts()
		.map(
			(post) => `<item>
<title>${escape(post.title)}</title>
<link>${site.url}${postPath(post.slug)}</link>
<guid>${site.url}${postPath(post.slug)}</guid>
<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${escape(post.excerpt)}</description>
</item>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(`${sections.blog.title} · ${site.name}`)}</title>
<link>${site.url}${sections.blog.href}</link>
<description>${escape(site.description)}</description>
${items}
</channel>
</rss>`;

	return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
