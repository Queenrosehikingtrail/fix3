/**
 * Enhanced Mobile Experience for Queen Rose Hiking Trail App
 * Provides touch optimization, gestures, and mobile-specific features
 */

class MobileExperienceEnhancer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.isScrolling = false;
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    init() {
        if (this.isMobile) {
            this.enhanceTouchInteractions();
            this.optimizeForMobile();
            this.addMobileGestures();
            this.improveScrolling();
            this.addHapticFeedback();
            console.log('[Mobile] Enhanced mobile experience initialized');
        }
    }

    enhanceTouchInteractions() {
        // Improve button touch targets
        const buttons = document.querySelectorAll('button, .btn, .clickable');
        buttons.forEach(button => {
            button.style.minHeight = '44px'; // iOS recommended touch target
            button.style.minWidth = '44px';
            
            // Add touch feedback
            button.addEventListener('touchstart', (e) => {
                button.style.transform = 'scale(0.95)';
                button.style.transition = 'transform 0.1s ease';
                this.vibrate(10); // Light haptic feedback
            });

            button.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            });
        });

        // Prevent double-tap zoom on buttons
        buttons.forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            });
        });
    }

    optimizeForMobile() {
        // Add mobile-specific CSS
        const mobileStyles = `
            /* Mobile-specific optimizations */
            @media (max-width: 768px) {
                .app-section {
                    padding: 12px 16px;
                }

                .map-controls {
                    gap: 8px;
                }

                .map-controls button {
                    padding: 8px 12px;
                    font-size: 14px;
                }

                /* Improve form inputs on mobile */
                input, select, textarea {
                    font-size: 16px; /* Prevents zoom on iOS */
                    padding: 12px;
                    border-radius: 8px;
                }

                /* Better spacing for mobile */
                .trail-info {
                    margin-bottom: 16px;
                }

                /* Optimize map for mobile */
                #map {
                    height: 60vh;
                    min-height: 300px;
                }

                /* Mobile-friendly navigation */
                .nav-menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .nav-menu.open {
                    transform: translateX(0);
                }

                /* Improve readability */
                body {
                    font-size: 16px;
                    line-height: 1.5;
                }

                /* Better button spacing */
                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .button-group.horizontal {
                    flex-direction: row;
                    flex-wrap: wrap;
                }
            }

            /* Touch-specific styles */
            .touch-device .hover-effect:hover {
                /* Disable hover effects on touch devices */
                background: initial;
                transform: initial;
            }

            .touch-feedback {
                position: relative;
                overflow: hidden;
            }

            .touch-feedback::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
            }

            .touch-feedback.active::after {
                width: 200px;
                height: 200px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);

        // Add touch device class
        document.body.classList.add('touch-device');
    }

    addMobileGestures() {
        // Swipe gestures for navigation
        let startX, startY, endX, endY;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
            this.touchStartPos = { x: startX, y: startY };
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isScrolling) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);

                // Determine if user is scrolling
                if (deltaY > deltaX && deltaY > 10) {
                    this.isScrolling = true;
                }
            }
        });

        document.addEventListener('touchend', (e) => {
            if (!this.isScrolling) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                this.handleSwipe(startX, startY, endX, endY);
            }
            this.isScrolling = false;
        });

        // Pull-to-refresh gesture
        this.addPullToRefresh();
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        }
    }

    handleSwipeRight() {
        // Open navigation menu
        const menuBtn = document.querySelector('.menu-toggle');
        if (menuBtn && !document.querySelector('.nav-menu.open')) {
            menuBtn.click();
            this.vibrate(20);
        }
    }

    handleSwipeLeft() {
        // Close navigation menu
        const navMenu = document.querySelector('.nav-menu.open');
        if (navMenu) {
            navMenu.classList.remove('open');
            this.vibrate(20);
        }
    }

    addPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        const maxPullDistance = 100;
        const refreshThreshold = 60;

        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-refresh-indicator';
        refreshIndicator.innerHTML = '↓ Pull to refresh';
        refreshIndicator.style.cssText = `
            position: fixed;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: #2E7D32;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            transition: top 0.3s ease;
        `;
        document.body.appendChild(refreshIndicator);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                pullDistance = Math.min(currentY - startY, maxPullDistance);

                if (pullDistance > 0) {
                    e.preventDefault();
                    const progress = pullDistance / refreshThreshold;
                    refreshIndicator.style.top = `${Math.min(pullDistance - 50, 10)}px`;
                    
                    if (pullDistance >= refreshThreshold) {
                        refreshIndicator.innerHTML = '↑ Release to refresh';
                        refreshIndicator.style.background = '#4CAF50';
                    } else {
                        refreshIndicator.innerHTML = '↓ Pull to refresh';
                        refreshIndicator.style.background = '#2E7D32';
                    }
                }
            }
        });

        document.addEventListener('touchend', (e) => {
            if (pullDistance >= refreshThreshold) {
                this.performRefresh();
                this.vibrate(30);
            }
            
            refreshIndicator.style.top = '-50px';
            startY = 0;
            pullDistance = 0;
        });
    }

    performRefresh() {
        // Show refresh animation
        if (window.toastSystem) {
            window.toastSystem.info('Refreshing...', 'Updating trail data and weather information');
        }

        // Refresh weather data
        const weatherBtn = document.querySelector('#refresh-weather-btn');
        if (weatherBtn) {
            weatherBtn.click();
        }

        // Refresh map
        if (window.map) {
            window.map.invalidateSize();
        }

        setTimeout(() => {
            if (window.toastSystem) {
                window.toastSystem.success('Refreshed', 'Trail data updated successfully');
            }
        }, 1500);
    }

    improveScrolling() {
        // Smooth scrolling for mobile
        document.documentElement.style.scrollBehavior = 'smooth';

        // Momentum scrolling for iOS
        document.body.style.webkitOverflowScrolling = 'touch';

        // Prevent overscroll bounce on iOS
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    addHapticFeedback() {
        // Add haptic feedback for important interactions
        const importantButtons = document.querySelectorAll(
            '#where-am-i-btn, #waypoint-btn, #download-btn, .trail-select'
        );

        importantButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.vibrate(15);
            });
        });

        // Success feedback
        document.addEventListener('waypoint-saved', () => {
            this.vibrate([10, 50, 10]);
        });

        // Error feedback
        document.addEventListener('error', () => {
            this.vibrate([50, 50, 50]);
        });
    }

    vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    // Orientation change handler
    handleOrientationChange() {
        setTimeout(() => {
            if (window.map) {
                window.map.invalidateSize();
            }
            
            // Adjust UI for new orientation
            const isLandscape = window.innerWidth > window.innerHeight;
            document.body.classList.toggle('landscape', isLandscape);
            document.body.classList.toggle('portrait', !isLandscape);
        }, 100);
    }

    // Add mobile-specific keyboard handling
    addKeyboardHandling() {
        let initialViewportHeight = window.innerHeight;

        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;

            // Keyboard is likely open if height decreased significantly
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
    }
}

// Mobile-specific utility functions
class MobileUtils {
    static isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    static addToHomeScreen() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('[Mobile] User accepted the A2HS prompt');
                    if (window.toastSystem) {
                        window.toastSystem.success('App Installed', 'Queen Rose Trail app added to home screen');
                    }
                }
                window.deferredPrompt = null;
            });
        }
    }

    static shareLocation(lat, lng, title = 'My Location') {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this location on Queen Rose Hiking Trail`,
                url: `https://maps.google.com/?q=${lat},${lng}`
            });
        } else {
            // Fallback to copying to clipboard
            const url = `https://maps.google.com/?q=${lat},${lng}`;
            navigator.clipboard.writeText(url).then(() => {
                if (window.toastSystem) {
                    window.toastSystem.success('Copied', 'Location link copied to clipboard');
                }
            });
        }
    }

    static requestWakeLock() {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').then((wakeLock) => {
                console.log('[Mobile] Screen wake lock activated');
                return wakeLock;
            }).catch((err) => {
                console.log('[Mobile] Wake lock failed:', err);
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileEnhancer = new MobileExperienceEnhancer();
    window.MobileUtils = MobileUtils;

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        window.mobileEnhancer.handleOrientationChange();
    });

    // Add keyboard handling
    window.mobileEnhancer.addKeyboardHandling();

    console.log('[Mobile] Enhanced mobile experience ready');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileExperienceEnhancer, MobileUtils };
}

