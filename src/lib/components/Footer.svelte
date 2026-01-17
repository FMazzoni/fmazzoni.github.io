<script lang="ts">
	import { siteConfig } from '$lib/config/site';

	const currentYear = new Date().getFullYear();
</script>

<footer>
	{#each siteConfig.social as social}
		<a href={social.url}>
			<i class={social.icon}></i> {social.name}
		</a>
	{/each}
	<p>© {currentYear} {siteConfig.author}. All rights reserved.</p>
</footer>
