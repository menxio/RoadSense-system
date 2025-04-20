<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ViolationController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [UserController::class, 'adminDashboard']);
        Route::get('/manage-users', [UserController::class, 'manageUsers']);
    });

    // User Routes
    Route::middleware('role:user')->prefix('user')->group(function () {
        Route::get('/dashboard', [UserController::class, 'userDashboard']);
        Route::get('/profile', [UserController::class, 'profile']);
    });
});

// Violations Routes (for both roles)
Route::prefix('violations')->group(function () {
    Route::get('/', [ViolationController::class, 'index']);
    Route::post('/', [ViolationController::class, 'store']);
    Route::get('/{id}', [ViolationController::class, 'show']);
    Route::put('/{id}', [ViolationController::class, 'update']);
    Route::delete('/{id}', [ViolationController::class, 'destroy']);
});
