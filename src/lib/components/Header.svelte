<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { siteConfig } from '$lib/config/site';

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		// Prevent body scroll when menu is open (only in browser)
		if (browser) {
			if (mobileMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	}

	// Close mobile menu when clicking on a link
	function handleNavClick() {
		mobileMenuOpen = false;
		if (browser) {
			document.body.style.overflow = '';
		}
	}

	// Close mobile menu on navigation
	$: if (browser && $page.url.pathname) {
		mobileMenuOpen = false;
		document.body.style.overflow = '';
	}

	const navItems = [
		{ title: 'about', href: '/' },
		{ title: 'blog', href: '/blog' }
	];
</script>

<header>
	<nav class="desktop-nav">
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

	<div class="header-controls">
		<button
			class="mobile-menu-toggle"
			class:active={mobileMenuOpen}
			title="Toggle navigation menu"
			aria-label="Toggle navigation menu"
			aria-expanded={mobileMenuOpen}
			on:click={toggleMobileMenu}
		>
			<div class="hamburger-icon">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</button>

		<button class="theme-toggle" title="Toggle theme" aria-label="Toggle dark/light mode"></button>
	</div>

	<nav class="mobile-nav" class:active={mobileMenuOpen}>
		<ul>
			{#each navItems as item}
				<li>
					<a href={item.href} aria-current={$page.url.pathname === item.href ? 'page' : undefined} on:click={handleNavClick}>
						{item.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
