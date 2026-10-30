<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import { withPosts } from '$lib/config/projects';
	import { sections, site } from '$lib/config/site';

	let { data } = $props();

	const projects = $derived(withPosts(data.posts));
	const featured = $derived(projects.filter((p) => p.featured));
	const more = $derived(projects.filter((p) => !p.featured));
</script>

<Seo title={sections.projects.title} description="Things {site.name} has built: tools for AI agents, geospatial visualizations and data pipelines." />

<section class="intro">
	<h1>{sections.projects.title}</h1>
</section>

<div class="projects">
	{#each featured as project, i (project.name)}
		<ProjectFigure {project} fig={i + 1} />
	{/each}
</div>

<section aria-labelledby="more">
	<h2 class="sec" id="more">Smaller things</h2>
	<ProjectList projects={more} />
</section>
