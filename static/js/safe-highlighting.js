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
     * Copy button functionality removed - handled by copy-code-button.js
     */
    function addCopyButtons() {
        // Copy buttons are now handled by copy-code-button.js
        // This function is kept for compatibility but does nothing
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