import type { RequestHandler } from './$types';
import { site } from '$lib/config/site';
import { getPosts } from '$lib/utils/content.server';

export const prerender = true;

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: RequestHandler = () => {
	const items = getPosts()
		.map(
			(post) => `<item>
<title>${escape(post.title)}</title>
<link>${site.url}/${post.slug}</link>
<guid>${site.url}/${post.slug}</guid>
<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${escape(post.excerpt)}</description>
</item>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(site.name)}</title>
<link>${site.url}</link>
<description>${escape(site.description)}</description>
${items}
</channel>
</rss>`;

	return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
