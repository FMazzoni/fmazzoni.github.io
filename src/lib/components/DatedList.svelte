<script lang="ts">
	import type { Entry } from '$lib/utils/entries';

	// One row per entry: the date in a gutter, then the title and an optional note. Writing and
	// papers both use it, on the home page and on their own pages.
	let { entries, years = false }: { entries: Entry[]; years?: boolean } = $props();
</script>

<ul class="dated" class:years>
	{#each entries as entry (entry.href)}
		<li>
			{#if entry.datetime}<time datetime={entry.datetime}>{entry.when}</time>{:else}<span class="when">{entry.when}</span>{/if}
			<span>
				<a href={entry.href}>{entry.title}</a>
				{#if entry.note || entry.extra}
					<span class="note">
						{entry.note}
						{#if entry.extra}<a href={entry.extra.href}>{entry.extra.label}</a>{/if}
					</span>
				{/if}
			</span>
		</li>
	{/each}
</ul>
