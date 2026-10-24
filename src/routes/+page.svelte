<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProjectFigure from '$lib/components/ProjectFigure.svelte';
	import { site } from '$lib/config/site';
	import { projects } from '$lib/config/projects';
	import { shortDate } from '$lib/utils/dates';

	let { data } = $props();

	const featured = projects.filter((p) => p.featured);
</script>

<Seo />

<section class="intro">
	<h1>{site.intro}</h1>
</section>

<section aria-labelledby="projects">
	<h2 class="sec" id="projects"><a href="/projects">Projects</a></h2>
	<div class="projects">
		{#each featured as project (project.name)}
			<ProjectFigure {project} />
		{/each}
	</div>
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
