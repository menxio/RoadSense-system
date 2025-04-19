<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class PersonalAccessToken extends Model implements HasAbilities
{
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities',
        'last_used_at',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
    ];

    public static function findToken($token)
    {
        // Use MongoDB's query structure to find the token
        return static::where('token', hash('sha256', $token))->first();
    }

    public function can($ability)
    {
        return in_array('*', $this->abilities) || in_array($ability, $this->abilities);
    }

    public function cant($ability)
    {
        return !$this->can($ability);
    }
}