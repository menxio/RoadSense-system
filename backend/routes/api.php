<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']); // Register route
Route::post('/login', [AuthController::class, 'login']); // Login route

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::post('/logout', [AuthController::class, 'logout']); // Logout route

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