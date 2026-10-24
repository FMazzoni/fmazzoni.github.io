import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { getPost, getPosts } from '$lib/utils/content.server';

export const entries: EntryGenerator = () => getPosts().map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Not found');

	const posts = getPosts();
	const i = posts.findIndex((p) => p.slug === post.slug);
	const link = (p: (typeof posts)[number] | undefined) => (p ? { slug: p.slug, title: p.title } : undefined);
	return { post, newer: link(posts[i - 1]), older: link(posts[i + 1]) };
};
