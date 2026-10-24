<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config/site';

	// Every page sets its own title, description, canonical URL and link-preview tags through this.
	let {
		title,
		description = site.description,
		type = 'website',
		published
	}: { title?: string; description?: string; type?: 'website' | 'article'; published?: string } = $props();

	const fullTitle = $derived(title ? `${title} · ${site.name}` : site.name);
	const canonical = $derived(`${site.url}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={title ?? site.name} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
	{#if published}
		<meta property="article:published_time" content={published} />
	{/if}
</svelte:head>
