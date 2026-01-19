<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { siteConfig } from '$lib/config/site';
	import { calculateReadingTime, formatReadingTime } from '$lib/utils/reading-time';
	import { format } from 'date-fns';

	export let data: PageData;

	// Calculate reading time from post content
	$: readingTime = formatReadingTime(calculateReadingTime(data.post.content));

	// Get plain text excerpt for meta tags (strip HTML)
	$: plainExcerpt = data.post.excerpt
		? data.post.excerpt.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160)
		: data.post.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160) || `${data.post.title} - ${siteConfig.author}'s blog`;

	// Get full URL for this post
	$: postUrl = `${siteConfig.url}${$page.url.pathname}`;
</script>

<svelte:head>
	<title>{data.post.title} - {siteConfig.name}</title>
	
	<!-- Basic Meta -->
	<meta name="description" content={plainExcerpt} />
	{#if data.post.tags && data.post.tags.length > 0}
		<meta name="keywords" content={data.post.tags.join(', ')} />
	{/if}
	
	<!-- Canonical URL -->
	<link rel="canonical" href={postUrl} />
	
	<!-- Open Graph / Bluesky Meta Tags -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={plainExcerpt} />
	<meta property="og:url" content={postUrl} />
	<meta property="og:site_name" content={siteConfig.name} />
	{#if data.post.date}
		<meta property="article:published_time" content={new Date(data.post.date).toISOString()} />
	{/if}
	{#if data.post.tags && data.post.tags.length > 0}
		{#each data.post.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	
	<!-- Twitter Card (also used by Bluesky) -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={plainExcerpt} />
</svelte:head>

<article class="post-content">
	<header>
		<h1>{data.post.title}</h1>
		<div class="post-meta">
			{#if data.post.date}
				<time datetime={data.post.date} class="post-date">
					{format(new Date(data.post.date), 'MMMM d, yyyy')}
				</time>
			{/if}
			<span class="post-reading-time">{readingTime}</span>
			{#if data.post.tags && data.post.tags.length > 0}
				<div class="post-tags">
					{#each data.post.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
	</header>
	{@html data.post.content}
</article>
