import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/utils/content.server';

export const load: PageServerLoad = () => ({
	posts: getPosts().map(({ slug, title, date }) => ({ slug, title, date }))
});
