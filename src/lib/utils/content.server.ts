import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createCssVariablesTheme, createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/bash.mjs';
import docker from 'shiki/langs/docker.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import python from 'shiki/langs/python.mjs';
import rust from 'shiki/langs/rust.mjs';
import sql from 'shiki/langs/sql.mjs';
import toml from 'shiki/langs/toml.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import yaml from 'shiki/langs/yaml.mjs';
import { isOtherSite } from '$lib/config/site';

// Code is highlighted at build time with Shiki (VS Code's grammars). The theme emits CSS variables,
// so app.css sets the colours for both themes; pages ship no highlighting script.
const theme = createCssVariablesTheme({ name: 'site', variablePrefix: '--shiki-' });
const highlighter = createHighlighterCoreSync({
	themes: [theme],
	langs: [bash, docker, javascript, json, python, rust, sql, toml, typescript, yaml],
	engine: createJavaScriptRegexEngine()
});
const aliases: Record<string, string> = { dockerfile: 'docker', sh: 'bash', shell: 'bash', js: 'javascript', ts: 'typescript', py: 'python', yml: 'yaml' };

function highlight(code: string, lang: string | undefined): string {
	const name = aliases[lang ?? ''] ?? lang ?? '';
	const known = highlighter.getLoadedLanguages().includes(name);
	return highlighter.codeToHtml(code, { lang: known ? name : 'text', theme: 'site' });
}

// Markdown becomes HTML here, once, at build time; templates only render the fields this returns.
const markdown = new Marked({ async: false, gfm: true });

// Code blocks go through Shiki. Links to the project sites other repos serve on this domain must
// load those pages, not route here.
markdown.use({
	renderer: {
		code({ text, lang }) {
			return highlight(text, lang?.split(/\s/)[0]);
		},
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
