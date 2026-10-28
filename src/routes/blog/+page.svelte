<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import DatedList from '$lib/components/DatedList.svelte';
	import { postEntries } from '$lib/utils/entries';
	import { site } from '$lib/config/site';

	let { data } = $props();
</script>

<Seo title="Writing" description="Posts by {site.name} on geospatial data, visualization and tools for AI agents." />

<section class="intro">
	<h1>Writing</h1>
</section>

<DatedList entries={postEntries(data.posts, true)} />
