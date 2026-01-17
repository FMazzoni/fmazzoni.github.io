/**
 * Language Badges for Code Blocks
 * Integrates highlight.js with custom language badges for better code identification
 */

(function() {
    'use strict';
    
    // Language mapping for better display names
    const LANGUAGE_MAPPING = {
        'python': 'Python',
        'py': 'Python',
        'javascript': 'JavaScript',
        'js': 'JavaScript',
        'typescript': 'TypeScript',
        'ts': 'TypeScript',
        'html': 'HTML',
        'css': 'CSS',
        'sql': 'SQL',
        'bash': 'Bash',
        'shell': 'Shell',
        'sh': 'Shell',
        'json': 'JSON',
        'yaml': 'YAML',
        'yml': 'YAML',
        'markdown': 'Markdown',
        'md': 'Markdown',
        'dockerfile': 'Dockerfile',
        'docker': 'Dockerfile',
        'go': 'Go',
        'golang': 'Go',
        'rust': 'Rust',
        'rs': 'Rust',
        'java': 'Java',
        'cpp': 'C++',
        'c': 'C',
        'csharp': 'C#',
        'cs': 'C#',
        'php': 'PHP',
        'ruby': 'Ruby',
        'rb': 'Ruby',
        'swift': 'Swift',
        'kotlin': 'Kotlin',
        'kt': 'Kotlin',
        'scala': 'Scala',
        'r': 'R',
        'matlab': 'MATLAB',
        'lua': 'Lua',
        'perl': 'Perl',
        'pl': 'Perl',
        'powershell': 'PowerShell',
        'ps1': 'PowerShell',
        'vim': 'Vim',
        'viml': 'Vim',
        'xml': 'XML',
        'toml': 'TOML',
        'ini': 'INI',
        'conf': 'Config',
        'config': 'Config',
        'makefile': 'Makefile',
        'cmake': 'CMake',
        'gradle': 'Gradle',
        'maven': 'Maven',
        'docker-compose': 'Docker Compose',
        'terraform': 'Terraform',
        'tf': 'Terraform',
        'ansible': 'Ansible',
        'latex': 'LaTeX',
        'tex': 'LaTeX',
        'mermaid': 'Mermaid'
    };
    
    // Emoji mapping for programming languages
    const LANGUAGE_EMOJIS = {
        'python': '🐍',
        'py': '🐍',
        'javascript': '🟨',
        'js': '🟨',
        'typescript': '🔷',
        'ts': '🔷',
        'html': '🌐',
        'css': '🎨',
        'sql': '🗄️',
        'bash': '🐚',
        'shell': '🐚',
        'sh': '🐚',
        'json': '📄',
        'yaml': '📋',
        'yml': '📋',
        'markdown': '📝',
        'md': '📝',
        'dockerfile': '🐳',
        'docker': '🐳',
        'go': '🐹',
        'golang': '🐹',
        'rust': '🦀',
        'rs': '🦀',
        'java': '☕',
        'cpp': '⚡',
        'c': '⚡',
        'csharp': '🔷',
        'cs': '🔷',
        'php': '🐘',
        'ruby': '💎',
        'rb': '💎',
        'swift': '🦉',
        'kotlin': '🟣',
        'kt': '🟣',
        'scala': '🔴',
        'r': '📊',
        'matlab': '🧮',
        'lua': '🌙',
        'perl': '🐪',
        'pl': '🐪',
        'powershell': '💙',
        'ps1': '💙',
        'vim': '✏️',
        'viml': '✏️',
        'xml': '📄',
        'toml': '⚙️',
        'ini': '⚙️',
        'conf': '⚙️',
        'config': '⚙️',
        'makefile': '🔨',
        'cmake': '🔧',
        'gradle': '🏗️',
        'maven': '📦',
        'terraform': '🏗️',
        'tf': '🏗️',
        'ansible': '🤖',
        'latex': '📚',
        'tex': '📚',
        'mermaid': '🌊'
    };
    
    // Color mapping for different language families
    const LANGUAGE_COLORS = {
        'python': '#3776ab',
        'javascript': '#f7df1e',
        'typescript': '#3178c6',
        'html': '#e34f26',
        'css': '#1572b6',
        'sql': '#336791',
        'bash': '#4eaa25',
        'shell': '#4eaa25',
        'json': '#000000',
        'yaml': '#cb171e',
        'markdown': '#083fa1',
        'dockerfile': '#2496ed',
        'docker': '#2496ed',
        'go': '#00add8',
        'rust': '#000000',
        'java': '#ed8b00',
        'cpp': '#00599c',
        'c': '#a8b9cc',
        'csharp': '#239120',
        'php': '#777bb4',
        'ruby': '#cc342d',
        'swift': '#fa7343',
        'kotlin': '#7f52ff',
        'scala': '#dc322f',
        'r': '#276dc3',
        'matlab': '#e16737',
        'lua': '#000080',
        'perl': '#39457e',
        'powershell': '#012456',
        'vim': '#019733',
        'xml': '#ff6600',
        'toml': '#9c4221',
        'ini': '#d0d0d0',
        'config': '#d0d0d0',
        'makefile': '#427819',
        'cmake': '#064f8c',
        'gradle': '#02303a',
        'maven': '#c71a36',
        'terraform': '#623ce4',
        'ansible': '#ee0000',
        'latex': '#008080',
        'tex': '#008080',
        'mermaid': '#ff6b6b'
    };
    
    /**
     * Get display name for a language
     * @param {string} lang - Language identifier
     * @returns {string} Display name
     */
    function getLanguageDisplayName(lang) {
        if (!lang) return 'Code';
        return LANGUAGE_MAPPING[lang.toLowerCase()] || lang.charAt(0).toUpperCase() + lang.slice(1);
    }
    
    /**
     * Get color for a language
     * @param {string} lang - Language identifier
     * @returns {string} Color hex code
     */
    function getLanguageColor(lang) {
        if (!lang) return '#6b7280';
        return LANGUAGE_COLORS[lang.toLowerCase()] || '#6b7280';
    }
    
    /**
     * Get emoji for a language
     * @param {string} lang - Language identifier
     * @returns {string} Emoji character
     */
    function getLanguageEmoji(lang) {
        if (!lang) return '💻';
        return LANGUAGE_EMOJIS[lang.toLowerCase()] || '💻';
    }
    
    /**
     * Convert hex color to RGB
     * @param {string} hex - Hex color string
     * @returns {Object|null} RGB object or null
     */
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    /**
     * Determine if a color is light or dark for contrast
     * @param {string} hex - Hex color string
     * @returns {boolean} True if color is light, false if dark
     */
    function isLightColor(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return false;
        
        // Calculate relative luminance
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > 0.5;
    }
    
    /**
     * Get contrasting color (darker version for light backgrounds, lighter for dark)
     * @param {string} hex - Hex color string
     * @returns {string} Contrasting color
     */
    function getContrastingColor(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        const isLight = isLightColor(hex);
        
        if (isLight) {
            // For light colors, return a darker version
            return `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`;
        } else {
            // For dark colors, return a lighter version
            return `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`;
        }
    }
    
    /**
     * Create a language badge element
     * @param {string} lang - Language identifier
     * @returns {HTMLElement} Badge element
     */
    function createLanguageBadge(lang) {
        const badge = document.createElement('div');
        badge.className = 'language-badge modern-badge';
        
        // Get emoji and display name
        const emoji = getLanguageEmoji(lang);
        const displayName = getLanguageDisplayName(lang);
        
        // Create emoji span
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'badge-emoji';
        emojiSpan.textContent = emoji;
        
        // Create text span
        const textSpan = document.createElement('span');
        textSpan.className = 'badge-text';
        textSpan.textContent = displayName;
        
        // Append emoji and text to badge
        badge.appendChild(emojiSpan);
        badge.appendChild(textSpan);
        
        // Set custom color if available
        const color = getLanguageColor(lang);
        if (color !== '#6b7280') {
            badge.style.setProperty('--badge-color', color);
            // Convert hex to RGB for transparency effects
            const rgb = hexToRgb(color);
            if (rgb) {
                badge.style.setProperty('--badge-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
                // Set contrasting text color for better readability
                const contrastingColor = getContrastingColor(color);
                badge.style.setProperty('--badge-text-color', contrastingColor);
            }
        }
        
        return badge;
    }
    
    /**
     * Extract language from HTML classes
     * @param {string} className - The class attribute value
     * @returns {string|null} Detected language or null
     */
function extractLanguageFromClasses(className) {
    if (!className) return null;

    // Look for language-python, language-js, etc. (fenced_code format) - PRIORITY
    const languageMatch = className.match(/language-([a-zA-Z0-9_-]+)/);
    if (languageMatch) {
        return languageMatch[1];
    }

    // Look for direct language classes (e.g., python, javascript, dockerfile, latex, mermaid)
    const directMatch = className.match(/\b(python|py|javascript|js|typescript|ts|html|css|sql|bash|shell|sh|json|yaml|yml|markdown|md|dockerfile|docker|go|golang|rust|rs|java|cpp|c|csharp|cs|php|ruby|rb|swift|kotlin|kt|scala|r|matlab|lua|perl|pl|powershell|ps1|vim|viml|xml|toml|ini|conf|config|makefile|cmake|gradle|maven|terraform|tf|ansible|latex|tex|mermaid)\b/);
    if (directMatch) {
        return directMatch[1];
    }

    return null;
}
    
    /**
     * Add language badges to code blocks
     */
    function addLanguageBadges() {
        // Find all code blocks - handle both fenced_code and highlight structures
        const codeBlocks = document.querySelectorAll('pre code, pre[class*="language-"], .highlight pre code');
        
        codeBlocks.forEach(function(block) {
            // Find the container element (could be pre or div.highlight)
            let containerElement = block.parentElement;
            while (containerElement && !containerElement.classList.contains('highlight') && containerElement.tagName !== 'PRE') {
                containerElement = containerElement.parentElement;
            }
            
            // Skip if badge already exists
            if (containerElement && containerElement.querySelector('.language-badge')) {
                return;
            }
            
            let language = null;
            
            // Extract language from code element classes
            if (block.className) {
                language = extractLanguageFromClasses(block.className);
            }
            
            // If not found, check container element classes
            if (!language && containerElement && containerElement.className) {
                language = extractLanguageFromClasses(containerElement.className);
            }
            
            // Create and add badge
            if (containerElement) {
                const badge = createLanguageBadge(language);
                containerElement.style.position = 'relative';
                containerElement.appendChild(badge);
            }
        });
    }
    
    
    /**
     * Initialize language badges (highlight.js is handled by base.html)
     */
    function initLanguageBadges() {
        // Wait for highlight.js to finish processing (if available)
        if (typeof hljs !== 'undefined') {
            // Add language badges after a short delay to ensure highlighting is complete
            setTimeout(addLanguageBadges, 150);
        } else {
            // Add badges immediately if highlight.js is not available
            addLanguageBadges();
        }
    }
    
    /**
     * Initialize when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLanguageBadges);
        } else {
            initLanguageBadges();
        }
    }
    
    // Start initialization
    init();
    
    // Re-initialize on theme changes (if theme toggle exists)
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(function() {
            // Small delay to ensure theme has been applied
            setTimeout(addLanguageBadges, 200);
        });
    }
    
})();