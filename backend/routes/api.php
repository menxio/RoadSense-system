<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']); // Register route
Route::post('/login', [AuthController::class, 'login']); // Login route
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); // Logout route

Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'create']);
    Route::get('/{id}', [UserController::class, 'read']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'delete']);
});