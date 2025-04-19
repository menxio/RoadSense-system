<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;
    protected $fillable = [
        'custom_user_id',
        'plate_number',
        'detected_at',
        'speed',
        'decibel_level',
        'status',
    ];


}