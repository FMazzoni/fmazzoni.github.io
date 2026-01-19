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
			// Store the source for theme re-rendering
			mermaidDiv.dataset.mermaidSource = mermaidCode;

			// Replace the code block with the Mermaid div
			preElement.parentElement?.replaceChild(mermaidDiv, preElement);
			// Mark the parent as converted (but don't mark mermaid div yet - let Mermaid process it)
			preElement.classList.add('mermaid-converted');
		});
		
		// Also ensure existing .mermaid elements have their source stored
		const existingMermaidElements = document.querySelectorAll('.mermaid:not([data-mermaid-source])');
		existingMermaidElements.forEach((element: Element) => {
			const mermaidEl = element as HTMLElement;
			// If not yet rendered, store the text content
			if (!mermaidEl.querySelector('svg')) {
				const source = mermaidEl.textContent?.trim() || mermaidEl.innerText?.trim() || '';
				if (source) {
					mermaidEl.dataset.mermaidSource = source;
				}
			}
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
				// Ensure all .mermaid elements have their source stored before rendering
				const mermaidElements = document.querySelectorAll('.mermaid:not([data-mermaid-source])');
				mermaidElements.forEach((element: Element) => {
					const mermaidEl = element as HTMLElement;
					if (!mermaidEl.querySelector('svg')) {
						const source = mermaidEl.textContent?.trim() || mermaidEl.innerText?.trim() || '';
						if (source) {
							mermaidEl.dataset.mermaidSource = source;
						}
					}
				});
				
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
					'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
			}

			// Get current theme
			function getCurrentTheme(): string {
				return document.documentElement.getAttribute('data-theme') || 'dark';
			}

			// Get theme variables based on current theme
			function getMermaidThemeVariables(theme: string) {
				if (theme === 'light') {
					return {
						primaryColor: '#528bff',
						primaryTextColor: '#24292e',
						primaryBorderColor: '#e1e4e8',
						lineColor: '#586069',
						secondaryColor: '#f6f8fa',
						tertiaryColor: '#fafbfc',
						background: '#ffffff',
						mainBkg: '#f6f8fa',
						secondBkg: '#fafbfc',
						tertiaryBkg: '#ffffff',
						textColor: '#24292e',
						secondaryTextColor: '#586069',
						tertiaryTextColor: '#6a737d',
						nodeTextColor: '#24292e',
						edgeLabelBackground: '#f6f8fa',
						clusterBkg: '#fafbfc',
						clusterBorder: '#e1e4e8',
						defaultLinkColor: '#0366d6',
						titleColor: '#24292e',
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '16px'
					};
				} else {
					// Dark theme
					return {
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
						textColor: '#e6edf3',
						secondaryTextColor: '#8b949e',
						tertiaryTextColor: '#7d8590',
						nodeTextColor: '#e6edf3',
						edgeLabelBackground: '#161b22',
						clusterBkg: '#21262d',
						clusterBorder: '#30363d',
						defaultLinkColor: '#58a6ff',
						titleColor: '#f0f6fc',
						fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
						fontSize: '16px'
					};
				}
			}

			// Initialize/update Mermaid theme
			function initializeMermaid() {
				if ((window as any).mermaid) {
					const theme = getCurrentTheme();
					(window as any).mermaid.initialize({
						startOnLoad: false,
						theme: theme === 'light' ? 'default' : 'dark',
						themeVariables: getMermaidThemeVariables(theme),
						flowchart: {
							htmlLabels: false,
							curve: 'basis',
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
			}

			// Update Mermaid theme and re-render
			async function updateMermaidTheme() {
				if ((window as any).mermaid) {
					try {
						// Ensure all Mermaid elements have their source stored
						convertMermaidCodeBlocks();
						
						// Get all Mermaid diagrams
						const mermaidElements = document.querySelectorAll('.mermaid');
						
						// Restore source for re-rendering and reset element state
						mermaidElements.forEach((element: Element) => {
							const mermaidEl = element as HTMLElement;
							
							// Get the source from data attribute (should be stored before first render)
							let source = mermaidEl.dataset.mermaidSource;
							
							// If no stored source and element hasn't been rendered yet, store current text
							if (!source && !mermaidEl.querySelector('svg')) {
								source = mermaidEl.textContent?.trim() || mermaidEl.innerText?.trim() || '';
								if (source) {
									mermaidEl.dataset.mermaidSource = source;
								}
							}
							
							// If we have a source, restore it
							if (source) {
								// Completely clear the element
								mermaidEl.innerHTML = '';
								
								// Set the text content (Mermaid reads from textContent)
								mermaidEl.textContent = source;
								
								// Remove any Mermaid processing markers that might prevent re-rendering
								mermaidEl.removeAttribute('data-processed');
								mermaidEl.removeAttribute('id'); // Mermaid might add IDs
								mermaidEl.classList.remove('mermaid-processed');
								
								// Ensure only the mermaid class is present (clean state)
								mermaidEl.className = 'mermaid';
								
								// Ensure the source is still stored
								if (!mermaidEl.dataset.mermaidSource) {
									mermaidEl.dataset.mermaidSource = source;
								}
							}
						});
						
						// Re-initialize with new theme
						initializeMermaid();
						
						// Wait for initialization and DOM updates
						await new Promise((resolve) => setTimeout(resolve, 200));
						
						// Re-render all Mermaid diagrams
						// Mermaid 10.x run() method processes all .mermaid elements automatically
						if ((window as any).mermaid.run) {
							const result = (window as any).mermaid.run();
							// run() may return a promise
							if (result && typeof result.then === 'function') {
								await result;
							}
						} else if ((window as any).mermaid.init) {
							// Fallback for older Mermaid versions
							(window as any).mermaid.init();
						}
					} catch (e) {
						console.warn('Mermaid re-render failed:', e);
						// Try a simpler approach as fallback
						try {
							// Re-initialize and try run again
							initializeMermaid();
							await new Promise((resolve) => setTimeout(resolve, 150));
							if ((window as any).mermaid.run) {
								const result = (window as any).mermaid.run();
								if (result && typeof result.then === 'function') {
									await result;
								}
							}
						} catch (e2) {
							console.error('Mermaid re-render fallback also failed:', e2);
						}
					}
				}
			}

			// Update MathJax to reflect theme changes
			async function updateMathJaxTheme() {
				const MathJax = (window as any).MathJax;
				if (MathJax) {
					try {
						// Wait a bit for CSS variables to update
						await new Promise((resolve) => setTimeout(resolve, 100));
						
						// Get all math elements
						const mathElements = document.querySelectorAll('.MathJax, mjx-container, [class*="MathJax"]');
						
						// Clear previous typeset math
						if (MathJax.typesetClear) {
							MathJax.typesetClear();
						}
						
						// Reset equation numbering
						if (MathJax.texReset) {
							MathJax.texReset();
						}
						
						// Re-typeset all math with new theme colors
						if (MathJax.typesetPromise) {
							await MathJax.typesetPromise();
						} else if (MathJax.typeset) {
							// Fallback for older MathJax versions
							MathJax.typeset();
						}
					} catch (e) {
						console.warn('MathJax re-render failed:', e);
					}
				}
			}

			// Initialize Mermaid
			initializeMermaid();

			// Watch for theme changes
			if (typeof MutationObserver !== 'undefined') {
				const themeObserver = new MutationObserver(async (mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
							// Update Mermaid theme
							updateMermaidTheme();
							// Update MathJax theme
							updateMathJaxTheme();
						}
					});
				});

				themeObserver.observe(document.documentElement, {
					attributes: true,
					attributeFilter: ['data-theme']
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

	<!-- Prism.js - Themes will be loaded dynamically based on data-theme -->
	<link
		id="prism-dark-theme"
		href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-atom-dark.css"
		rel="stylesheet"
		media="none"
	/>
	<link
		id="prism-light-theme"
		href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-one-light.css"
		rel="stylesheet"
		media="none"
	/>
	<script>
		// Update Prism theme based on data-theme attribute
		function updatePrismTheme() {
			const theme = document.documentElement.getAttribute('data-theme') || 'dark';
			const darkLink = document.getElementById('prism-dark-theme');
			const lightLink = document.getElementById('prism-light-theme');
			
			if (darkLink && lightLink) {
				if (theme === 'light') {
					darkLink.media = 'none';
					lightLink.media = 'all';
				} else {
					darkLink.media = 'all';
					lightLink.media = 'none';
				}
			}
		}
		
		// Set initial theme
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() {
				// Wait a bit for theme-toggle.js to set initial theme
				setTimeout(updatePrismTheme, 100);
			});
		} else {
			setTimeout(updatePrismTheme, 100);
		}
		
		// Watch for theme changes
		if (typeof MutationObserver !== 'undefined') {
			const observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
						updatePrismTheme();
					}
				});
			});
			
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ['data-theme']
			});
		}
	</script>
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

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
				skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
				ignoreHtmlClass: 'tex2jax_ignore',
				processHtmlClass: 'tex2jax_process'
			},
			svg: {
				fontCache: 'global'
			}
		};
		// Suppress MathJax warnings
		if (window.console && window.console.warn) {
			var originalWarn = console.warn;
			console.warn = function() {
				if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('columnspacing')) {
					return; // Suppress columnspacing warnings
				}
				originalWarn.apply(console, arguments);
			};
		}
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
