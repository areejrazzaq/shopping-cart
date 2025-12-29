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

        // Otherwise, generate URL from storage
        return Storage::disk('public')->url($this->image);
    }
}
