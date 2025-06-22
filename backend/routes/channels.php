<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications.{custom_id}', function ($user, $custom_id) {
    \Log::info('Authenticating channel:', [
        'user_custom_id' => $user->custom_id,
        'channel_custom_id' => $custom_id,
    ]);
    return $user->custom_id === $custom_id;
});