<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import HelloFigure from '$lib/components/HelloFigure.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import DatedList from '$lib/components/DatedList.svelte';
	import { home, site } from '$lib/config/site';
	import { projects } from '$lib/config/projects';
	import { papers } from '$lib/config/papers';
	import { paperEntries, postEntries } from '$lib/utils/entries';

	let { data } = $props();

	const shown = projects.filter((p) => p.featured).slice(0, home.figures);
	const listed = projects.filter((p) => !shown.includes(p)).slice(0, home.lines);
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
	<h2 class="sec" id="projects"><a href="/projects">Projects</a></h2>
	<div class="projects">
		{#each shown as project (project.name)}
			<ProjectFigure {project} />
		{/each}
	</div>
	<ProjectList projects={listed} all={{ label: 'All projects', href: '/projects' }} />
</section>

<div class="lower">
<section aria-labelledby="writing">
	<h2 class="sec" id="writing"><a href="/blog">Writing</a></h2>
	<DatedList entries={postEntries(data.posts)} />
</section>

<section aria-labelledby="papers">
	<h2 class="sec" id="papers"><a href="/about#papers">Papers</a></h2>
	<DatedList entries={paperEntries(papers)} years />
</section>
</div>
