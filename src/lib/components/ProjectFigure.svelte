<script lang="ts">
	import type { Project } from '$lib/config/projects';
	import { isOtherSite } from '$lib/config/site';

	let { project }: { project: Project } = $props();

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
					<img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
				{/if}
			{/each}
		</div>
	{/if}
	<div class="label">
		<span class="meta">{project.year} · {project.stack}</span>
		<p><b>{project.name}.</b> {project.summary}</p>
		{#if project.subcaption}<span class="subcap">{project.subcaption}</span>{/if}
		<div class="links">
			{#each project.links as link (link.href)}
				<a href={link.href} data-sveltekit-reload={isOtherSite(link.href) || undefined}>{link.label}</a>
			{/each}
		</div>
	</div>
</div>
