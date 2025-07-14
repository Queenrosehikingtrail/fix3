/**
 * Toast Notification System for Queen Rose Hiking Trail App
 * Provides user-friendly error handling and feedback
 */

class ToastNotificationSystem {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        this.createContainer();
        this.addStyles();
        console.log('[Toast] Notification system initialized');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    addStyles() {
        const styles = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }

            .toast {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                margin-bottom: 10px;
                padding: 16px 20px;
                min-width: 300px;
                max-width: 400px;
                pointer-events: auto;
                transform: translateX(100%);
                transition: all 0.3s ease-in-out;
                border-left: 4px solid #ccc;
                position: relative;
                overflow: hidden;
            }

            .toast.show {
                transform: translateX(0);
            }

            .toast.success {
                border-left-color: #4CAF50;
                background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
            }

            .toast.error {
                border-left-color: #f44336;
                background: linear-gradient(135deg, #fff8f8 0%, #ffe8e8 100%);
            }

            .toast.warning {
                border-left-color: #ff9800;
                background: linear-gradient(135deg, #fffaf8 0%, #fff3e8 100%);
            }

            .toast.info {
                border-left-color: #2196F3;
                background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
            }

            .toast-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .toast-title {
                font-weight: 600;
                font-size: 14px;
                color: #333;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .toast-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .toast-close:hover {
                color: #333;
            }

            .toast-message {
                font-size: 13px;
                color: #555;
                line-height: 1.4;
                margin-bottom: 12px;
            }

            .toast-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }

            .toast-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .toast-btn.primary {
                background: #2E7D32;
                color: white;
            }

            .toast-btn.primary:hover {
                background: #1B5E20;
            }

            .toast-btn.secondary {
                background: #f5f5f5;
                color: #666;
            }

            .toast-btn.secondary:hover {
                background: #e0e0e0;
            }

            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                transition: width linear;
            }

            .toast.success .toast-progress {
                background: #4CAF50;
            }

            .toast.error .toast-progress {
                background: #f44336;
            }

            .toast.warning .toast-progress {
                background: #ff9800;
            }

            .toast.info .toast-progress {
                background: #2196F3;
            }

            @media (max-width: 480px) {
                .toast-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }

                .toast {
                    min-width: auto;
                    max-width: none;
                    margin-bottom: 8px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            actions = [],
            persistent = false
        } = options;

        const toastId = Date.now() + Math.random();
        const toast = this.createToast(toastId, type, title, message, actions, duration, persistent);
        
        this.container.appendChild(toast);
        this.toasts.set(toastId, toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto-dismiss if not persistent
        if (!persistent && duration > 0) {
            this.startProgressBar(toast, duration);
            setTimeout(() => this.dismiss(toastId), duration);
        }

        return toastId;
    }

    createToast(id, type, title, message, actions, duration, persistent) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.toastId = id;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-title">
                    <span>${icons[type] || icons.info}</span>
                    ${title}
                </div>
                <button class="toast-close" onclick="window.toastSystem.dismiss(${id})">&times;</button>
            </div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
            ${actions.length > 0 ? `
                <div class="toast-actions">
                    ${actions.map(action => `
                        <button class="toast-btn ${action.type || 'secondary'}" 
                                onclick="${action.onClick}; window.toastSystem.dismiss(${id})">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
            ${!persistent && duration > 0 ? '<div class="toast-progress"></div>' : ''}
        `;

        return toast;
    }

    startProgressBar(toast, duration) {
        const progressBar = toast.querySelector('.toast-progress');
        if (progressBar) {
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.width = '0%';
                progressBar.style.transition = `width ${duration}ms linear`;
            }, 10);
        }
    }

    dismiss(toastId) {
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toasts.delete(toastId);
            }, 300);
        }
    }

    dismissAll() {
        this.toasts.forEach((toast, id) => {
            this.dismiss(id);
        });
    }

    // Convenience methods
    success(title, message, options = {}) {
        return this.show({ ...options, type: 'success', title, message });
    }

    error(title, message, options = {}) {
        return this.show({ ...options, type: 'error', title, message });
    }

    warning(title, message, options = {}) {
        return this.show({ ...options, type: 'warning', title, message });
    }

    info(title, message, options = {}) {
        return this.show({ ...options, type: 'info', title, message });
    }
}

// Enhanced Error Handler
class ErrorHandler {
    constructor(toastSystem) {
        this.toastSystem = toastSystem;
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error');
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Promise Rejection');
        });

        console.log('[ErrorHandler] Global error handling initialized');
    }

    handleError(error, context = 'Unknown') {
        console.error(`[ErrorHandler] ${context}:`, error);

        const errorMessage = error.message || error.toString();
        const isNetworkError = this.isNetworkError(error);
        const isLocationError = this.isLocationError(error);

        if (isNetworkError) {
            this.handleNetworkError(errorMessage);
        } else if (isLocationError) {
            this.handleLocationError(error);
        } else {
            this.handleGenericError(errorMessage, context);
        }
    }

    isNetworkError(error) {
        const networkKeywords = ['fetch', 'network', 'connection', 'timeout', 'offline'];
        const errorStr = error.toString().toLowerCase();
        return networkKeywords.some(keyword => errorStr.includes(keyword));
    }

    isLocationError(error) {
        return error.code && [1, 2, 3].includes(error.code); // Geolocation error codes
    }

    handleNetworkError(message) {
        this.toastSystem.error(
            'Connection Problem',
            'Unable to connect to the server. Please check your internet connection.',
            {
                persistent: true,
                actions: [
                    {
                        text: 'Retry',
                        type: 'primary',
                        onClick: 'window.errorHandler.retryLastOperation()'
                    },
                    {
                        text: 'Work Offline',
                        type: 'secondary',
                        onClick: 'window.errorHandler.enableOfflineMode()'
                    }
                ]
            }
        );
    }

    handleLocationError(error) {
        const messages = {
            1: 'Location access denied. Please enable location services in your browser settings.',
            2: 'Location unavailable. Please check your GPS settings.',
            3: 'Location request timed out. Please try again.'
        };

        this.toastSystem.warning(
            'Location Error',
            messages[error.code] || 'Unable to get your location.',
            {
                actions: [
                    {
                        text: 'Try Again',
                        type: 'primary',
                        onClick: 'window.errorHandler.retryLocation()'
                    }
                ]
            }
        );
    }

    handleGenericError(message, context) {
        this.toastSystem.error(
            'Something went wrong',
            `${context}: ${message}`,
            {
                actions: [
                    {
                        text: 'Reload Page',
                        type: 'primary',
                        onClick: 'window.location.reload()'
                    }
                ]
            }
        );
    }

    retryLastOperation() {
        // This would be implemented based on the specific operation
        this.toastSystem.info('Retrying...', 'Attempting to reconnect...');
        // Implement retry logic here
    }

    enableOfflineMode() {
        this.toastSystem.success('Offline Mode', 'Working offline with cached data.');
        // Implement offline mode logic here
    }

    retryLocation() {
        // Trigger location request again
        const locationBtn = document.querySelector('#where-am-i-btn');
        if (locationBtn) {
            locationBtn.click();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.toastSystem = new ToastNotificationSystem();
    window.errorHandler = new ErrorHandler(window.toastSystem);
    
    console.log('[Toast] Advanced error handling system ready');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToastNotificationSystem, ErrorHandler };
}

