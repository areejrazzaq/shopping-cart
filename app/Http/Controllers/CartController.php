<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItems;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Add a product to the cart.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $product = Product::findOrFail($request->product_id);

        // Check if product is in stock
        if ($product->stock_quantity < ($request->quantity ?? 1)) {
            return back()->withErrors([
                'product' => 'Insufficient stock available.',
            ]);
        }

        // Get or create user's cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Check if item already exists in cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Update quantity if item exists
            $newQuantity = $cartItem->quantity + ($request->quantity ?? 1);
            
            if ($newQuantity > $product->stock_quantity) {
                return back()->withErrors([
                    'product' => 'Cannot add more items. Stock limit reached.',
                ]);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            // Create new cart item
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        return back()->with('success', 'Product added to cart successfully.');
    }

    /**
     * Get the user's cart.
     */
    public function show(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            return redirect()->route('login');
        }

        $cart = Cart::with(['items.product'])->where('user_id', $user->id)->first();

        if (!$cart) {
            $cartData = [
                'id' => null,
                'items' => [],
                'subtotal' => 0,
            ];
        } else {
            $subtotal = $cart->items->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            $cartData = [
                'id' => $cart->id,
                'items' => $cart->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'product' => [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'image' => $item->product->image,
                            'image_url' => $item->product->image_url,
                            'price' => $item->product->price,
                            'stock_quantity' => $item->product->stock_quantity,
                        ],
                    ];
                })->toArray(),
                'subtotal' => $subtotal,
            ];
        }

        if ($request->expectsJson()) {
            return response()->json($cartData);
        }

        // Render Inertia page for regular GET requests
        return Inertia::render('cart/index', [
            'cart' => $cartData,
        ]);
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItems $cartItem): RedirectResponse
    {
        $user = Auth::user();

        if (!$user || $cartItem->cart->user_id !== $user->id) {
            return back()->withErrors(['cart' => 'Unauthorized']);
        }

        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = $cartItem->product;

        if ($request->quantity > $product->stock_quantity) {
            return back()->withErrors([
                'quantity' => 'Quantity cannot exceed available stock.',
            ]);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove item from cart.
     */
    public function destroy(CartItems $cartItem): RedirectResponse
    {
        $user = Auth::user();

        if (!$user || $cartItem->cart->user_id !== $user->id) {
            return back()->withErrors(['cart' => 'Unauthorized']);
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }
}

