import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast as toastManager } from '@/utils/toast';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
    const [toasts, setToasts] = useState(toastManager.getToasts());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const unsubscribe = toastManager.subscribe((newToasts) => {
            setToasts(newToasts);
        });
        return unsubscribe;
    }, []);

    if (!mounted) return null;

    const content = (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => {
                const icons = {
                    success: CheckCircle2,
                    error: AlertCircle,
                    info: Info,
                    warning: AlertTriangle,
                };

                const colors = {
                    success: 'bg-green-500 text-white',
                    error: 'bg-red-500 text-white',
                    info: 'bg-blue-500 text-white',
                    warning: 'bg-orange-500 text-white',
                };

                const Icon = icons[toast.type as keyof typeof icons] || Info;

                return (
                    <div
                        key={toast.id}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg min-w-[300px] max-w-[400px] pointer-events-auto',
                            colors[toast.type as keyof typeof colors] || colors.info
                        )}
                        style={{
                            animation: 'slideInRight 0.3s ease-out',
                        }}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => toastManager.remove(toast.id)}
                            className="shrink-0 rounded p-1 hover:bg-black/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );

    // Render to document.body to ensure it's always on top
    return createPortal(content, document.body);
}

