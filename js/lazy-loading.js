/**
 * Lazy Loading Implementation for Queen Rose Hiking Trail App
 * Improves page load performance by loading images only when needed
 */

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                // Load images when they're 100px away from viewport
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback for browsers without Intersection Observer
            this.loadAllImages();
        }
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        // Show loading placeholder
        img.classList.add('loading');
        
        // Create new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Image loaded successfully
            img.src = img.dataset.src;
            img.classList.remove('loading');
            img.classList.add('loaded');
            
            // Remove data-src attribute
            delete img.dataset.src;
            
            console.log(`[LazyLoad] Image loaded: ${img.src}`);
        };
        
        imageLoader.onerror = () => {
            // Image failed to load
            img.classList.remove('loading');
            img.classList.add('error');
            console.error(`[LazyLoad] Failed to load image: ${img.dataset.src}`);
        };
        
        // Start loading the image
        imageLoader.src = img.dataset.src;
    }

    loadAllImages() {
        // Fallback: load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    // Method to add new images to lazy loading
    addImage(img) {
        if (this.imageObserver && img.dataset.src) {
            this.imageObserver.observe(img);
        } else {
            this.loadImage(img);
        }
    }

    // Method to force load all remaining images
    loadAll() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (this.imageObserver) {
                this.imageObserver.unobserve(img);
            }
            this.loadImage(img);
        });
    }
}

// CSS for loading states
const lazyLoadingCSS = `
    img.loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        min-height: 200px;
    }
    
    img.loaded {
        animation: fadeIn 0.3s ease-in;
    }
    
    img.error {
        background: #f5f5f5;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
    }
    
    img.error::after {
        content: "Image not available";
        font-size: 14px;
        color: #666;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Add CSS to document
function addLazyLoadingCSS() {
    const style = document.createElement('style');
    style.textContent = lazyLoadingCSS;
    document.head.appendChild(style);
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    addLazyLoadingCSS();
    window.lazyLoader = new LazyImageLoader();
    console.log('[LazyLoad] Lazy loading initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyImageLoader;
}

