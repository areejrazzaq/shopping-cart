<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = ['name','image','price','stock_quantity'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['image_url'];

    /**
     * Get the product image URL.
     *
     * @return string
     */
    public function getImageUrlAttribute(): string
    {
        // if (!$this->image) {
        //     return asset('images/placeholder-product.jpg');
        // }

        // // If image is already a full URL, return it as is
        // if (filter_var($this->image, FILTER_VALIDATE_URL)) {
        //     return $this->image;
        // }

        // Otherwise, generate URL from storage
        \Log::info(Storage::disk('public')->url($this->image));
        return Storage::disk('public')->url($this->image);
    }
}
