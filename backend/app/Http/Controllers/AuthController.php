<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
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

        if ($request->hasFile('license_id_image')) {
            $file = $request->file('license_id_image');
            $filePath = $file->store('license_id_images', 'public');
            $validated['license_id_image'] = $filePath;
        }

        $validated['status'] = 'pending';
        $validated['role'] = 'user';

        $latestUser = User::orderByDesc('_id')->first();
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
    
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
    
            $user = Auth::user();

            if ($user->status === 'pending') {
                return response()->json([
                    'message' => 'Your account is not approved. Please contact the administrator.'
                ], 403);
            }

            if ($user->status === 'suspended') {
                return response()->json([
                    'message' => 'Your account is suspended. Please contact the administrator.'
                ], 403);
            }

            $token = Str::random(60);
    
            $user->token = $token;
            $user->save();
    
            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Login error:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}