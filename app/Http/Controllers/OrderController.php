<?php

namespace App\Http\Controllers;

use App\Events\LowStockDetected;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItems;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Process checkout and create order.
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Get user's cart with items and products
        $cart = Cart::with(['items.product'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors([
                'cart' => 'Your cart is empty.',
            ]);
        }

        // Validate stock availability before creating order
        $isLowStock = false;
        foreach ($cart->items as $cartItem) {
            if ($cartItem->quantity > $cartItem->product->stock_quantity) {
                $isLowStock = true;
                $products[] = $cartItem->product;
            }
        }

        if($isLowStock) {
            LowStockDetected::dispatch($products);
            return back()->withErrors([
                'cart' => 'Insufficient stock for some products. Please try again later.',
            ]);
        }

        // Use database transaction to ensure data consistency
        DB::beginTransaction();

        try {
            // Step 1: Create the order
            $order = Order::create([
                'user_id' => $user->id,
            ]);

            // Step 2: Create order items with current prices (snapshot prices)
            foreach ($cart->items as $cartItem) {
                // Create order item with the current product price
                OrderItems::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'sale_price' => $cartItem->product->price, // Store current price to preserve order history
                    'quantity' => $cartItem->quantity,
                ]);

                // Step 3: Update product stock (decrement by quantity ordered)
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }

            // Step 4: Clear cart after successful order creation
            $cart->items()->delete();
            $cart->delete();

            // Commit all changes
            DB::commit();

            // Reload order with items to calculate total
            $order->load('items');
            $orderTotal = $order->items->sum(function ($item) {
                return $item->sale_price * $item->quantity;
            });

            // Return order data for frontend
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'order' => [
                        'id' => $order->id,
                        'total' => $orderTotal,
                    ],
                    'message' => 'Order placed successfully!',
                ]);
            }

            return redirect()->route('home')->with([
                'success' => 'Order placed successfully!',
                'order_total' => $orderTotal,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'cart' => 'An error occurred while processing your order. Please try again.',
            ]);
        }
    }
}

