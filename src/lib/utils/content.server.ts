import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import { isOtherSite } from '$lib/config/site';

// Markdown becomes HTML here, once, at build time; templates only render the fields this returns.
const markdown = new Marked(
	{ async: false, gfm: true },
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

// Links to the project sites other repos serve on this domain must load those pages, not route here.
markdown.use({
	renderer: {
		link({ href, title, tokens }) {
			if (!isOtherSite(href)) return false;
			const titleAttr = title ? ` title="${title}"` : '';
			return `<a href="${href}"${titleAttr} data-sveltekit-reload>${this.parser.parseInline(tokens)}</a>`;
		}
	}
});

const render = (source: string): string => markdown.parse(source) as string;

export interface Post {
	slug: string;
	title: string;
	/** YYYY-MM-DD, as written in the front matter. */
	date: string;
	tags: string[];
	/** One plain-text sentence for lists, meta descriptions and link previews. */
	excerpt: string;
	html: string;
	readingMinutes: number;
}

export interface Page {
	slug: string;
	title: string;
	html: string;
}

const contentDir = path.join(process.cwd(), 'content');

// gray-matter reads `date: 2025-11-17` as midnight UTC; keep it as the calendar date it names.
function isoDate(value: unknown): string {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	return String(value ?? '').slice(0, 10);
}

function plainText(html: string): string {
	return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function readingMinutes(html: string): number {
	return Math.max(1, Math.round(plainText(html).split(' ').length / 220));
}

function readPost(filename: string): Post {
	const { data, content } = matter(fs.readFileSync(path.join(contentDir, 'posts', filename), 'utf8'));
	const html = render(content);
	return {
		slug: filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
		title: String(data.title ?? ''),
		date: isoDate(data.date),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : String(data.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
		excerpt: String(data.excerpt ?? ''),
		html,
		readingMinutes: readingMinutes(html)
	};
}

let cache: Post[] | undefined;

/** Every post, newest first. */
export function getPosts(): Post[] {
	cache ??= fs
		.readdirSync(path.join(contentDir, 'posts'))
		.filter((name) => name.endsWith('.md'))
		.map(readPost)
		.sort((a, b) => b.date.localeCompare(a.date));
	return cache;
}

export function getPost(slug: string): Post | undefined {
	return getPosts().find((post) => post.slug === slug);
}

export function getPage(slug: string): Page | undefined {
	const file = path.join(contentDir, 'pages', `${slug}.md`);
	if (!fs.existsSync(file)) return undefined;
	const { data, content } = matter(fs.readFileSync(file, 'utf8'));
	return { slug, title: String(data.title ?? slug), html: render(content) };
}
