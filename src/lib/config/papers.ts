// Published papers, newest first. Titles and authors as Crossref lists them.
export interface Paper {
	year: number;
	title: string;
	authors: string;
	venue: string;
	href: string;
	preprint?: string;
}

export const papers: Paper[] = [
	{
		year: 2022,
		title: 'Understanding agent competency: effects of environment complexity on area coverage time',
		authors: 'F. Mazzoni and K. Jerath',
		venue: 'IEEE Symposium Series on Computational Intelligence (SSCI)',
		href: 'https://doi.org/10.1109/SSCI51031.2022.10022084'
	},
	{
		year: 2020,
		title: 'LAMAR: LiDAR based multi-inhabitant activity recognition',
		authors: 'Alam, Mazzoni, Rahman and Widberg',
		venue: 'MobiQuitous 2020',
		href: 'https://doi.org/10.1145/3448891.3450334'
	},
	{
		year: 2019,
		title: 'A Chandra study: are dwarf carbon stars spun up and rejuvenated by mass transfer?',
		authors: 'P. J. Green, R. Montez, F. Mazzoni and others',
		venue: 'The Astrophysical Journal 881(1), 49',
		href: 'https://doi.org/10.3847/1538-4357/ab2bf4',
		preprint: 'https://arxiv.org/abs/1905.07045'
	}
];
