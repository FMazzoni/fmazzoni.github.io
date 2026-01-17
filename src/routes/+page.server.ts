import type { PageServerLoad } from './$types';
import { getPageBySlug } from '$lib/utils/content.server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const page = getPageBySlug('about');

	if (!page) {
		throw error(404, 'Page not found');
	}

	return {
		page
	};
};
