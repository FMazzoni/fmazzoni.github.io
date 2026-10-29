<script lang="ts">
	import type { Project } from '$lib/config/projects';
	import { isOtherSite } from '$lib/config/site';

	// `fig` numbers it as a paper numbers its figures.
	let { project, fig }: { project: Project; fig: number } = $props();

	// Several shots are phone screens, set side by side as labelled panes; one shot fills the matte.
	const phones = $derived((project.shots?.length ?? 0) > 1);
</script>

<div class="cell">
	{#if project.shots}
		<div class="frame" class:phones class:single={!phones}>
			{#each project.shots as shot (shot.src)}
				{#if phones}
					<span class="pane">
						<img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
						{#if shot.tag}<span class="tag">{shot.tag}</span>{/if}
					</span>
				{:else}
					<img class:shot-dark={!!shot.lightSrc} src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
					{#if shot.lightSrc}
						<img class="shot-light" src={shot.lightSrc} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
					{/if}
				{/if}
			{/each}
		</div>
	{/if}
	<div class="label">
		<span class="meta"><i>Fig. {fig}.</i> {project.year} · {project.stack}</span>
		<p><b>{project.name}.</b> {project.summary}</p>
		{#if project.subcaption}<span class="subcap">{project.subcaption}</span>{/if}
		<div class="links">
			{#each project.links as link (link.href)}
				<a href={link.href} data-sveltekit-reload={isOtherSite(link.href) || undefined}>{link.label}</a>
			{/each}
		</div>
	</div>
</div>
