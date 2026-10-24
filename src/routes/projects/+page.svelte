<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import { projects } from '$lib/config/projects';

	const featured = projects.filter((p) => p.featured);
	const more = projects.filter((p) => !p.featured);
</script>

<Seo title="Projects" description="Things Fernando has built: tools for AI agents, geospatial visualizations and data pipelines." />

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
	<ul class="more">
		{#each more as project (project.name)}
			<li>
				<span class="meta">{project.year} · {project.stack}</span>
				<p>
					<b>{project.name}.</b>
					{project.summary}
					<span class="inline-links">
						{#each project.links as link (link.href)}<a href={link.href}>{link.label}</a>{/each}
					</span>
				</p>
			</li>
		{/each}
	</ul>
</section>
