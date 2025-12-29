import { ProductCard } from '@/components/product-card';

interface Product {
    id: number;
    name: string;
    image: string | null;
    image_url: string;
    price: number;
    stock_quantity: number;
}

interface ProductsGridProps {
    products: Product[];
    onAddToCart?: (productId: number) => void;
    title?: string;
    subtitle?: string;
}

export function ProductsGrid({
    products,
    onAddToCart,
    title = 'New Arrivals',
    subtitle = 'Fall\'25',
}: ProductsGridProps) {
    if (products.length === 0) {
        return (
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">No products available at the moment.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 text-left">
                    <h2 className="text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        {title}                     <span className="mt-4 text-lg text-muted-foreground">{subtitle}</span>

                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

