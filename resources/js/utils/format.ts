/**
 * Utility functions for formatting values
 */

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export function calculateItemTotal(price: number, quantity: number): number {
    return price * quantity;
}

