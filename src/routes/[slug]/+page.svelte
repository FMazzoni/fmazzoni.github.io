<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { longDate } from '$lib/utils/dates';

	let { data } = $props();
	const post = $derived(data.post);
</script>

<Seo title={post.title} description={post.excerpt} type="article" published={post.date} />

<article class="post">
	<header>
		<h1>{post.title}</h1>
		<p class="byline"><time datetime={post.date}>{longDate(post.date)}</time></p>
	</header>
	<div class="post-body">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- the owner's Markdown, rendered at build time (ruly: html-from-content-pipeline) -->
		{@html post.html}
	</div>
	{#if data.newer || data.older}
		<nav class="post-nav" aria-label="More posts">
			<span>{#if data.older}Older: <a href="/{data.older.slug}">{data.older.title}</a>{/if}</span>
			<span>{#if data.newer}Newer: <a href="/{data.newer.slug}">{data.newer.title}</a>{/if}</span>
		</nav>
	{/if}
</article>
