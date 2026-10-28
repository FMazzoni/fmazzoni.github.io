import type { Paper } from '$lib/config/papers';
import { shortDate } from './dates';

/** A row of a DatedList. */
export interface Entry {
	when: string;
	/** Machine-readable date, when `when` is a full date. */
	datetime?: string;
	title: string;
	href: string;
	note?: string;
	extra?: { label: string; href: string };
}

export const postEntries = (posts: { slug: string; title: string; date: string; excerpt?: string }[], excerpts = false): Entry[] =>
	posts.map((p) => ({ when: shortDate(p.date), datetime: p.date, title: p.title, href: `/${p.slug}`, note: excerpts ? p.excerpt : undefined }));

/** Papers with their venue; `full` adds the authors and the preprint link. */
export const paperEntries = (papers: Paper[], full = false): Entry[] =>
	papers.map((p) => ({
		when: String(p.year),
		title: p.title,
		href: p.href,
		note: full ? `${p.authors}. ${p.venue}.` : p.venue,
		extra: full && p.preprint ? { label: 'arXiv', href: p.preprint } : undefined
	}));
