<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import { isOtherSite, site } from '$lib/config/site';
	import { projects } from '$lib/config/projects';
	import { papers } from '$lib/config/papers';
	import { shortDate } from '$lib/utils/dates';

	let { data } = $props();

	// Home shows the first two projects with screenshots and the next three as one line each;
	// /projects is the full set.
	const shown = projects.filter((p) => p.featured).slice(0, 2);
	const listed = projects.filter((p) => !shown.includes(p)).slice(0, 3);
</script>

<Seo />

<section class="intro with-figure">
	<div>
		<h1>{site.intro}</h1>
		<p class="background">{site.background}</p>
	</div>
	<figure class="hello">
		<!-- Waves once on load (an animated WebP that plays once), drawn in each theme's colours on the
		     page itself; square on phones, a still under reduced motion. The other theme's copy never loads. -->
		<a href="/about"
			><picture class="hello-dark">
				<source media="(prefers-reduced-motion: reduce) and (max-width: 760px)" srcset="/images/hello-wave-square-dark-still.webp" />
				<source media="(prefers-reduced-motion: reduce)" srcset="/images/hello-wave-dark-still.webp" />
				<source media="(max-width: 760px)" srcset="/images/hello-wave-square-dark.webp" />
				<img src="/images/hello-wave-dark.webp" width="640" height="480" loading="lazy" alt="A person drawn in rows of points, one arm raised in a wave, as a LiDAR sensor would see them" />
			</picture>
			<picture class="hello-light">
				<source media="(prefers-reduced-motion: reduce) and (max-width: 760px)" srcset="/images/hello-wave-square-light-still.webp" />
				<source media="(prefers-reduced-motion: reduce)" srcset="/images/hello-wave-light-still.webp" />
				<source media="(max-width: 760px)" srcset="/images/hello-wave-square-light.webp" />
				<img src="/images/hello-wave-light.webp" width="640" height="480" loading="lazy" alt="A person drawn in rows of points, one arm raised in a wave, as a LiDAR sensor would see them" />
			</picture></a
		>
		<figcaption><i>Fig. 1.</i> Hello, as a LiDAR scanner would see it (an illustration). <a href="/about">More of my work, in points</a>.</figcaption>
	</figure>
</section>

<section aria-labelledby="projects">
	<h2 class="sec" id="projects"><a href="/projects">Projects</a></h2>
	<div class="projects">
		{#each shown as project (project.name)}
			<ProjectFigure {project} />
		{/each}
	</div>
	<ul class="more">
		{#each listed as project (project.name)}
			<li>
				<span class="meta">{project.year} · {project.stack}</span>
				<p>
					<b>{project.name}.</b>
					{project.summary}
					<span class="inline-links">
						{#each project.links as link (link.href)}<a href={link.href} data-sveltekit-reload={isOtherSite(link.href) || undefined}>{link.label}</a>{/each}
					</span>
				</p>
			</li>
		{/each}
	</ul>
	<p class="all"><a href="/projects">All projects</a></p>
</section>

<div class="lower">
<section aria-labelledby="writing">
	<h2 class="sec" id="writing"><a href="/blog">Writing</a></h2>
	<ul class="dated">
		{#each data.posts as post (post.slug)}
			<li>
				<time datetime={post.date}>{shortDate(post.date)}</time>
				<a href="/{post.slug}">{post.title}</a>
			</li>
		{/each}
	</ul>
</section>

<section aria-labelledby="papers">
	<h2 class="sec" id="papers"><a href="/about#papers">Papers</a></h2>
	<ul class="dated papers">
		{#each papers as paper (paper.href)}
			<li>
				<span class="yr">{paper.year}</span>
				<span><a href={paper.href}>{paper.title}</a><span class="by">{paper.venue}</span></span>
			</li>
		{/each}
	</ul>
</section>
</div>
