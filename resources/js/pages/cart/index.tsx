import { CartOverlay } from '@/components/cart-overlay';
import { Footer } from '@/components/footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { getCsrfToken } from '@/utils/csrf';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Loader2, Minus, Plus, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
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
    product: Product;
}

interface CartData {
    id: number | null;
    items: CartItem[];
    subtotal: number;
}

interface CartIndexProps {
    cart: CartData;
}

export default function CartIndex({ cart: initialCart }: CartIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const [cart, setCart] = useState<CartData>(initialCart);
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const [cartOpen, setCartOpen] = useState(false);

    const fetchCart = async () => {
        if (!auth.user) return;

        try {
            const response = await fetch('/cart', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleCartClick = () => {
        if (auth.user) {
            setCartOpen(true);
            fetchCart();
        }
    };

    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = cart.items.find((i) => i.id === itemId);
        if (!item) return;

        if (newQuantity > item.product.stock_quantity) {
            return;
        }

        setUpdatingItems((prev) => new Set(prev).add(itemId));

        router.patch(
            `/cart/items/${itemId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    fetchCart();
                },
                onError: () => {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(itemId);
                        return next;
                    });
                },
                onFinish: () => {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(itemId);
                        return next;
                    });
                },
            }
        );
    };

    const handleRemove = async (itemId: number) => {
        setRemovingItems((prev) => new Set(prev).add(itemId));

        router.delete(`/cart/items/${itemId}`, {
            preserveScroll: true,
            onSuccess: () => {
                fetchCart();
            },
            onError: () => {
                setRemovingItems((prev) => {
                    const next = new Set(prev);
                    next.delete(itemId);
                    return next;
                });
            },
            onFinish: () => {
                setRemovingItems((prev) => {
                    const next = new Set(prev);
                    next.delete(itemId);
                    return next;
                });
            },
        });
    };

    const handleCheckout = async () => {
        try {
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
                // Refresh cart to show empty state
                fetchCart();
                // Return order data for success display
                return { order: data.order };
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
        } catch (error) {
            console.error('Checkout error:', error);
            throw error;
        }
    };

    const isCartEmpty = !cart || cart.items.length === 0;

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader
                    cartItemCount={cartItemCount}
                    onCartClick={handleCartClick}
                />
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Shopping Cart
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                {cart.items.length === 0
                                    ? 'Your cart is empty'
                                    : `${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'} in your cart`}
                            </p>
                        </div>

                        {isCartEmpty ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                                <h2 className="mt-4 text-2xl font-semibold text-foreground">
                                    Your cart is empty
                                </h2>
                                <p className="mt-2 text-muted-foreground">
                                    Add some items to get started
                                </p>
                                <Button asChild className="mt-6" size="lg">
                                    <Link href={home()}>Continue shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Cart Items */}
                                <div className="lg:col-span-2">
                                    <div className="space-y-6">
                                        {cart.items.map((item) => {
                                            const isUpdating = updatingItems.has(item.id);
                                            const isRemoving = removingItems.has(item.id);
                                            const itemTotal = item.product.price * item.quantity;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`flex gap-6 rounded-lg border border-border bg-card p-6 transition-all ${
                                                        isRemoving
                                                            ? 'opacity-50 scale-95'
                                                            : ''
                                                    }`}
                                                >
                                                    {/* Product Image */}
                                                    <Link
                                                        href={`/products/${item.product.id}`}
                                                        className="h-32 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
                                                    >
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </Link>

                                                    {/* Product Info */}
                                                    <div className="flex flex-1 flex-col gap-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <Link
                                                                    href={`/products/${item.product.id}`}
                                                                    className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {item.product.name}
                                                                </Link>
                                                                <p className="mt-1 text-lg font-medium text-foreground">
                                                                    {formatPrice(item.product.price)}
                                                                </p>
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    Stock: {item.product.stock_quantity} available
                                                                </p>
                                                            </div>

                                                            {/* Item Total */}
                                                            <div className="text-right">
                                                                <p className="text-xl font-bold text-foreground">
                                                                    {formatPrice(itemTotal)}
                                                                </p>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="mt-2 text-xs text-muted-foreground hover:text-destructive"
                                                                    onClick={() => handleRemove(item.id)}
                                                                    disabled={isUpdating || isRemoving}
                                                                >
                                                                    {isRemoving ? (
                                                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        'Remove'
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-9 w-9 shrink-0"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                disabled={
                                                                    isUpdating ||
                                                                    item.quantity <= 1 ||
                                                                    isRemoving
                                                                }
                                                                aria-label="Decrease quantity"
                                                            >
                                                                {isUpdating ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Minus className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <span className="min-w-[3rem] text-center text-base font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-9 w-9 shrink-0"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                disabled={
                                                                    isUpdating ||
                                                                    item.quantity >=
                                                                        item.product.stock_quantity ||
                                                                    isRemoving
                                                                }
                                                                aria-label="Increase quantity"
                                                            >
                                                                {isUpdating ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Plus className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-8 rounded-lg border border-border bg-card p-6">
                                        <h2 className="mb-6 text-xl font-semibold text-foreground">
                                            Order Summary
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base text-muted-foreground">
                                                    Subtotal
                                                </span>
                                                <span className="text-lg font-semibold text-foreground">
                                                    {formatPrice(cart.subtotal)}
                                                </span>
                                            </div>

                                            <div className="border-t border-border pt-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-foreground">
                                                        Total
                                                    </span>
                                                    <span className="text-2xl font-bold text-foreground">
                                                        {formatPrice(cart.subtotal)}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                Taxes and shipping calculated at checkout.
                                            </p>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <Button
                                                className="w-full bg-foreground text-background hover:bg-foreground/90"
                                                size="lg"
                                                onClick={async () => {
                                                    try {
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
                                                            // Refresh cart to show empty state
                                                            fetchCart();
                                                            // Redirect to home with success message
                                                            router.visit(home(), {
                                                                data: {
                                                                    order_success: true,
                                                                    order_total: data.order?.total,
                                                                },
                                                            });
                                                        } else {
                                                            // Check if response is JSON
                                                            const contentType = response.headers.get('content-type');
                                                            if (contentType && contentType.includes('application/json')) {
                                                                const error = await response.json();
                                                                console.error('Checkout error:', error);
                                                                // Could show error notification here
                                                                alert(error.message || error.errors?.cart?.[0] || 'Checkout failed');
                                                            } else {
                                                                // Handle HTML response (redirect with errors)
                                                                const text = await response.text();
                                                                console.error('Checkout error: Received HTML response', text);
                                                                alert('Checkout failed. Please check your cart and try again.');
                                                            }
                                                        }
                                                    } catch (error) {
                                                        console.error('Checkout error:', error);
                                                    }
                                                }}
                                                disabled={isCartEmpty}
                                            >
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Proceed to Checkout
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                asChild
                                            >
                                                <Link href={home()}>Continue shopping</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
            <CartOverlay
                open={cartOpen}
                onOpenChange={setCartOpen}
                cart={cart}
                onUpdateQuantity={async (itemId, newQuantity) => {
                    await handleQuantityChange(itemId, newQuantity);
                }}
                onRemoveItem={async (itemId) => {
                    await handleRemove(itemId);
                }}
                onCheckout={handleCheckout}
            />
        </>
    );
}

