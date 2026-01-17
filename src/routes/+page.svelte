<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>blog - {data.page.title}</title>
</svelte:head>

<article class="post-content">
	<header>
		<h1>{data.page.title}</h1>
	</header>
	{@html data.page.content}
</article>
