<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'plate_number' => 'required|string|unique:users,plate_number',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
        ]);

        // Get latest custom_id and increment
        $latestUser = User::orderByDesc('_id')->first(); // since you're using Mongo
        $latestId = $latestUser?->custom_id ?? 'GP0000';

        $number = (int) substr($latestId, 2);
        $newCustomId = 'GP' . str_pad($number + 1, 4, '0', STR_PAD_LEFT);

        $validated['custom_id'] = $newCustomId;
        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    // Login method
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();

            // Debugging: Log the authenticated user
            \Log::info('User authenticated:', ['user' => $user]);

            // Debugging: Check if createToken is called
            \Log::info('Attempting to create token for user:', ['user_id' => $user->id]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Login error:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    // Logout method
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}