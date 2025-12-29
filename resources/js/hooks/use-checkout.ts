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
                    const error = await response.json();
                    console.error('Checkout error:', error);
                    throw new Error(error.message || 'Checkout failed');
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

