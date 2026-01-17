import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostBySlug, getPosts } from '$lib/utils/content.server';

export const load: PageServerLoad = async ({ params }) => {
	const post = getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Get all posts for navigation
	const allPosts = getPosts();
	const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
	const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
	const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

	return {
		post,
		nextPost,
		prevPost
	};
};

// Generate static paths for all posts
export const entries = async () => {
	const posts = getPosts();
	return posts.map((post) => ({ slug: post.slug }));
};
