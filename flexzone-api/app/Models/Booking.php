<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id', 'court_id', 'court_name', 'date',
        'time_slots', 'duration', 'category', 'total_amount',
        'status', 'payment_status', 'payment_method',
        'notes', 'guest_count', 'event_type',
    ];

    protected $casts = [
        'time_slots' => 'array',
        'date'       => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }
}
