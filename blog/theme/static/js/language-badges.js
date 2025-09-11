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
     * Create a language badge element
     * @param {string} lang - Language identifier
     * @returns {HTMLElement} Badge element
     */
    function createLanguageBadge(lang) {
        const badge = document.createElement('div');
        badge.className = 'language-badge';
        badge.textContent = getLanguageDisplayName(lang);
        
        // Set custom color if available
        const color = getLanguageColor(lang);
        if (color !== '#6b7280') {
            badge.style.setProperty('--badge-color', color);
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