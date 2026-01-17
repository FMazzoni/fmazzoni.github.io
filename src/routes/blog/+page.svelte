<script lang="ts">
	import type { PageData } from './$types';
	import { format } from 'date-fns';

	export let data: PageData;
</script>

<svelte:head>
	<title>blog - All Posts</title>
</svelte:head>

<article>
	{#each data.posts as post}
		<article class="summary-content">
			<header>
				<h1>
					<a href="/{post.slug}" rel="bookmark" title="Permalink to {post.title}">
						{post.title}
					</a>
				</h1>
			</header>
			<section>
				{#if post.excerpt}
					{@html post.excerpt}
				{:else}
					{@html post.content.split('\n').slice(0, 3).join('\n')}
				{/if}
			</section>
			<footer>
				<em>
					<time datetime={post.date}>
						{format(new Date(post.date), 'MMM dd yy')}
					</time>
				</em>
			</footer>
		</article>
	{/each}
</article>
