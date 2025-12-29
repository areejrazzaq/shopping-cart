import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format';
import { type Cart } from '@/types/cart';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface CartSummaryProps {
    cart: Cart;
    isCheckingOut: boolean;
    onCheckout: () => Promise<void>;
    onClose: () => void;
}

export function CartSummary({
    cart,
    isCheckingOut,
    onCheckout,
    onClose,
}: CartSummaryProps) {
    const isDisabled = isCheckingOut || cart.items.length === 0;

    return (
        <div className="border-t border-border bg-background px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-medium text-foreground">Subtotal</span>
                <span className="text-lg font-semibold text-foreground transition-all duration-200">
                    {formatPrice(cart.subtotal)}
                </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose} asChild>
                    <Link href={home()}>Continue shopping</Link>
                </Button>
                <Button
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                    disabled={isDisabled}
                    onClick={onCheckout}
                >
                    {isCheckingOut ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Checkout'
                    )}
                </Button>
            </div>
        </div>
    );
}

