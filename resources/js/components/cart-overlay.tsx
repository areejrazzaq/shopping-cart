import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { CartItemRow } from '@/components/cart-overlay/cart-item-row';
import { CheckoutLoading } from '@/components/cart-overlay/checkout-loading';
import { CheckoutSuccess } from '@/components/cart-overlay/checkout-success';
import { EmptyCart } from '@/components/cart-overlay/empty-cart';
import { CartSummary } from '@/components/cart-overlay/cart-summary';
import { useCartOperations } from '@/hooks/use-cart-operations';
import { useCheckout } from '@/hooks/use-checkout';
import { type Cart, type OrderResult } from '@/types/cart';
import { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

interface CartOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: Cart | null;
    onUpdateQuantity?: (itemId: number, quantity: number) => void;
    onRemoveItem?: (itemId: number) => void;
    onCheckout?: () => Promise<OrderResult | void>;
}

export function CartOverlay({
    open,
    onOpenChange,
    cart,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
}: CartOverlayProps) {
    const {
        updatingItems,
        removingItems,
        pendingUpdates,
        handleQuantityChange,
        handleRemove,
        cleanup,
    } = useCartOperations({
        cart,
        onUpdateQuantity,
        onRemoveItem,
    });

    const {
        isCheckingOut,
        orderSuccess,
        performCheckout,
        setOrderSuccess,
    } = useCheckout({ cart, onCheckout });

    // Cleanup timers on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    // Reset order success when overlay closes
    useEffect(() => {
        if (!open) {
            setOrderSuccess(null);
        }
    }, [open, setOrderSuccess]);

    const displayCart = cart;
    const isCartEmpty = !displayCart || displayCart.items.length === 0;

    const renderContent = () => {
        if (isCheckingOut) {
            return <CheckoutLoading />;
        }

        if (orderSuccess) {
            return (
                <CheckoutSuccess
                    total={orderSuccess.total}
                    onClose={() => {
                        setOrderSuccess(null);
                        onOpenChange(false);
                    }}
                />
            );
        }

        if (isCartEmpty) {
            return <EmptyCart onClose={() => onOpenChange(false)} />;
        }

        return (
            <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-6">
                        {displayCart.items.map((item) => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                isUpdating={updatingItems.has(item.id)}
                                isRemoving={removingItems.has(item.id)}
                                hasPendingUpdate={pendingUpdates.has(item.id)}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                </div>

                {/* Cart Summary */}
                <CartSummary
                    cart={displayCart}
                    isCheckingOut={isCheckingOut}
                    onCheckout={performCheckout}
                    onClose={() => onOpenChange(false)}
                />
            </>
        );
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
                    {renderContent()}
                </div>
            </SheetContent>
        </Sheet>
    );
}
