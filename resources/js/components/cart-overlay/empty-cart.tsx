import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

interface EmptyCartProps {
    onClose: () => void;
}

export function EmptyCart({ onClose }: EmptyCartProps) {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">
                    No product added
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Add some items to get started
                </p>
                <Button asChild className="mt-6" onClick={onClose}>
                    <Link href={home()}>Continue shopping</Link>
                </Button>
            </div>
        </div>
    );
}

