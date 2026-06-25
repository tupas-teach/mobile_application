<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'category', 'price', 'image',
        'rating', 'reviews', 'in_stock', 'description',
        'for_gym', 'for_court',
    ];

    protected $casts = [
        'in_stock'  => 'boolean',
        'for_gym'   => 'boolean',
        'for_court' => 'boolean',
    ];
}
