/**
 * Add copy buttons to code blocks
 */
(function() {
    'use strict';
    
    function initCopyButtons() {
        // Find all pre code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            if (!pre || pre.classList.contains('copy-button-added')) return;
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-button';
            copyButton.setAttribute('aria-label', 'Copy code to clipboard');
            copyButton.setAttribute('title', 'Copy code');
            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="9" height="11" rx="1" stroke-linecap="round"/><path d="M3 2h8v8H3z" stroke-linecap="round"/></svg>';
            
            // Add click handler
            copyButton.addEventListener('click', async () => {
                const text = codeBlock.textContent || '';
                
                try {
                    await navigator.clipboard.writeText(text);
                    
                    // Visual feedback
                    copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4L6 11L3 8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    copyButton.classList.add('copied');
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="9" height="11" rx="1" stroke-linecap="round"/><path d="M3 2h8v8H3z" stroke-linecap="round"/></svg>';
                        copyButton.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4L6 11L3 8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                        copyButton.classList.add('copied');
                        setTimeout(() => {
                            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="9" height="11" rx="1" stroke-linecap="round"/><path d="M3 2h8v8H3z" stroke-linecap="round"/></svg>';
                            copyButton.classList.remove('copied');
                        }, 2000);
                    } catch (fallbackErr) {
                        console.error('Fallback copy failed:', fallbackErr);
                    }
                    document.body.removeChild(textArea);
                }
            });
            
            // Position button
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
            pre.classList.add('copy-button-added');
        });
    }
    
    // Initialize on load
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCopyButtons);
        } else {
            initCopyButtons();
        }
        
        // Re-initialize after dynamic content loads (for SvelteKit navigation)
        setTimeout(initCopyButtons, 300);
    }
    
    // Also watch for mutations (for dynamically added content)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => {
            initCopyButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    init();
})();
