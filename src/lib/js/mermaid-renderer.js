/**
 * Mermaid Diagram Renderer
 * Handles rendering of Mermaid diagrams from code blocks
 */

(function() {
    'use strict';
    
    /**
     * Convert Mermaid code blocks to rendered diagrams
     */
    function renderMermaidDiagrams() {
        // Find all code blocks with mermaid language
        const mermaidBlocks = document.querySelectorAll('pre code.language-mermaid, pre code[class*="mermaid"]');
        
        mermaidBlocks.forEach(function(block) {
            // Skip if already processed
            if (block.parentElement.classList.contains('mermaid-processed')) {
                return;
            }
            
            const mermaidCode = block.textContent.trim();
            if (!mermaidCode) return;
            
            // Create a new div for the Mermaid diagram
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.textContent = mermaidCode;
            
            // Replace the code block with the Mermaid div
            const preElement = block.parentElement;
            preElement.parentElement.replaceChild(mermaidDiv, preElement);
            
            // Mark as processed
            mermaidDiv.classList.add('mermaid-processed');
        });
        
        // Re-initialize Mermaid if it exists
        if (typeof mermaid !== 'undefined') {
            mermaid.init();
        }
    }
    
    /**
     * Initialize Mermaid rendering
     */
    function initMermaidRenderer() {
        // Wait for Mermaid library to load
        if (typeof mermaid !== 'undefined') {
            renderMermaidDiagrams();
        } else {
            // Retry after a short delay if Mermaid isn't loaded yet
            setTimeout(initMermaidRenderer, 100);
        }
    }
    
    /**
     * Initialize when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMermaidRenderer);
        } else {
            initMermaidRenderer();
        }
    }
    
    // Start initialization
    init();
    
    // Re-render on theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(function() {
            setTimeout(function() {
                if (typeof mermaid !== 'undefined') {
                    mermaid.init();
                }
            }, 200);
        });
    }
    
})();
