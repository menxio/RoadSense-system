<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\ProfileController;

Route::get('/license_id_images/{filename}', function ($filename) {
    $path = storage_path('app/public/license_id_images/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/profile', [ProfileController::class, 'getProfile']);

Route::middleware('auth:sanctum')->group(function () {
    // Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:user')->prefix('user')->group(function () {
        Route::get('/dashboard', [UserController::class, 'userDashboard']);
        Route::get('/profile', [UserController::class, 'profile']);
    });
});

Route::prefix('users')->group(function() {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::post('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'delete']);
});

Route::prefix('violations')->group(function () {
    Route::get('/', [ViolationController::class, 'index']);
    Route::post('/', [ViolationController::class, 'store']);
    Route::get('/{id}', [ViolationController::class, 'show']);
    Route::put('/{id}', [ViolationController::class, 'update']);
    Route::delete('/{id}', [ViolationController::class, 'destroy']);
});
