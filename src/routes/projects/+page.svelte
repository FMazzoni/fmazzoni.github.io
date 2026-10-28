<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import { projects } from '$lib/config/projects';
	import { site } from '$lib/config/site';

	const featured = projects.filter((p) => p.featured);
	const more = projects.filter((p) => !p.featured);
</script>

<Seo title="Projects" description="Things {site.name} has built: tools for AI agents, geospatial visualizations and data pipelines." />

<section class="intro">
	<h1>Projects</h1>
</section>

<div class="projects">
	{#each featured as project (project.name)}
		<ProjectFigure {project} />
	{/each}
</div>

<section aria-labelledby="more">
	<h2 class="sec" id="more">Smaller things</h2>
	<ProjectList projects={more} />
</section>
