<script lang="ts">
	import { site } from '$lib/config/site';
</script>

<footer class="site">
	{#each site.social as link (link.url)}
		<a href={link.url}>{link.name}</a>
	{/each}
	<a href="/rss.xml">RSS</a>
</footer>
