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
            'license_id_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'school_id' => 'required|string:unique:users,school_id',
        ]);

        // Handle file upload for license_id_image
        if ($request->hasFile('license_id_image')) {
            $file = $request->file('license_id_image');
            $filePath = $file->store('license_id_images', 'public'); // Store in 'storage/app/public/license_id_images'
            $validated['license_id_image'] = $filePath;
        }

        $validated['status'] = 'pending'; // Set default status to 'pending'
        $validated['role'] = 'user';

        // Get latest custom_id and increment
        $latestUser = User::orderByDesc('_id')->first(); // since you're using Mongo
        $latestId = $latestUser?->custom_id ?? 'GP0000';

        $number = (int) substr($latestId, 2);
        $newCustomId = 'GP' . str_pad($number + 1, 4, '0', STR_PAD_LEFT);

        $validated['custom_id'] = $newCustomId;
        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'user' => $user,
            'license_id_image_url' => asset('storage/' . $user->license_id_image),
        ]);
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

            // Check if the user's status is approved
            if ($user->role !== 'admin' && $user->status !== 'approved') {
                return response()->json(['message' => 'Your account is pending approval. Please wait for admin verification.'], 403);
            }

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