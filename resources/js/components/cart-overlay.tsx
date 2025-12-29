import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { home } from '@/routes';
import { Link, router } from '@inertiajs/react';
import { Loader2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CartProduct {
    id: number;
    name: string;
    image: string | null;
    image_url: string;
    price: number;
    stock_quantity: number;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: CartProduct;
}

interface Cart {
    id: number | null;
    items: CartItem[];
    subtotal: number;
}

interface CartOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: Cart | null;
    onUpdateQuantity?: (itemId: number, quantity: number) => void;
    onRemoveItem?: (itemId: number) => void;
}

export function CartOverlay({
    open,
    onOpenChange,
    cart,
    onUpdateQuantity,
    onRemoveItem,
}: CartOverlayProps) {
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [optimisticCart, setOptimisticCart] = useState<Cart | null>(cart);
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const [pendingUpdates, setPendingUpdates] = useState<Map<number, number>>(new Map());
    const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

    // Sync cart state when it changes from server
    // Only sync if there are no pending updates to avoid overwriting user actions
    useEffect(() => {
        if (cart) {
            // If no pending updates, sync immediately
            if (pendingUpdates.size === 0) {
                setOptimisticCart(cart);
            }
        }
    }, [cart, pendingUpdates.size]);

    const displayCart = optimisticCart || cart;

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            debounceTimers.current.forEach((timer) => clearTimeout(timer));
            debounceTimers.current.clear();
        };
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const performQuantityUpdate = useCallback(
        async (itemId: number, newQuantity: number) => {
            // Mark as updating (for visual feedback only)
            setUpdatingItems((prev) => new Set(prev).add(itemId));

            // Perform API call in background (non-blocking)
            const updatePromise = (async () => {
                try {
                    if (onUpdateQuantity) {
                        await onUpdateQuantity(itemId, newQuantity);
                    } else {
                        await router.patch(
                            `/cart/items/${itemId}`,
                            { quantity: newQuantity },
                            {
                                preserveScroll: true,
                                onError: () => {
                                    // Revert optimistic update on error
                                    if (cart) {
                                        setOptimisticCart(cart);
                                    }
                                },
                            }
                        );
                    }
                } catch (error) {
                    // Revert optimistic update on error
                    if (cart) {
                        setOptimisticCart(cart);
                    }
                    console.error('Error updating cart:', error);
                } finally {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(itemId);
                        return next;
                    });
                    // Clear pending update only if it matches what we just sent
                    setPendingUpdates((prev) => {
                        const next = new Map(prev);
                        const currentPending = next.get(itemId);
                        // Only clear if this is the quantity we just sent (no newer updates)
                        if (currentPending === newQuantity) {
                            next.delete(itemId);
                        }
                        return next;
                    });
                }
            })();

            // Don't await - let it run in background
            return updatePromise;
        },
        [onUpdateQuantity, cart]
    );

    const handleQuantityChange = useCallback(
        (itemId: number, newQuantity: number, maxStock: number) => {
            if (newQuantity < 1) return;
            if (newQuantity > maxStock) return;

            // Prevent changes if an update is already in progress
            if (updatingItems.has(itemId)) {
                return;
            }

            // Clear existing timer for this item
            const existingTimer = debounceTimers.current.get(itemId);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }

            // Track pending update (for visual feedback only)
            setPendingUpdates((prev) => {
                const next = new Map(prev);
                next.set(itemId, newQuantity);
                return next;
            });

            // Debounce API call - wait 400ms after last change
            const timer = setTimeout(() => {
                // Get the latest pending quantity for this item
                setPendingUpdates((prev) => {
                    const latestQuantity = prev.get(itemId);
                    if (latestQuantity !== undefined) {
                        performQuantityUpdate(itemId, latestQuantity);
                    }
                    return prev;
                });
                debounceTimers.current.delete(itemId);
            }, 400);

            debounceTimers.current.set(itemId, timer);
        },
        [performQuantityUpdate, updatingItems]
    );

    const handleRemove = useCallback(
        (itemId: number) => {
            // Cancel any pending quantity updates for this item
            const pendingTimer = debounceTimers.current.get(itemId);
            if (pendingTimer) {
                clearTimeout(pendingTimer);
                debounceTimers.current.delete(itemId);
            }

            setRemovingItems((prev) => new Set(prev).add(itemId));

            // Perform API call - UI will update when cart syncs
            (async () => {
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
            })();
        },
        [cart, onRemoveItem]
    );

    const itemTotal = (item: CartItem) => {
        return item.product.price * item.quantity;
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-lg">
                <SheetHeader className="border-b border-border px-6 py-4">
                    <SheetTitle className="flex items-center gap-2 text-xl font-semibold">
                        <ShoppingBag className="h-5 w-5" />
                        Your cart
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col overflow-hidden">
                    {!displayCart || displayCart.items.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center p-8">
                            <div className="text-center">
                                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-lg font-medium text-foreground">
                                    Your cart is empty
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Add some items to get started
                                </p>
                                <Button
                                    asChild
                                    className="mt-6"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <Link href={home()}>Continue shopping</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <div className="space-y-6">
                                    {displayCart.items.map((item) => {
                                        const isUpdating = updatingItems.has(item.id);
                                        const isRemoving = removingItems.has(item.id);
                                        const hasPendingUpdate = pendingUpdates.has(item.id);
                                        const maxStock = item.product.stock_quantity;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`border-b border-border pb-6 last:border-0 transition-all duration-300 ease-out ${
                                                    isRemoving
                                                        ? 'opacity-50 scale-95'
                                                        : 'opacity-100 scale-100'
                                                }`}
                                            >
                                                <div className="flex gap-4">
                                                    {/* Product Image */}
                                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex flex-1 flex-col gap-3">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-base font-semibold text-foreground">
                                                                    {item.product.name}
                                                                </h3>
                                                                <p className="mt-1 text-sm font-medium text-foreground">
                                                                    {formatPrice(item.product.price)}
                                                                </p>
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Size — Select at checkout
                                                                </p>
                                                            </div>

                                                            {/* Item Total with Remove - Right aligned */}
                                                            <div className="flex shrink-0 flex-col items-end gap-1">
                                                                <p className="text-base font-semibold text-foreground">
                                                                    {formatPrice(itemTotal(item))}
                                                                </p>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-auto p-0 text-xs text-muted-foreground transition-all duration-200 hover:text-destructive hover:scale-105 active:scale-95 disabled:opacity-50"
                                                                    onClick={() => handleRemove(item.id)}
                                                                    disabled={isUpdating || isRemoving}
                                                                >
                                                                    {isRemoving ? (
                                                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        <ShoppingBag className="mr-1 h-3 w-3 transition-transform" />
                                                                    )}
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-9 w-9 shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity - 1,
                                                                        maxStock
                                                                    )
                                                                }
                                                                disabled={
                                                                    isUpdating ||
                                                                    hasPendingUpdate ||
                                                                    item.quantity <= 1 ||
                                                                    isRemoving
                                                                }
                                                                aria-label="Decrease quantity"
                                                            >
                                                                {isUpdating && hasPendingUpdate ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Minus className="h-4 w-4 transition-transform" />
                                                                )}
                                                            </Button>
                                                            <span className="min-w-[2.5rem] text-center text-sm font-medium transition-all duration-200">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-9 w-9 shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity + 1,
                                                                        maxStock
                                                                    )
                                                                }
                                                                disabled={
                                                                    isUpdating ||
                                                                    hasPendingUpdate ||
                                                                    item.quantity >= maxStock ||
                                                                    isRemoving
                                                                }
                                                                aria-label="Increase quantity"
                                                            >
                                                                {isUpdating && hasPendingUpdate ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Plus className="h-4 w-4 transition-transform" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Cart Summary */}
                            <div className="border-t border-border bg-background px-6 py-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-base font-medium text-foreground">
                                        Subtotal
                                    </span>
                                    <span className="text-lg font-semibold text-foreground transition-all duration-200">
                                        {formatPrice(displayCart.subtotal)}
                                    </span>
                                </div>
                                <p className="mb-4 text-xs text-muted-foreground">
                                    Taxes and shipping calculated at checkout.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => onOpenChange(false)}
                                        asChild
                                    >
                                        <Link href={home()}>Continue shopping</Link>
                                    </Button>
                                    <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

