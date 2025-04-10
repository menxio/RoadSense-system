<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController; // Ensure you import the correct controller

Route::get('/test-endpoint', [TestController::class, 'index']);
