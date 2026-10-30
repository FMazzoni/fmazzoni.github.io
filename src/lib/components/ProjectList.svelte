<script lang="ts">
	import type { Project } from '$lib/config/projects';
	import { isOtherSite } from '$lib/config/site';

	// Projects without a figure, one line each, in two columns that line up with the figure grid.
	// `all` adds a last cell linking to the full list.
	let { projects, all }: { projects: Project[]; all?: { label: string; href: string } } = $props();
</script>

<ul class="more">
	{#each projects as project (project.name)}
		<li>
			<span class="meta">{project.year} · {project.stack}</span>
			<p>
				<b>{project.name}.</b>
				{project.summary}
				<span class="inline-links">
					{#each project.links as link (link.href)}<a href={link.href} aria-label="{project.name} {link.label}" data-sveltekit-reload={isOtherSite(link.href) || undefined}>{link.label}</a>{/each}
				</span>
			</p>
		</li>
	{/each}
	{#if all}<li class="all"><a href={all.href}>{all.label}</a></li>{/if}
</ul>
