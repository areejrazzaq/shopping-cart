import { Button } from '@/components/ui/button';
import { formatPrice, calculateItemTotal } from '@/utils/format';
import { type CartItem } from '@/types/cart';
import { Loader2, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CartItemRowProps {
    item: CartItem;
    isUpdating: boolean;
    isRemoving: boolean;
    hasPendingUpdate: boolean;
    onQuantityChange: (itemId: number, newQuantity: number, maxStock: number) => void;
    onRemove: (itemId: number) => void;
}

export function CartItemRow({
    item,
    isUpdating,
    isRemoving,
    hasPendingUpdate,
    onQuantityChange,
    onRemove,
}: CartItemRowProps) {
    const maxStock = item.product.stock_quantity;
    const itemTotal = calculateItemTotal(item.product.price, item.quantity);

    return (
        <div
            className={`border-b border-border pb-6 last:border-0 transition-all duration-300 ease-out ${
                isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
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

                        {/* Item Total with Remove */}
                        <div className="flex shrink-0 flex-col items-end gap-1">
                            <p className="text-base font-semibold text-foreground">
                                {formatPrice(itemTotal)}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-xs text-muted-foreground transition-all duration-200 hover:text-destructive hover:scale-105 active:scale-95 disabled:opacity-50"
                                onClick={() => onRemove(item.id)}
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
                            onClick={() => onQuantityChange(item.id, item.quantity - 1, maxStock)}
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
                            onClick={() => onQuantityChange(item.id, item.quantity + 1, maxStock)}
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
}

