<script lang="ts">
	import { onMount } from 'svelte';
	import { papers } from '$lib/config/papers';
	import { projects } from '$lib/config/projects';

	// Five stills with captions are the content. With JS and motion allowed, the point-cloud scene
	// (src/lib/about-scene/scene.js) replaces them, reading the same captions; it loads only near view.
	// Links come from the config, so a moved DOI or repo is fixed in one place.
	const paperHref = (year: number) => papers.find((p) => p.year === year)!.href;
	const herdrHref = projects.find((p) => p.name === 'herdr-pwa')!.links.find((l) => l.label === 'code')!.href;

	let fig: HTMLElement;
	let interactive = $state(false);

	onMount(() => {
		if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let stop: (() => void) | undefined;
		let cancelled = false;
		interactive = true;
		const near = new IntersectionObserver(
			async (entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				near.disconnect();
				const { mountScene } = await import('$lib/about-scene/scene.js');
				if (!cancelled) stop = mountScene(fig);
			},
			{ rootMargin: '400px 0px' }
		);
		near.observe(fig);
		return () => {
			cancelled = true;
			near.disconnect();
			stop?.();
		};
	});
</script>

<figure class="scene" class:js={interactive} bind:this={fig} aria-label="The same points re-forming through five pieces of my work">
	<div class="frame"><canvas aria-hidden="true"></canvas></div>
	<div class="ui">
		<button type="button" class="prev">Previous</button>
		<span class="count" aria-hidden="true">1 of 5</span>
		<button type="button" class="next">Next</button>
		<button type="button" class="play">Pause</button>
	</div>
	<ol class="stills">
		<li>
			<img src="/about-scene/stills/1.webp" width="600" height="375" loading="lazy" decoding="async" alt="About 3,200 stars as dots sized by brightness, with one ringed at the centre" />
			<p class="c"><b>2019. Stars.</b> Every star brighter than <i>G</i>&#8239;=&#8239;20.5 within 0.6° of SDSS J151905.90+500702.9, a dwarf carbon star (ringed). We detected it and five others in X-rays with Chandra. Positions and brightness are from Gaia DR3. <a href={paperHref(2019)}>ApJ 881, 49</a></p>
		</li>
		<li>
			<img src="/about-scene/stills/2.webp" width="600" height="375" loading="lazy" decoding="async" alt="A person drawn in a coarse grid of dots, one hand raised in a wave, seen a little from the side" />
			<p class="c"><b>2020. LiDAR.</b> Me waving at a 160 × 60 depth LiDAR, played back at its own nine frames a second. Turned a little, you can see it only measured the side facing it. In LAMAR we used scans like this to tell what several people in a room were doing. <a href={paperHref(2020)}>MobiQuitous 2020</a></p>
		</li>
		<li>
			<img src="/about-scene/stills/3.webp" width="600" height="375" loading="lazy" decoding="async" alt="Two boxes: on the left a tight tangle of steps near the centre, on the right a path with long straight runs across the box" />
			<p class="c"><b>2022. Search.</b> Two simulated searchers start in the middle of a box and move at the same speed for the same time. The Brownian one turns at every step. The Lévy one holds a heading for a heavy-tailed distance, so it reaches much more of the box. The percentages are the share of a 20 by 20 grid each one visited. <a href={paperHref(2022)}>IEEE SSCI 2022</a></p>
		</li>
		<li>
			<img src="/about-scene/stills/4.webp" width="600" height="375" loading="lazy" decoding="async" alt="A lumpy globe of dots coloured from blue for low to red for high" />
			<p class="c"><b>2025. The geoid.</b> Earth’s geoid from the EGM2008 gravity model, with its height exaggerated 5,000 times. It runs from 106&#8239;m below the ellipsoid south of India (blue) to 87&#8239;m above it near New Guinea (red). <a href="/geoid-globe/" data-sveltekit-reload>geoid-globe</a></p>
		</li>
		<li>
			<img src="/about-scene/stills/5.webp" width="600" height="375" loading="lazy" decoding="async" alt="Four small robots made of dots walking out on separate lanes from one line, one stopped with a question mark" />
			<p class="c"><b>Now. Parallel agents.</b> Most of my work now runs as several AI coding agents at once, each on its own slice in its own copy of the repo, merged and checked at the end. I watch them with <a href={herdrHref}>herdr-pwa</a>.</p>
		</li>
	</ol>
	<figcaption class="live" aria-live="polite"></figcaption>
</figure>
