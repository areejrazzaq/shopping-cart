<?php

namespace App\Listeners;

use App\Events\OrderProcessed;
use App\Mail\LowStockMailToAdmin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckForLowStockItems
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderProcessed $event): void
    {
        $order = $event->order;
        $items = $order->items;
        $lowStockProducts = [];
        foreach ($items as $item) {
            $product = $item->product;
            if ($product->stock_quantity <= config('services.low_stock_threshold')) {
                $lowStockProducts[] = $product;
            }
        }
        if (!empty($lowStockProducts)) {
            Log::info('Sending low stock email to admin: ' . json_encode($lowStockProducts));
            Mail::to(config('mail.admin_email'))->send(new LowStockMailToAdmin($lowStockProducts));
        }
    }
}
