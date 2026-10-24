<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import AboutScene from '$lib/components/AboutScene.svelte';
	import { papers } from '$lib/config/papers';
	import { site } from '$lib/config/site';

	let { data } = $props();
</script>

<Seo title="About" description="{site.name} works on machine learning and data engineering, after research in physics on X-ray astronomy, LiDAR and agent search." />

<section class="intro">
	<h1>About</h1>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- the owner's Markdown, rendered at build time (ruly: html-from-content-pipeline) -->
	{@html data.page.html}
</section>

<AboutScene />

<section aria-labelledby="papers">
	<h2 class="sec" id="papers">Papers</h2>
	<ul class="dated papers">
		{#each papers as paper (paper.href)}
			<li>
				<span class="yr">{paper.year}</span>
				<span>
					<a href={paper.href}>{paper.title}</a>
					<span class="by">
						{paper.authors}. {paper.venue}.
						{#if paper.preprint}<a href={paper.preprint}>arXiv</a>{/if}
					</span>
				</span>
			</li>
		{/each}
	</ul>
</section>
