import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/utils/content.server';

export const load: PageServerLoad = async () => {
    const posts = getPosts();

    return {
        posts
    };
};
