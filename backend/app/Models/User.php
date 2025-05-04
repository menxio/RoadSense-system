<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\HasMongoApiTokens;

class User extends Model implements AuthenticatableContract
{
    use Authenticatable, Notifiable, HasMongoApiTokens;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'custom_id', 
        'name',
        'email',
        'plate_number',
        'password',
        'role',
        'license_id_image',
        'school_id',
        'status',
        'token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function notifications()
    {
        return $this->hasMany(MongoNotification::class, 'notifiable_id');
    }

    public function sendNotification(array $data)
    {
        return $this->notifications()->create([
            'type' => $data['type'] ?? 'default',
            'data' => $data,
            'read_at' => null,
        ]);
    }
}