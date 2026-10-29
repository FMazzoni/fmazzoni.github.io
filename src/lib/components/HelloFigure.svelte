<script lang="ts">
	import { onMount } from 'svelte';

	// Fig. 1: a still of the wave in each theme's ink (the other theme's copy never loads). With JS,
	// a canvas draws the real capture live from the About scene's data and the still steps aside.
	let fig: HTMLElement;
	let live = $state(false);
	const alt = 'A person drawn in points, one hand raised in a wave, as a low-resolution depth LiDAR captured them';

	onMount(() => {
		let stop: (() => void) | undefined;
		let cancelled = false;
		import('$lib/about-scene/hello.js')
			.then(({ mountHello }) => mountHello(fig))
			.then((s) => {
				if (cancelled) s();
				else { stop = s; live = true; }
			})
			.catch(() => {}); // the still stays
		return () => {
			cancelled = true;
			stop?.();
		};
	});
</script>

<figure class="hello" class:live bind:this={fig}>
	<a href="/about">
		<img class="hello-dark" src="/images/hello-wave-dark-still.webp" width="480" height="640" loading="lazy" {alt} />
		<img class="hello-light" src="/images/hello-wave-light-still.webp" width="480" height="640" loading="lazy" {alt} />
		<canvas aria-hidden="true"></canvas>
	</a>
	<figcaption><i>Fig. 1.</i> Me, waving at a 160 × 60 depth LiDAR in 2020. A real capture. <a href="/about">More of my work, in points</a>.</figcaption>
</figure>
