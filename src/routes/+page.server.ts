import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/utils/content.server';

export const load: PageServerLoad = () => ({
	posts: getPosts().map(({ slug, title, date, project }) => ({ slug, title, date, project }))
});
