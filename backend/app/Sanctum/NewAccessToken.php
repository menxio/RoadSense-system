<?php
namespace App\Sanctum;

use App\Models\PersonalAccessToken;

class NewAccessToken
{
    public $accessToken;
    public $plainTextToken;

    public function __construct(PersonalAccessToken $accessToken, string $plainTextToken)
    {
        $this->accessToken = $accessToken;
        $this->plainTextToken = $plainTextToken;
    }
}