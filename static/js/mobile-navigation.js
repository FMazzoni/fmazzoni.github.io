/**
 * Mobile Navigation Enhancement
 * Provides hamburger menu, sticky header, and mobile-specific interactions
 */

(function() {
    'use strict';
    
    // Mobile navigation state
    let isMobileMenuOpen = false;
    let isSticky = false;
    
    /**
     * Initialize mobile navigation
     */
    function initMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const header = document.querySelector('header');
        
        if (!mobileToggle || !mobileNav || !header) return;
        
        // Add click handler for mobile menu toggle
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
        
        // Add click handlers for mobile nav links
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMobileMenuOpen && 
                !mobileNav.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
        
        // Initialize sticky header
        initStickyHeader(header);
        
        // Initialize swipe gestures
        initSwipeGestures();
    }
    
    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!mobileToggle || !mobileNav) return;
        
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!mobileToggle || !mobileNav) return;
        
        isMobileMenuOpen = true;
        mobileToggle.classList.add('active');
        mobileNav.classList.add('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Focus first link for accessibility
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    }
    
    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!mobileToggle || !mobileNav) return;
        
        isMobileMenuOpen = false;
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    /**
     * Initialize sticky header functionality
     */
    function initStickyHeader(header) {
        if (!header) return;
        
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateStickyHeader() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                if (!isSticky) {
                    header.classList.add('sticky');
                    isSticky = true;
                }
            } else {
                if (isSticky) {
                    header.classList.remove('sticky');
                    isSticky = false;
                }
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateStickyHeader);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    /**
     * Initialize swipe gestures for mobile navigation
     */
    function initSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Check if it's a horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                // Swipe right to open menu (only if menu is closed)
                if (deltaX > 0 && !isMobileMenuOpen && window.innerWidth <= 768) {
                    openMobileMenu();
                }
                // Swipe left to close menu (only if menu is open)
                else if (deltaX < 0 && isMobileMenuOpen) {
                    closeMobileMenu();
                }
            }
        }
    }
    
    /**
     * Initialize pull-to-refresh functionality
     */
    function initPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        let pullDistance = 0;
        
        const pullThreshold = 80;
        const maxPull = 120;
        
        document.addEventListener('touchstart', function(e) {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!isPulling) return;
            
            currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            if (pullDistance > 0 && pullDistance <= maxPull) {
                e.preventDefault();
                
                // Add visual feedback
                const pullIndicator = document.querySelector('.pull-indicator') || createPullIndicator();
                const progress = Math.min(pullDistance / pullThreshold, 1);
                
                pullIndicator.style.transform = `translateY(${pullDistance}px)`;
                pullIndicator.style.opacity = progress;
                
                if (pullDistance >= pullThreshold) {
                    pullIndicator.classList.add('ready');
                } else {
                    pullIndicator.classList.remove('ready');
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', function(e) {
            if (!isPulling) return;
            
            isPulling = false;
            
            if (pullDistance >= pullThreshold) {
                // Trigger refresh
                refreshPage();
            } else {
                // Reset pull indicator
                const pullIndicator = document.querySelector('.pull-indicator');
                if (pullIndicator) {
                    pullIndicator.style.transform = 'translateY(-100%)';
                    pullIndicator.style.opacity = '0';
                    pullIndicator.classList.remove('ready');
                }
            }
            
            pullDistance = 0;
        }, { passive: true });
        
        function createPullIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'pull-indicator';
            indicator.innerHTML = `
                <div class="pull-icon">↓</div>
                <div class="pull-text">Pull to refresh</div>
            `;
            indicator.style.cssText = `
                position: fixed;
                top: -60px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--card-background);
                border: 1px solid var(--border-color);
                border-radius: 0 0 12px 12px;
                padding: 1rem;
                text-align: center;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
            `;
            
            document.body.appendChild(indicator);
            return indicator;
        }
        
        function refreshPage() {
            const pullIndicator = document.querySelector('.pull-indicator');
            if (pullIndicator) {
                pullIndicator.innerHTML = `
                    <div class="pull-icon">⟳</div>
                    <div class="pull-text">Refreshing...</div>
                `;
                pullIndicator.classList.add('refreshing');
            }
            
            // Simulate refresh delay
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        }
    }
    
    /**
     * Initialize mobile-specific optimizations
     */
    function initMobileOptimizations() {
        // Add mobile-specific classes
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-device');
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                if (window.innerWidth <= 768) {
                    document.body.classList.add('mobile-device');
                } else {
                    document.body.classList.remove('mobile-device');
                }
            }, 100);
        });
        
        // Optimize touch interactions
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Add loading states for slow connections
        if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
            document.body.classList.add('slow-connection');
        }
    }
    
    /**
     * Initialize everything when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initMobileNavigation();
                initPullToRefresh();
                initMobileOptimizations();
            });
        } else {
            initMobileNavigation();
            initPullToRefresh();
            initMobileOptimizations();
        }
    }
    
    // Start initialization
    init();
    
})();
