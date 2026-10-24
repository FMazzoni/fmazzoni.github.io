<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { shortDate } from '$lib/utils/dates';

	let { data } = $props();
</script>

<Seo title="Writing" description="Posts by Fernando on geospatial data, visualization and the tools he builds." />

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
