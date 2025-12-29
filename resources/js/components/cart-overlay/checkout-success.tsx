import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';

interface CheckoutSuccessProps {
    total: number;
    onClose: () => void;
}

export function CheckoutSuccess({ total, onClose }: CheckoutSuccessProps) {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <svg
                        className="h-8 w-8 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <p className="mt-4 text-xl font-semibold text-foreground">
                    Order placed successfully!
                </p>
                <p className="mt-2 text-lg font-bold text-foreground">
                    Total: {formatPrice(total)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for your purchase
                </p>
                <Button className="mt-6" onClick={onClose} asChild>
                    <Link href={home()}>Continue shopping</Link>
                </Button>
            </div>
        </div>
    );
}

