import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { type SharedData } from '@/types';
import { login } from '@/routes';

interface Product {
    id: number;
    name: string;
    image: string | null;
    image_url: string;
    price: number;
    stock_quantity: number;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is authenticated
        if (!auth.user) {
            router.visit(login());
            return;
        }

        // Update UI immediately (optimistic)
        setIsAdding(true);

        // Trigger callback immediately to open cart overlay
        if (onAddToCart) {
            onAddToCart(product.id);
            // Reset loading state after a short delay
            setTimeout(() => {
                setIsAdding(false);
            }, 300);
        } else {
            // Fallback: perform API call if no callback provided
            router.post(
                '/cart/items',
                { product_id: product.id },
                {
                    preserveScroll: true,
                    onError: (errors) => {
                        console.error('Error adding to cart:', errors);
                    },
                    onFinish: () => {
                        setTimeout(() => {
                            setIsAdding(false);
                        }, 200);
                    },
                }
            );
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    // const imageUrl = imageError || !product.image_url
    //     ? `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`
    //     : product.image_url;

    const isOutOfStock = product.stock_quantity === 0;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30">
            {/* Product Image */}
            <Link
                href={`/products/${product.id}`}
                className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50 block"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImageError(true)}
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <span className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white shadow-lg">
                            Out of Stock
                        </span>
                    </div>
                )}
                {/* Stock Badge */}
                {!isOutOfStock && product.stock_quantity > 0 && product.stock_quantity < 10 && (
                    <div className="absolute top-3 right-3 rounded-full bg-orange-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white shadow-md">
                        Only {product.stock_quantity} left
                    </div>
                )}
            </Link>

            {/* Product Info */}
            <div className="flex flex-1 flex-col p-4">
                <Link
                    href={`/products/${product.id}`}
                    className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary hover:text-primary"
                >
                    {product.name}
                </Link>

                <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                    <span className="text-lg font-semibold tracking-tight text-muted-foreground">
                        {formatPrice(product.price)}
                    </span>

                    <Button
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock}
                        size="sm"
                        variant="outline"
                        className="group/btn shrink-0 transition-all"
                        type="button"
                    >
                        <ShoppingCart
                            className={`h-4 w-4 transition-transform ${
                                isAdding ? 'animate-spin' : 'group-hover/btn:scale-110'
                            }`}
                        />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}

