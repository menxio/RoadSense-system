<?php
namespace App\Traits;

use Illuminate\Support\Str;
use App\Sanctum\NewAccessToken;

trait HasMongoApiTokens
{
    public function createToken(string $name, array $abilities = ['*'])
    {
        \Log::info('Creating token for user:', ['user_id' => $this->id]);

        $token = $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainTextToken = Str::random(40)),
            'abilities' => $abilities,
        ]);

        \Log::info('Token created successfully:', ['token_id' => $token->id]);

        return new NewAccessToken($token, $plainTextToken);
    }

    public function tokens()
    {
        return $this->hasMany(\App\Models\PersonalAccessToken::class, 'tokenable_id', '_id');
    }
}