<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
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
	<figure class="hello">
		<!-- Waves on a loop (an animated WebP), drawn in each theme's colours on the
		     page itself; square on phones, a still under reduced motion. The other theme's copy never loads. -->
		<a href="/about"
			><picture class="hello-dark">
				<source media="(prefers-reduced-motion: reduce) and (max-width: 760px)" srcset="/images/hello-wave-square-dark-still.webp" />
				<source media="(prefers-reduced-motion: reduce)" srcset="/images/hello-wave-dark-still.webp" />
				<source media="(max-width: 760px)" srcset="/images/hello-wave-square-dark.webp" />
				<img src="/images/hello-wave-dark.webp" width="640" height="480" loading="lazy" alt="A person drawn in points, one arm raised in a wave, as a low-resolution depth LiDAR captured them" />
			</picture>
			<picture class="hello-light">
				<source media="(prefers-reduced-motion: reduce) and (max-width: 760px)" srcset="/images/hello-wave-square-light-still.webp" />
				<source media="(prefers-reduced-motion: reduce)" srcset="/images/hello-wave-light-still.webp" />
				<source media="(max-width: 760px)" srcset="/images/hello-wave-square-light.webp" />
				<img src="/images/hello-wave-light.webp" width="640" height="480" loading="lazy" alt="A person drawn in points, one arm raised in a wave, as a low-resolution depth LiDAR captured them" />
			</picture></a
		>
		<figcaption><i>Fig. 1.</i> Me, waving at a 160 × 60 depth LiDAR in 2020. A real capture. <a href="/about">More of my work, in points</a>.</figcaption>
	</figure>
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
