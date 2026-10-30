<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import HelloFigure from '$lib/components/HelloFigure.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import DatedList from '$lib/components/DatedList.svelte';
	import { home, sections, site } from '$lib/config/site';
	import { withPosts } from '$lib/config/projects';
	import { papers } from '$lib/config/papers';
	import { paperEntries, postEntries } from '$lib/utils/entries';

	let { data } = $props();

	const projects = $derived(withPosts(data.posts));
	const shown = $derived(projects.filter((p) => p.featured).slice(0, home.figures));
	const listed = $derived(projects.filter((p) => !shown.includes(p)).slice(0, home.lines));
</script>

<Seo />

<section class="intro with-figure">
	<div>
		<h1>{site.intro}</h1>
		<p class="background">{site.background}</p>
	</div>
	<HelloFigure />
</section>

<section aria-labelledby="projects">
	<h2 class="sec" id="projects"><a href={sections.projects.href}>{sections.projects.title}</a></h2>
	<div class="projects">
		{#each shown as project, i (project.name)}
			<ProjectFigure {project} fig={i + 2} /><!-- Fig. 1 is the wave above -->
		{/each}
	</div>
	<ProjectList projects={listed} all={{ label: `All ${sections.projects.title.toLowerCase()}`, href: sections.projects.href }} />
</section>

<div class="lower">
<section aria-labelledby="blog">
	<h2 class="sec" id="blog"><a href={sections.blog.href}>{sections.blog.title}</a></h2>
	<DatedList entries={postEntries(data.posts)} />
</section>

<section aria-labelledby="papers">
	<h2 class="sec" id="papers"><a href={sections.papers.href}>{sections.papers.title}</a></h2>
	<DatedList entries={paperEntries(papers)} years />
</section>
</div>
