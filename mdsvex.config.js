import { defineMDSveXConfig } from 'mdsvex';

const config = defineMDSveXConfig({
	extensions: ['.md', '.svx'],
	layout: {
		_: './src/lib/components/MarkdownLayout.svelte'
	},
	remarkPlugins: [],
	rehypePlugins: []
});

export default config;
