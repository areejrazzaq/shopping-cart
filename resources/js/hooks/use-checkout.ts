import { useCallback, useState } from 'react';
import { getCsrfToken } from '@/utils/csrf';
import { type Cart } from '@/types/cart';
import { type OrderResult } from '@/types/cart';

interface UseCheckoutProps {
    cart: Cart | null;
    onCheckout?: () => Promise<OrderResult | void>;
}

export function useCheckout({ cart, onCheckout }: UseCheckoutProps) {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<{ total: number } | null>(null);

    const performCheckout = useCallback(async () => {
        setIsCheckingOut(true);
        try {
            if (onCheckout) {
                const result = await onCheckout();
                const total = result?.order?.total ?? cart?.subtotal ?? 0;
                setOrderSuccess({ total });
            } else {
                const csrfToken = getCsrfToken();
                const response = await fetch('/checkout', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const total = data.order?.total ?? cart?.subtotal ?? 0;
                    setOrderSuccess({ total });
                } else {
                    // Check if response is JSON
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const error = await response.json();
                        console.error('Checkout error:', error);
                        throw new Error(error.message || error.errors?.cart?.[0] || 'Checkout failed');
                    } else {
                        // Handle HTML response (redirect with errors)
                        const text = await response.text();
                        console.error('Checkout error: Received HTML response', text);
                        throw new Error('Checkout failed. Please check your cart and try again.');
                    }
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            throw error;
        } finally {
            setIsCheckingOut(false);
        }
    }, [onCheckout, cart]);

    return {
        isCheckingOut,
        orderSuccess,
        performCheckout,
        setOrderSuccess,
    };
}

