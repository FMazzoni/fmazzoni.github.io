/**
 * Simple Code Block Enhancements
 * Adds copy buttons and hover effects without hardcoded syntax patterns
 */

(function() {
    'use strict';

    /**
     * Initialize enhancements
     */
    function initEnhancements() {
        addCopyButtons();
        addHoverEffects();
    }
    
    /**
     * Add copy button functionality
     */
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(block) {
            const preElement = block.parentElement;
            
            // Skip if copy button already exists
            if (preElement.querySelector('.copy-button')) {
                return;
            }
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '📋';
            copyButton.title = 'Copy code';
            copyButton.style.cssText = `
                position: absolute;
                bottom: 1rem;
                right: 1rem;
                background: var(--card-background);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 0.5rem;
                cursor: pointer;
                font-size: 0.8rem;
                opacity: 0.7;
                transition: all 0.2s ease;
                z-index: 20;
            `;
            
            // Add hover effects
            copyButton.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1.1)';
            });
            
            copyButton.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
                this.style.transform = 'scale(1)';
            });
            
            // Add copy functionality
            copyButton.addEventListener('click', function() {
                const text = block.textContent;
                navigator.clipboard.writeText(text).then(function() {
                    copyButton.innerHTML = '✅';
                    setTimeout(function() {
                        copyButton.innerHTML = '📋';
                    }, 2000);
                }).catch(function() {
                    copyButton.innerHTML = '❌';
                    setTimeout(function() {
                        copyButton.innerHTML = '📋';
                    }, 2000);
                });
            });
            
            // Position the pre element relatively
            preElement.style.position = 'relative';
            preElement.appendChild(copyButton);
        });
    }
    
    /**
     * Add subtle hover effects to code blocks
     */
    function addHoverEffects() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(block) {
            const preElement = block.parentElement;
            
            preElement.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            preElement.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }

})();