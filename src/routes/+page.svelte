<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import { isOtherSite, site } from '$lib/config/site';
	import { projects } from '$lib/config/projects';
	import { shortDate } from '$lib/utils/dates';

	let { data } = $props();

	// Home shows the first two projects with their screenshots and the rest as one line each;
	// /projects is the full set.
	const shown = projects.filter((p) => p.featured).slice(0, 2);
	const listed = projects.filter((p) => !shown.includes(p));
</script>

<Seo />

<section class="intro with-figure">
	<h1>{site.intro}</h1>
	<figure class="hello">
		<a href="/about"
			><img src="/images/hello-wave.webp" width="800" height="936" alt="A person drawn in rows of points, one arm raised in a wave, as a LiDAR sensor would see them" /></a
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
</section>

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
