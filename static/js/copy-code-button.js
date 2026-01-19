/**
 * Simple copy code button for code blocks
 */
(function() {
    'use strict';
    
    function addCopyButtons() {
        if (!document.body) {
            return;
        }
        
        var codeBlocks = document.querySelectorAll('pre code');
        
        if (codeBlocks.length === 0) {
            return;
        }
        
        for (var i = 0; i < codeBlocks.length; i++) {
            var codeBlock = codeBlocks[i];
            var pre = codeBlock.parentElement;
            
            // Skip if already has button or invalid parent
            if (!pre || !codeBlock || pre.querySelector('.copy-code-button')) {
                continue;
            }
            
            // Create button
            var button = document.createElement('button');
            button.className = 'copy-code-button';
            button.setAttribute('aria-label', 'Copy code');
            button.setAttribute('title', 'Copy code');
            button.innerHTML = '📋';
            
            // Click handler (capture codeBlock in closure)
            (function(cb, btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var text = cb.textContent || '';
                    var buttonEl = this;
                
                    // Try modern clipboard API
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(function() {
                            buttonEl.innerHTML = '✓';
                            buttonEl.classList.add('copied');
                            setTimeout(function() {
                                buttonEl.innerHTML = '📋';
                                buttonEl.classList.remove('copied');
                            }, 2000);
                        }).catch(function(err) {
                            console.error('Clipboard API failed:', err);
                            // Fallback
                            fallbackCopy(text, buttonEl);
                        });
                    } else {
                        // Fallback
                        fallbackCopy(text, buttonEl);
                    }
                });
            })(codeBlock, button);
            
            // Make pre relative if needed
            if (getComputedStyle(pre).position === 'static') {
                pre.style.position = 'relative';
            }
            
            pre.appendChild(button);
        }
    }
    
    function fallbackCopy(text, button) {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            if (document.execCommand('copy')) {
                button.innerHTML = '✓';
                button.classList.add('copied');
                setTimeout(function() {
                    button.innerHTML = '📋';
                    button.classList.remove('copied');
                }, 2000);
            }
        } catch (err) {
            console.error('Copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Initialize
    function init() {
        if (!document.body) {
            return;
        }
        try {
            addCopyButtons();
        } catch (err) {
            console.error('Error adding copy buttons:', err);
        }
    }
    
    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            setTimeout(init, 300);
            setTimeout(init, 800);
            setTimeout(init, 1500);
        });
    } else {
        init();
        setTimeout(init, 100);
        setTimeout(init, 300);
        setTimeout(init, 800);
        setTimeout(init, 1500);
    }
    
    // Also listen for SvelteKit navigation
    if (typeof window !== 'undefined') {
        window.addEventListener('load', function() {
            setTimeout(init, 500);
            setTimeout(init, 1000);
        });
        
        // Listen for navigation events
        document.addEventListener('sveltekit:navigation-end', function() {
            setTimeout(init, 100);
            setTimeout(init, 300);
            setTimeout(init, 600);
            setTimeout(init, 1000);
        });
        
        // Also listen for popstate (back/forward)
        window.addEventListener('popstate', function() {
            setTimeout(init, 200);
            setTimeout(init, 600);
        });
    }
    
    // Watch for new content (only if body exists)
    if (typeof MutationObserver !== 'undefined' && document.body) {
        var observer = new MutationObserver(function() {
            setTimeout(init, 100);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else if (typeof MutationObserver !== 'undefined') {
        // Wait for body to be available
        var checkBody = setInterval(function() {
            if (document.body) {
                clearInterval(checkBody);
                var observer = new MutationObserver(function() {
                    setTimeout(init, 100);
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 100);
        
        // Stop checking after 5 seconds
        setTimeout(function() {
            clearInterval(checkBody);
        }, 5000);
    }
})();
