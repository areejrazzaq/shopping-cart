import { CartOverlay } from '@/components/cart-overlay';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { OurStory } from '@/components/our-story';
import { ProductsGrid } from '@/components/products-grid';
import { SiteHeader } from '@/components/site-header';
import { getCsrfToken } from '@/utils/csrf';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    image: string | null;
    image_url: string;
    price: number;
    stock_quantity: number;
}

interface WelcomeProps {
    canRegister?: boolean;
    products?: Product[];
}

interface CartData {
    id: number | null;
    items: Array<{
        id: number;
        product_id: number;
        quantity: number;
        product: Product;
    }>;
    subtotal: number;
}

export default function Welcome({
    canRegister = true,
    products = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState<CartData | null>(null);

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

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader
                    cartItemCount={cartItemCount}
                    onCartClick={handleCartClick}
                    canRegister={canRegister}
                />
                <main className="flex-1">
                    <HeroSection />
                    <ProductsGrid
                        products={products}
                        onAddToCart={async (productId) => {
                            if (auth.user) {
                                // Perform API call
                                router.post(
                                    '/cart/items',
                                    { product_id: productId },
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            // Fetch updated cart and open overlay after API succeeds
                                            fetchCart().then(() => {
                                                setCartOpen(true);
                                            });
                                        },
                                    }
                                );
                            }
                        }}
                    />
                    <OurStory />
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
                            const error = await response.json();
                            console.error('Checkout error:', error);
                            throw new Error(error.message || 'Checkout failed');
                        }
                    } catch (error) {
                        console.error('Checkout error:', error);
                        throw error;
                    }
                }}
            />
        </>
    );
}
