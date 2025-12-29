import { HeroSection } from '@/components/hero-section';
import { ProductsGrid } from '@/components/products-grid';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

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

export default function Welcome({
    canRegister = true,
    products = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

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
                <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center justify-end gap-4 py-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md px-5 py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md border border-border bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                <main className="flex-1">
                    <HeroSection />
                    <ProductsGrid
                        products={products}
                        onAddToCart={(productId) => {
                            // TODO: Implement add to cart functionality
                            console.log('Add to cart:', productId);
                        }}
                    />
                </main>
            </div>
        </>
    );
}
