<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import AboutScene from '$lib/components/AboutScene.svelte';
	import DatedList from '$lib/components/DatedList.svelte';
	import { papers } from '$lib/config/papers';
	import { paperEntries } from '$lib/utils/entries';
	import { site } from '$lib/config/site';

	let { data } = $props();
</script>

<Seo title="About" description="{site.name} works in data science, machine learning and AI, after research in physics on X-ray astronomy, LiDAR and agent search." />

<section class="intro">
	<h1>About</h1>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- the owner's Markdown, rendered at build time (ruly: html-from-content-pipeline) -->
	{@html data.page.html}
</section>

<AboutScene />

<section aria-labelledby="papers">
	<h2 class="sec" id="papers">Papers</h2>
	<DatedList entries={paperEntries(papers, true)} years />
</section>
