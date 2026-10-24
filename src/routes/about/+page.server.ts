import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPage } from '$lib/utils/content.server';

export const load: PageServerLoad = () => {
	const page = getPage('about');
	if (!page) error(404, 'Not found');
	return { page };
};
