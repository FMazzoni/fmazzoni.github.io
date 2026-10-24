<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import { startWalk } from '$lib/walk404';

	let canvas: HTMLCanvasElement | undefined = $state();
	let note = $state('In two dimensions a random walk always finds its way home, though it can take a while.');
	let running = $state(true);
	let again = $state<() => void>(() => {});

	const missing = $derived(page.status === 404);

	onMount(() => {
		if (!canvas) return;
		const stop = startWalk({
			canvas,
			setNote: (text) => (note = text),
			setRunning: (value) => (running = value)
		});
		again = stop.again;
		return stop;
	});
</script>

<Seo title={missing ? 'Page not found' : 'Something went wrong'} />

<section class="lost">
	<h1>{missing ? 'This page wandered off.' : 'Something went wrong.'}</h1>
	<canvas bind:this={canvas} width="960" height="360" aria-hidden="true"></canvas>
	<p class="note" aria-live="polite">{note}</p>
	<div class="actions">
		<button class="again" type="button" disabled={running} onclick={again}>Walk again</button>
		<a href="/">Go home</a>
	</div>
</section>
