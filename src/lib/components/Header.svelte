<script lang="ts">
	import { page } from '$app/stores';
	import { siteConfig } from '$lib/config/site';

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	const navItems = [
		{ title: 'about', href: '/' },
		{ title: 'blog', href: '/blog' }
	];
</script>

<header>
	<nav>
		<ul>
			{#each navItems as item}
				<li>
					<a href={item.href} aria-current={$page.url.pathname === item.href ? 'page' : undefined}>
						{item.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<button
		class="mobile-menu-toggle"
		title="Toggle navigation menu"
		aria-label="Toggle navigation menu"
		on:click={toggleMobileMenu}
	>
		<div class="hamburger-icon">
			<span></span>
			<span></span>
			<span></span>
		</div>
	</button>

	{#if mobileMenuOpen}
		<nav class="mobile-nav">
			<ul>
				{#each navItems as item}
					<li>
						<a href={item.href} aria-current={$page.url.pathname === item.href ? 'page' : undefined}>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	<button class="theme-toggle" title="Toggle theme" aria-label="Toggle dark/light mode"></button>
</header>
