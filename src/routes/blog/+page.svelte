<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { shortDate } from '$lib/utils/dates';
	import { site } from '$lib/config/site';

	let { data } = $props();
</script>

<Seo title="Writing" description="Posts by {site.name} on geospatial data, visualization and tools for AI agents." />

<section class="intro">
	<h1>Writing</h1>
</section>

<ul class="dated">
	{#each data.posts as post (post.slug)}
		<li>
			<time datetime={post.date}>{shortDate(post.date)}</time>
			<span>
				<a href="/{post.slug}">{post.title}</a>
				{#if post.excerpt}<span class="excerpt">{post.excerpt}</span>{/if}
			</span>
		</li>
	{/each}
</ul>
