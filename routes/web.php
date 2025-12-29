<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'products' => \App\Models\Product::latest()->take(8)->get(),
    ]);
})->name('home');

Route::get('products/{product}', function (\App\Models\Product $product) {
    return Inertia::render('products/show', [
        'product' => $product,
    ]);
})->name('products.show');

Route::post('cart/items', [App\Http\Controllers\CartController::class, 'store'])
    ->name('cart.items.store');

Route::middleware(['auth'])->group(function () {
    Route::get('cart', [App\Http\Controllers\CartController::class, 'show'])
        ->name('cart.show');
    Route::patch('cart/items/{cartItem}', [App\Http\Controllers\CartController::class, 'update'])
        ->name('cart.items.update');
    Route::delete('cart/items/{cartItem}', [App\Http\Controllers\CartController::class, 'destroy'])
        ->name('cart.items.destroy');
    Route::post('checkout', [App\Http\Controllers\OrderController::class, 'checkout'])
        ->name('checkout');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
