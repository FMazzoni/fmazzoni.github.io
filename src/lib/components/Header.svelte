<script lang="ts">
	import { page } from '$app/state';
	import { nav, site } from '$lib/config/site';
	import ThemeToggle from './ThemeToggle.svelte';

	const current = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`) ? 'page' : undefined;
</script>

<header class="site">
	<a class="name" href="/">{site.name}</a>
	<nav aria-label="Main">
		{#each nav as item (item.href)}
			<a href={item.href} aria-current={current(item.href)}>{item.title}</a>
		{/each}
	</nav>
	<ThemeToggle />
</header>
