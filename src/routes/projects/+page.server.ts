import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/utils/content.server';

// Only what the project cards need to link each post.
export const load: PageServerLoad = () => ({
	posts: getPosts().map(({ slug, project }) => ({ slug, project }))
});
