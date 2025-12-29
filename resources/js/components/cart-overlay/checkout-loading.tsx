import { Loader2 } from 'lucide-react';

export function CheckoutLoading() {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">
                    Processing your order...
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Please wait while we prepare your order
                </p>
            </div>
        </div>
    );
}

