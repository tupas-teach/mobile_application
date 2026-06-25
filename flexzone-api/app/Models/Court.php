<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    protected $fillable = [
        'name', 'type', 'capacity', 'price_per_hour',
        'price_per_day', 'available', 'amenities', 'image', 'active',
    ];

    protected $casts = [
        'amenities' => 'array',
        'available' => 'boolean',
        'active'    => 'boolean',
    ];
}
