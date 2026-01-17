<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>blog - {data.post.title}</title>
	{#if data.post.excerpt}
		<meta name="description" content={data.post.excerpt} />
	{/if}
	{#if data.post.tags && data.post.tags.length > 0}
		<meta name="tags" content={data.post.tags.join(', ')} />
	{/if}
</svelte:head>

<article class="post-content">
	<header>
		<h1>{data.post.title}</h1>
	</header>
	{@html data.post.content}
</article>
