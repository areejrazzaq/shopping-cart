/**
 * Shared cart-related type definitions
 */

export interface CartProduct {
    id: number;
    name: string;
    image: string | null;
    image_url: string;
    price: number;
    stock_quantity: number;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: CartProduct;
}

export interface Cart {
    id: number | null;
    items: CartItem[];
    subtotal: number;
}

export interface OrderResult {
    order?: {
        id: number;
        total: number;
    };
}

