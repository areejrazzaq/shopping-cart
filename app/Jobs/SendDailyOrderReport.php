<?php

namespace App\Jobs;

use App\Mail\DailyOrderReport;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendDailyOrderReport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get orders from the last 24 hours
        $orders = Order::with(['items.product', 'user'])
            ->where('created_at', '>=', now()->subDays(1))
            ->get();

        $totalOrders = $orders->count();
        
        // Calculate total amount by summing all order totals
        $totalAmount = $orders->sum(function ($order) {
            return $order->total();
        });
        
        // Calculate total products sold (sum of all quantities in order items)
        $totalProducts = $orders->sum(function ($order) {
            return $order->items->sum('quantity');
        });
        
        // Count unique users who placed orders
        $totalUsers = $orders->pluck('user_id')->unique()->count();

        // Create list of products with their details
        $products = [];
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $products[] = $item->product;
                }
            }
        }

        Log::info('Sending daily order report to admin', [
            'total_orders' => $totalOrders,
            'total_amount' => $totalAmount,
            'total_products' => $totalProducts,
            'total_users' => $totalUsers,
            'products_count' => count($products),
        ]);
        
        // Send email to admin with the report
        $adminEmail = config('mail.admin_email');
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new DailyOrderReport(
                $totalOrders,
                $totalAmount,
                $totalProducts,
                $totalUsers,
                $products
            ));
        }
    }
}
