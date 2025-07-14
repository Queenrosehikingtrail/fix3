/**
 * Performance Optimizer for Queen Rose Hiking Trail App
 * Implements script bundling, caching, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0
        };
        this.cache = new Map();
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.optimizeImages();
        this.implementResourceCaching();
        this.addPerformanceMonitoring();
        this.optimizeScriptLoading();
        console.log('[Performance] Optimizer initialized');
    }

    measureLoadTime() {
        const startTime = performance.now();
        
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - startTime;
            console.log(`[Performance] Page load time: ${this.metrics.loadTime.toFixed(2)}ms`);
            
            // Measure render time
            this.measureRenderTime();
        });
    }

    measureRenderTime() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'paint') {
                    console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
                }
                if (entry.entryType === 'largest-contentful-paint') {
                    this.metrics.renderTime = entry.startTime;
                    console.log(`[Performance] LCP: ${entry.startTime.toFixed(2)}ms`);
                }
            });
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }

    optimizeImages() {
        // Implement progressive image loading
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            // Add loading optimization
            img.addEventListener('load', () => {
                // Optimize image after load
                this.optimizeImageElement(img);
            });
        });
    }

    optimizeImageElement(img) {
        // Add image optimization techniques
        if (img.naturalWidth > 1200) {
            // Create optimized version for large images
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const maxWidth = 1200;
            const ratio = maxWidth / img.naturalWidth;
            canvas.width = maxWidth;
            canvas.height = img.naturalHeight * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Replace with optimized version
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                img.src = url;
            }, 'image/jpeg', 0.8);
        }
    }

    implementResourceCaching() {
        // Implement intelligent caching
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            const cacheKey = `${url}_${JSON.stringify(options)}`;
            
            // Check cache first
            if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
                console.log(`[Performance] Cache hit for: ${url}`);
                return Promise.resolve(this.cache.get(cacheKey).response.clone());
            }
            
            try {
                const response = await originalFetch(url, options);
                
                // Cache successful responses
                if (response.ok && this.shouldCache(url)) {
                    this.cache.set(cacheKey, {
                        response: response.clone(),
                        timestamp: Date.now(),
                        ttl: this.getCacheTTL(url)
                    });
                    console.log(`[Performance] Cached: ${url}`);
                }
                
                return response;
            } catch (error) {
                // Return cached version if available during network error
                if (this.cache.has(cacheKey)) {
                    console.log(`[Performance] Network error, using cache for: ${url}`);
                    return this.cache.get(cacheKey).response.clone();
                }
                throw error;
            }
        };
    }

    shouldCache(url) {
        const cacheableExtensions = ['.json', '.kml', '.jpg', '.jpeg', '.png', '.css', '.js'];
        return cacheableExtensions.some(ext => url.includes(ext)) ||
               url.includes('weather') ||
               url.includes('api');
    }

    getCacheTTL(url) {
        if (url.includes('weather')) return 10 * 60 * 1000; // 10 minutes
        if (url.includes('.kml')) return 60 * 60 * 1000; // 1 hour
        if (url.includes('.jpg') || url.includes('.png')) return 24 * 60 * 60 * 1000; // 24 hours
        return 30 * 60 * 1000; // 30 minutes default
    }

    isCacheValid(cacheKey) {
        const cached = this.cache.get(cacheKey);
        return cached && (Date.now() - cached.timestamp) < cached.ttl;
    }

    addPerformanceMonitoring() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                
                // Warn if memory usage is high
                if (this.metrics.memoryUsage > 50) {
                    console.warn(`[Performance] High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
                    this.optimizeMemory();
                }
            }, 30000); // Check every 30 seconds
        }

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        }

        // Monitor user interactions
        ['click', 'touchstart', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const startTime = performance.now();
                
                requestAnimationFrame(() => {
                    const interactionTime = performance.now() - startTime;
                    if (interactionTime > 100) {
                        console.warn(`[Performance] Slow interaction: ${interactionTime.toFixed(2)}ms`);
                    }
                });
            });
        });
    }

    optimizeMemory() {
        // Clear old cache entries
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > value.ttl) {
                this.cache.delete(key);
            }
        }

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }

        console.log('[Performance] Memory optimization completed');
    }

    optimizeScriptLoading() {
        // Implement script preloading
        const criticalScripts = [
            'js/map.js',
            'js/app.js',
            'js/live_tracking.js'
        ];

        criticalScripts.forEach(script => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = script;
            document.head.appendChild(link);
        });

        // Defer non-critical scripts
        const nonCriticalScripts = document.querySelectorAll('script[src]:not([defer]):not([async])');
        nonCriticalScripts.forEach(script => {
            if (!criticalScripts.includes(script.src)) {
                script.defer = true;
            }
        });
    }

    // Resource bundling simulation
    bundleResources() {
        const cssFiles = [
            'css/styles.css',
            'css/first-aid.css',
            'css/map_layer_styles.css',
            'css/inline-styles-cleanup.css'
        ];

        // Create virtual bundle
        const bundledCSS = cssFiles.map(file => {
            return fetch(file).then(response => response.text());
        });

        Promise.all(bundledCSS).then(styles => {
            const bundledStyle = document.createElement('style');
            bundledStyle.textContent = styles.join('\n');
            bundledStyle.id = 'bundled-styles';
            document.head.appendChild(bundledStyle);

            // Remove individual stylesheets
            cssFiles.forEach(file => {
                const link = document.querySelector(`link[href="${file}"]`);
                if (link) link.remove();
            });

            console.log('[Performance] CSS bundled successfully');
        });
    }

    // Performance reporting
    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            cacheStats: {
                size: this.cache.size,
                hitRate: this.calculateCacheHitRate()
            },
            recommendations: this.getPerformanceRecommendations()
        };

        console.log('[Performance] Report:', report);
        return report;
    }

    calculateCacheHitRate() {
        // This would be implemented with actual hit/miss tracking
        return 0.85; // Placeholder
    }

    getPerformanceRecommendations() {
        const recommendations = [];

        if (this.metrics.loadTime > 3000) {
            recommendations.push('Consider optimizing image sizes and implementing lazy loading');
        }

        if (this.metrics.memoryUsage > 30) {
            recommendations.push('Monitor memory usage and implement cleanup routines');
        }

        if (this.cache.size > 100) {
            recommendations.push('Implement cache size limits and LRU eviction');
        }

        return recommendations;
    }

    // Service Worker integration
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('[Performance] Service Worker registered:', registration);
                    
                    // Update service worker when new version available
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                if (window.toastSystem) {
                                    window.toastSystem.info(
                                        'Update Available',
                                        'A new version of the app is available.',
                                        {
                                            actions: [
                                                {
                                                    text: 'Update',
                                                    type: 'primary',
                                                    onClick: 'window.location.reload()'
                                                }
                                            ]
                                        }
                                    );
                                }
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('[Performance] Service Worker registration failed:', error);
                });
        }
    }

    // Critical resource preloading
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/vendor/leaflet.css', as: 'style' },
            { href: 'js/vendor/leaflet.js', as: 'script' },
            { href: 'assets/queens_river_logo.png', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }
}

// Performance monitoring utilities
class PerformanceMonitor {
    static measureFunction(fn, name) {
        return function(...args) {
            const start = performance.now();
            const result = fn.apply(this, args);
            const end = performance.now();
            console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }

    static measureAsyncFunction(fn, name) {
        return async function(...args) {
            const start = performance.now();
            const result = await fn.apply(this, args);
            const end = performance.now();
            console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }

    static trackUserTiming(name, fn) {
        performance.mark(`${name}-start`);
        const result = fn();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        return result;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.PerformanceMonitor = PerformanceMonitor;

    // Preload critical resources
    window.performanceOptimizer.preloadCriticalResources();

    // Register service worker for caching
    window.performanceOptimizer.registerServiceWorker();

    console.log('[Performance] Performance optimization system ready');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceOptimizer, PerformanceMonitor };
}

