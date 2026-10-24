<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'dark' | 'light';

	// Until the visitor picks one, the CSS follows the system setting; this mirrors it for aria-pressed.
	let theme = $state<Theme>('dark');

	onMount(() => {
		const light = matchMedia('(prefers-color-scheme: light)');
		const sync = () => {
			const chosen = document.documentElement.dataset.theme;
			theme = chosen === 'light' || chosen === 'dark' ? chosen : light.matches ? 'light' : 'dark';
		};
		sync();
		light.addEventListener('change', sync);
		return () => light.removeEventListener('change', sync);
	});

	function choose(next: Theme) {
		theme = next;
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage blocked: the choice lasts for this page only.
		}
	}
</script>

<div class="mode" role="group" aria-label="Colour theme">
	<button type="button" aria-pressed={theme === 'dark'} onclick={() => choose('dark')}>Dark</button>
	<button type="button" aria-pressed={theme === 'light'} onclick={() => choose('light')}>Light</button>
</div>
