<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { siteConfig } from '$lib/config/site';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';

	let { children } = $props();

	// Convert Mermaid code blocks to Mermaid divs (needed for pre-rendered HTML)
	function convertMermaidCodeBlocks() {
		if (typeof window === 'undefined') return;

		// Find all code blocks with mermaid language that haven't been processed
		const mermaidBlocks = document.querySelectorAll('pre code.language-mermaid, pre code[class*="mermaid"]');
		
		mermaidBlocks.forEach((block: Element) => {
			const preElement = block.parentElement;
			if (!preElement || preElement.classList.contains('mermaid-converted')) return;

			const mermaidCode = block.textContent?.trim();
			if (!mermaidCode) return;

			// Create a new div for the Mermaid diagram
			const mermaidDiv = document.createElement('div');
			mermaidDiv.className = 'mermaid';
			mermaidDiv.textContent = mermaidCode;

			// Replace the code block with the Mermaid div
			preElement.parentElement?.replaceChild(mermaidDiv, preElement);
			// Mark the parent as converted (but don't mark mermaid div yet - let Mermaid process it)
			preElement.classList.add('mermaid-converted');
		});
	}

	// Re-render libraries - simplified and more reliable
	async function renderLibraries() {
		if (typeof window === 'undefined') return;

		// Wait for Svelte to finish updating the DOM
		await tick();

		// Wait for content to be fully in DOM (especially for {@html} content)
		await new Promise((resolve) => setTimeout(resolve, 150));

		// First, convert Mermaid code blocks to divs (for pre-rendered HTML)
		convertMermaidCodeBlocks();

		// Re-render MathJax v3 - clear previous typeset math first
		const MathJax = (window as any).MathJax;
		if (MathJax) {
			// Clear all previously typeset math to avoid duplicate labels
			MathJax.typesetClear?.();
			// Reset equation numbering
			MathJax.texReset?.();
			// Typeset the new content
			MathJax.typesetPromise?.();
		}

		// Re-render Mermaid (using run() method for Mermaid 10.x)
		if ((window as any).mermaid) {
			try {
				// Run Mermaid on all .mermaid elements
				(window as any).mermaid.run();
			} catch (e) {
				// If run() fails, try init() as fallback
				console.warn('Mermaid run() failed, trying init()', e);
				if ((window as any).mermaid.init) {
					(window as any).mermaid.init();
				}
			}
		}

		// Re-highlight code (mermaid blocks already converted, so Prism will skip them)
		if ((window as any).Prism) {
			(window as any).Prism.highlightAll();
		}
	}

	// Initialize libraries after DOM loads
	onMount(() => {
		if (typeof window !== 'undefined') {
			// Configure Prism.js autoloader (only needs to be done once)
			if ((window as any).Prism) {
				(window as any).Prism.plugins.autoloader.languages_path =
					'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
			}

			// Initialize Mermaid (only needs to be done once)
			if ((window as any).mermaid) {
				(window as any).mermaid.initialize({
					startOnLoad: false, // We'll manually trigger rendering
					theme: 'dark',
					themeVariables: {
						primaryColor: '#58a6ff',
						primaryTextColor: '#e6edf3',
						primaryBorderColor: '#30363d',
						lineColor: '#8b949e',
						secondaryColor: '#161b22',
						tertiaryColor: '#21262d',
						background: '#0d1117',
						mainBkg: '#161b22',
						secondBkg: '#21262d',
						tertiaryBkg: '#30363d',
						// Text colors for labels
						textColor: '#e6edf3',
						secondaryTextColor: '#8b949e',
						tertiaryTextColor: '#7d8590',
						// Node text colors
						nodeTextColor: '#e6edf3',
						// Edge label colors
						edgeLabelBackground: '#161b22',
						clusterBkg: '#21262d',
						clusterBorder: '#30363d',
						defaultLinkColor: '#58a6ff',
						titleColor: '#f0f6fc',
						// Font settings
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '16px'
					},
					flowchart: {
						htmlLabels: false, // Use SVG labels instead of HTML for better compatibility
						curve: 'basis',
						// Ensure text is visible
						useMaxWidth: true,
						wrap: true
					},
					sequence: {
						diagramMarginX: 50,
						diagramMarginY: 10,
						actorMargin: 50,
						width: 150,
						height: 65,
						boxMargin: 10,
						boxTextMargin: 5,
						noteMargin: 10,
						messageMargin: 35,
						mirrorActors: true,
						bottomMarginAdj: 1,
						useMaxWidth: true,
						rightAngles: false,
						showSequenceNumbers: false
					},
					gantt: {
						titleTopMargin: 25,
						diagramMarginX: 50,
						diagramMarginY: 10,
						gridLineStartPadding: 35,
						fontSize: 11,
						fontFamily: '"JetBrains Mono", "Fira Code", monospace',
						sectionFontSize: 24,
						numberSectionStyles: 4
					}
				});
			}

			// Initial render after libraries are initialized
			renderLibraries();
		}
	});

	// Re-render on client-side navigation
	afterNavigate(() => {
		renderLibraries();
	});
</script>

<svelte:head>
	<title>{siteConfig.name}</title>
	<meta name="description" content="{siteConfig.author}'s blog" />
	<link rel="canonical" href={siteConfig.url} />

	<!-- External CSS -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/holiday.css@0.11.2" />
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>

	<!-- Prism.js -->
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-vsc-dark-plus.min.css"
		rel="stylesheet"
		media="(prefers-color-scheme: dark)"
	/>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css"
		rel="stylesheet"
		media="(prefers-color-scheme: light)"
	/>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

	<!-- MathJax v3 Configuration -->
	<script>
		window.MathJax = {
			tex: {
				inlineMath: [['$','$'], ['\\(','\\)']],
				displayMath: [['$$','$$'], ['\\[','\\]']],
				tags: 'ams',
				tagSide: 'right'
			},
			options: {
				skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
			}
		};
	</script>
	<!-- MathJax v3 -->
	<script
		type="text/javascript"
		id="MathJax-script"
		async
		src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
	></script>

	<!-- Mermaid -->
	<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>

	<!-- Custom JS -->
	<script src="/js/theme-toggle.js"></script>
	<script src="/js/safe-highlighting.js"></script>
	<script src="/js/mobile-navigation.js"></script>
	<script src="/js/copy-code-button.js"></script>
</svelte:head>

<Header />
<main>
	{@render children()}
</main>
<Footer />
