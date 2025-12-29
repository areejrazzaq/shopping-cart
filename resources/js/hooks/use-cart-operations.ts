import { useCallback, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { DEBOUNCE_DELAY_MS } from '@/components/cart-overlay/constants';
import { type Cart } from '@/types/cart';

interface UseCartOperationsProps {
    cart: Cart | null;
    onUpdateQuantity?: (itemId: number, quantity: number) => void;
    onRemoveItem?: (itemId: number) => void;
}

export function useCartOperations({
    cart,
    onUpdateQuantity,
    onRemoveItem,
}: UseCartOperationsProps) {
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const [pendingUpdates, setPendingUpdates] = useState<Map<number, number>>(new Map());
    const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

    const performQuantityUpdate = useCallback(
        async (itemId: number, newQuantity: number) => {
            setUpdatingItems((prev) => new Set(prev).add(itemId));

            try {
                if (onUpdateQuantity) {
                    await onUpdateQuantity(itemId, newQuantity);
                } else {
                    await router.patch(`/cart/items/${itemId}`, { quantity: newQuantity }, {
                        preserveScroll: true,
                        onError: () => {
                            console.error('Error updating cart item');
                        },
                    });
                }
            } catch (error) {
                console.error('Error updating cart:', error);
            } finally {
                setUpdatingItems((prev) => {
                    const next = new Set(prev);
                    next.delete(itemId);
                    return next;
                });
                setPendingUpdates((prev) => {
                    const next = new Map(prev);
                    const currentPending = next.get(itemId);
                    if (currentPending === newQuantity) {
                        next.delete(itemId);
                    }
                    return next;
                });
            }
        },
        [onUpdateQuantity]
    );

    const handleQuantityChange = useCallback(
        (itemId: number, newQuantity: number, maxStock: number) => {
            if (newQuantity < 1 || newQuantity > maxStock) return;
            if (updatingItems.has(itemId)) return;

            const existingTimer = debounceTimers.current.get(itemId);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }

            setPendingUpdates((prev) => {
                const next = new Map(prev);
                next.set(itemId, newQuantity);
                return next;
            });

            const timer = setTimeout(() => {
                setPendingUpdates((prev) => {
                    const latestQuantity = prev.get(itemId);
                    if (latestQuantity !== undefined) {
                        performQuantityUpdate(itemId, latestQuantity);
                    }
                    return prev;
                });
                debounceTimers.current.delete(itemId);
            }, DEBOUNCE_DELAY_MS);

            debounceTimers.current.set(itemId, timer);
        },
        [performQuantityUpdate, updatingItems]
    );

    const handleRemove = useCallback(
        async (itemId: number) => {
            const pendingTimer = debounceTimers.current.get(itemId);
            if (pendingTimer) {
                clearTimeout(pendingTimer);
                debounceTimers.current.delete(itemId);
            }

            setRemovingItems((prev) => new Set(prev).add(itemId));

            try {
                if (onRemoveItem) {
                    await onRemoveItem(itemId);
                } else {
                    await router.delete(`/cart/items/${itemId}`, {
                        preserveScroll: true,
                        onError: (errors) => {
                            console.error('Error removing item:', errors);
                        },
                    });
                }
            } catch (error) {
                console.error('Error removing item:', error);
            } finally {
                setRemovingItems((prev) => {
                    const next = new Set(prev);
                    next.delete(itemId);
                    return next;
                });
            }
        },
        [onRemoveItem]
    );

    // Cleanup timers on unmount
    const cleanup = useCallback(() => {
        debounceTimers.current.forEach((timer) => clearTimeout(timer));
        debounceTimers.current.clear();
    }, []);

    return {
        updatingItems,
        removingItems,
        pendingUpdates,
        handleQuantityChange,
        handleRemove,
        cleanup,
    };
}

