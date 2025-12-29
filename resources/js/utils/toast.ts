/**
 * Simple toast notification utility
 */

interface ToastOptions {
    duration?: number;
    type?: 'success' | 'error' | 'info' | 'warning';
}

class ToastManager {
    private toasts: Array<{ id: string; message: string; type: string; duration: number }> = [];
    private listeners: Set<(toasts: typeof this.toasts) => void> = new Set();
    private idCounter = 0;

    show(message: string, options: ToastOptions = {}) {
        const { duration = 3000, type = 'info' } = options;
        const id = `toast-${++this.idCounter}`;
        
        const toast = { id, message, type, duration };
        this.toasts.push(toast);
        
        // Use setTimeout to ensure listeners are notified after state is updated
        setTimeout(() => {
            this.notifyListeners();
        }, 0);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    error(message: string, duration?: number) {
        return this.show(message, { type: 'error', duration });
    }

    success(message: string, duration?: number) {
        return this.show(message, { type: 'success', duration });
    }

    info(message: string, duration?: number) {
        return this.show(message, { type: 'info', duration });
    }

    warning(message: string, duration?: number) {
        return this.show(message, { type: 'warning', duration });
    }

    remove(id: string) {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
        this.notifyListeners();
    }

    clear() {
        this.toasts = [];
        this.notifyListeners();
    }

    subscribe(listener: (toasts: typeof this.toasts) => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener([...this.toasts]));
    }

    getToasts() {
        return [...this.toasts];
    }
}

export const toast = new ToastManager();

