/**
 * Theme Toggle Functionality
 * Provides smooth dark/light mode switching with localStorage persistence
 */

(function() {
    'use strict';
    
    // Theme management
    const THEME_KEY = 'blog-theme';
    const THEMES = {
        DARK: 'dark',
        LIGHT: 'light'
    };
    
    // Get stored theme or default to dark
    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || THEMES.DARK;
        } catch (e) {
            return THEMES.DARK;
        }
    }
    
    // Store theme preference
    function storeTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            console.warn('Unable to store theme preference');
        }
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleButton(theme);
    }
    
    // Update toggle button appearance
    function updateToggleButton(theme) {
        const toggleButton = document.querySelector('.theme-toggle');
        if (!toggleButton) return;
        
        const isDark = theme === THEMES.DARK;
        const icon = isDark ? getSunIcon() : getMoonIcon();
        const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        
        toggleButton.innerHTML = icon;
        toggleButton.setAttribute('title', title);
        toggleButton.setAttribute('aria-label', title);
    }
    
    // SVG icons
    function getSunIcon() {
        return `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
                <path d="m12 1v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m12 20v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m1 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m20 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m4.22 4.22 2.12 2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m17.66 17.66 2.12 2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m4.22 19.78 2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m17.66 6.34 2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
    }
    
    function getMoonIcon() {
        return `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
        `;
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        
        storeTheme(newTheme);
        applyTheme(newTheme);
    }
    
    // Initialize theme on page load
    function initTheme() {
        const storedTheme = getStoredTheme();
        applyTheme(storedTheme);
        
        // Add event listener to toggle button
        const toggleButton = document.querySelector('.theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
            
            // Add keyboard support
            toggleButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Handle system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(function(e) {
            // Only auto-switch if user hasn't set a preference
            if (!localStorage.getItem(THEME_KEY)) {
                const theme = e.matches ? THEMES.DARK : THEMES.LIGHT;
                applyTheme(theme);
            }
        });
    }
})();
