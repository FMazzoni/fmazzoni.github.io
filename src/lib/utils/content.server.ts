import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';

// Configure marked for synchronous use
marked.setOptions({
	async: false
});

export interface Post {
	slug: string;
	title: string;
	date: string;
	category?: string;
	tags?: string[];
	excerpt?: string;
	content: string;
	math?: boolean;
}

export interface Page {
	slug: string;
	title: string;
	content: string;
	date?: string;
}

function getContentDirectory(): string {
	// In production/build, content is in the project root
	// In dev, it's also in the project root
	return path.join(process.cwd(), 'content');
}

export function getPosts(): Post[] {
	const postsDirectory = path.join(getContentDirectory(), 'posts');
	if (!fs.existsSync(postsDirectory)) return [];

	const filenames = fs.readdirSync(postsDirectory);

	const posts = filenames
		.filter((name: string) => name.endsWith('.md'))
		.map((filename: string) => {
			const filePath = path.join(postsDirectory, filename);
			const fileContents = fs.readFileSync(filePath, 'utf8');
			const { data, content } = matter(fileContents);

			// Extract slug from filename (remove date prefix and .md)
			const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

			return {
				slug,
				title: data.title || 'Untitled',
				date: data.date || '',
				category: data.category,
				tags: Array.isArray(data.tags)
					? data.tags
					: typeof data.tags === 'string'
						? data.tags.split(',').map((t) => t.trim())
						: [],
				excerpt: data.excerpt ? marked.parse(data.excerpt) as string : undefined,
				content: marked.parse(content) as string,
				math: data.math || false
			};
		})
		.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
}

export function getPostBySlug(slug: string): Post | null {
	const posts = getPosts();
	return posts.find((post) => post.slug === slug) || null;
}

export function getPages(): Page[] {
	const pagesDirectory = path.join(getContentDirectory(), 'pages');
	if (!fs.existsSync(pagesDirectory)) return [];

	const filenames = fs.readdirSync(pagesDirectory);
	return filenames
		.filter((name: string) => name.endsWith('.md'))
		.map((filename: string) => {
			const filePath = path.join(pagesDirectory, filename);
			const fileContents = fs.readFileSync(filePath, 'utf8');
			const { data, content } = matter(fileContents);

			const slug = filename.replace(/\.md$/, '');

			return {
				slug,
				title: data.title || slug,
				content: marked.parse(content) as string,
				date: data.date
			};
		});
}

export function getPageBySlug(slug: string): Page | null {
	const pages = getPages();
	return pages.find((page) => page.slug === slug) || null;
}
