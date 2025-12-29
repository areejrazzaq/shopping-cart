import { CartOverlay } from '@/components/cart-overlay';
import { Footer } from '@/components/footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCsrfToken } from '@/utils/csrf';
import { toast } from '@/utils/toast';
import { home, login } from '@/routes';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SharedData } from '@/types';

interface Product {
    id: number;
    name: string;
    image: string | null;
    image_url: string;
    price: number;
    stock_quantity: number;
}

interface ProductShowProps {
    product: Product;
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

export default function ProductShow({ product }: ProductShowProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState<CartData | null>(null);
    const { auth } = usePage<SharedData>().props;

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

    useEffect(() => {
        if (cartOpen && auth.user) {
            fetchCart();
        }
    }, [cartOpen, auth.user]);

    // Fetch cart on mount to get item count
    useEffect(() => {
        if (auth.user) {
            fetchCart();
        }
    }, [auth.user]);

    const handleCartClick = () => {
        if (auth.user) {
            setCartOpen(true);
            fetchCart();
        }
    };

    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Calculate how many of this product are already in the cart
    const quantityInCart = cart?.items.find((item) => item.product_id === product.id)?.quantity || 0;
    
    // Calculate available quantity (stock - already in cart)
    const availableQuantity = Math.max(0, product.stock_quantity - quantityInCart);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleQuantityChange = (newQuantity: number) => {
        // Ensure quantity is within valid range
        if (newQuantity < 1) {
            setQuantity(1);
        } else if (newQuantity > availableQuantity) {
            setQuantity(availableQuantity);
        } else {
            setQuantity(newQuantity);
        }
    };

    const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) {
            setQuantity(1);
        } else if (value > availableQuantity) {
            setQuantity(availableQuantity);
        } else {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        // Check if user is authenticated
        if (!auth.user) {
            router.visit(login());
            return;
        }

        // Validate quantity doesn't exceed available stock
        if (quantity > availableQuantity) {
            return;
        }

        // Check if trying to add more than available
        if (availableQuantity === 0) {
            // Could show a toast/notification here
            return;
        }

        // Update UI immediately (optimistic)
        setIsAdding(true);
        
        // Reset quantity immediately
        setQuantity(1);

        // Perform API call
        router.post(
            '/cart/items',
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Fetch updated cart and open overlay after API succeeds
                    fetchCart().then(() => {
                        setCartOpen(true);
                    });
                },
                onError: (errors) => {
                    console.error('Error adding to cart:', errors);
                    // Could show error notification here
                },
                onFinish: () => {
                    // Reset loading state after API completes
                    setTimeout(() => {
                        setIsAdding(false);
                    }, 200);
                },
            }
        );
    };

    const isOutOfStock = product.stock_quantity === 0;
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity < 10;

    return (
        <>
            <Head title={product.name} />
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="w-full border-b border-border">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center justify-between py-4">
                            <Link
                                href={home()}
                                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Link>
                            <SiteHeader
                                cartItemCount={cartItemCount}
                                onCartClick={handleCartClick}
                                variant="cart-only"
                            />
                        </nav>
                    </div>
                </header>

                {/* Product Detail */}
                <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Product Image */}
                        <div className="space-y-4">
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                                        <span className="rounded-lg bg-destructive px-6 py-3 text-base font-semibold text-white shadow-lg">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                                {isLowStock && !isOutOfStock && (
                                    <div className="absolute top-4 right-4 rounded-full bg-orange-500/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white shadow-md">
                                        Only {product.stock_quantity} left
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                    {product.name}
                                </h1>
                                <div className="mt-4 flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-foreground">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="space-y-2">
                                {isOutOfStock ? (
                                    <p className="text-sm font-medium text-destructive">
                                        This product is currently out of stock.
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {product.stock_quantity > 10
                                            ? 'In Stock'
                                            : `Only ${product.stock_quantity} left in stock`}
                                    </p>
                                )}
                            </div>

                            <div className="text-justify text-muted-foreground text-sm mt-4">
                                <p>
                                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Est quibusdam soluta blanditiis aliquam qui perspiciatis necessitatibus rem amet vel, et numquam debitis odio minima? In praesentium consectetur quaerat similique magni!
                                   Inventore qui sed nobis quidem dolore? Assumenda voluptas delectus rerum veritatis? Ipsum sapiente quas quis saepe mollitia, reiciendis aperiam pariatur odio ex, in at quisquam adipisci quibusdam amet, eius corporis.
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            {!isOutOfStock && (
                                <div className="space-y-2 pt-4">
                                    <label className="text-sm font-medium text-foreground">
                                        Quantity
                                    </label>
                                    {quantityInCart > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            You have <span className="font-semibold text-foreground">{quantityInCart}</span> {quantityInCart === 1 ? 'item' : 'items'} of this product in your cart
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 shrink-0"
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={quantity <= 1 || availableQuantity === 0}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={availableQuantity}
                                            value={quantity}
                                            onChange={handleQuantityInput}
                                            className="h-10 w-20 text-center text-base font-medium"
                                            aria-label="Quantity"
                                            disabled={availableQuantity === 0}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 shrink-0"
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={quantity >= availableQuantity || availableQuantity === 0}
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {availableQuantity === 0 ? (
                                        <p className="text-sm font-medium text-destructive">
                                            All available items are already in your cart
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-muted-foreground">
                                                Maximum order quantity: <span className="font-semibold text-foreground">{product.stock_quantity}</span>
                                                {quantityInCart > 0 && (
                                                    <span className="ml-2">({availableQuantity} available to add)</span>
                                                )}
                                            </p>
                                            {quantity > 0 && (
                                                <p className="text-sm font-medium text-foreground">
                                                    {quantity} {quantity === 1 ? 'item' : 'items'} will be added to cart
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="flex flex-col gap-4 pt-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isOutOfStock || quantity > availableQuantity || availableQuantity === 0}
                                    size="lg"
                                    className="w-full group/btn text-base font-semibold"
                                >
                                    <ShoppingCart
                                        className={`mr-2 h-5 w-5 transition-transform ${
                                            isAdding ? 'animate-spin' : 'group-hover/btn:scale-110'
                                        }`}
                                    />
                                    {availableQuantity === 0
                                        ? 'All items in cart'
                                        : isAdding
                                        ? 'Adding to Cart...'
                                        : 'Add to Cart'}
                                </Button>
                            </div>

                            {/* Product Details Section */}
                            <div className="border-t border-border pt-6">
                                <h2 className="mb-4 text-lg font-semibold text-foreground">
                                    Product Details
                                </h2>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Price</span>
                                        <span className="font-medium text-foreground">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Availability</span>
                                        <span className="font-medium text-foreground">
                                            {isOutOfStock
                                                ? 'Out of Stock'
                                                : `${product.stock_quantity} available`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
            <CartOverlay
                open={cartOpen}
                onOpenChange={setCartOpen}
                cart={cart}
                onUpdateQuantity={async (itemId, newQuantity) => {
                    router.patch(
                        `/cart/items/${itemId}`,
                        { quantity: newQuantity },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                fetchCart();
                            },
                        }
                    );
                }}
                onRemoveItem={async (itemId) => {
                    router.delete(`/cart/items/${itemId}`, {
                        preserveScroll: true,
                        onSuccess: () => {
                            fetchCart();
                        },
                    });
                }}
                onCheckout={async () => {
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
                            // Clear cart state immediately
                            setCart(null);
                            // Refresh cart to ensure it's empty
                            fetchCart();
                            // Return order data for success display
                            return { order: data.order };
                        } else {
                            // Check if response is JSON
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                const error = await response.json();
                                console.error('Checkout error:', error);
                                
                                // Check if it's a low stock error (insufficient stock)
                                if (error.errors?.cart && Array.isArray(error.errors.cart)) {
                                    // Show toastr for low stock errors with detailed message
                                    const errorMessages = error.errors.cart.join(', ');
                                    toast.error(errorMessages, 5000);
                                } else {
                                    // For all other errors, show generic "retry later" message
                                    toast.error('Checkout failed. Please try again later.', 3000);
                                }
                                
                                throw new Error(error.message || error.errors?.cart?.[0] || 'Checkout failed');
                            } else {
                                // Handle HTML response (redirect with errors)
                                const text = await response.text();
                                console.error('Checkout error: Received HTML response', text);
                                toast.error('Checkout failed. Please try again later.', 3000);
                                throw new Error('Checkout failed. Please check your cart and try again.');
                            }
                        }
                    } catch (error) {
                        console.error('Checkout error:', error);
                        toast.error('Checkout failed. Please try again later.', 3000);
                        throw error;
                    }
                }}
            />
        </>
    );
}

