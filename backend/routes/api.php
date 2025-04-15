<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/example-endpoint', function () {
    return response()->json(['message' => 'This is an example endpoint']);
});
