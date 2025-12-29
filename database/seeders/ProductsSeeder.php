<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get available product images from storage
        $imageFiles = Storage::disk('public')->files('products');
        
        // Filter only image files
        $imageFiles = array_filter($imageFiles, function ($file) {
            return preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
        });

        $imageFiles = array_values($imageFiles); // Re-index array

        $products = [
            [
                'name' => 'Nike Air Max 270',
                'price' => 150.00,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Adidas Ultraboost 22',
                'price' => 180.00,
                'stock_quantity' => 18,
            ],
            [
                'name' => 'Jordan 1 Retro High',
                'price' => 170.00,
                'stock_quantity' => 12,
            ],
            [
                'name' => 'New Balance 550',
                'price' => 110.00,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Puma RS-X3',
                'price' => 95.00,
                'stock_quantity' => 22,
            ],
            [
                'name' => 'Vans Old Skool',
                'price' => 65.00,
                'stock_quantity' => 40,
            ],
        ];

        foreach ($products as $index => $product) {
            // Assign image if available, otherwise null
            $product['image'] = isset($imageFiles[$index]) ? $imageFiles[$index] : null;

            Product::firstOrCreate(
                ['name' => $product['name']],
                $product
            );
        }
    }
}
