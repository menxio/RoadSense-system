<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            $token = $request->header('Authorization');
            \Log::info('Token received:', ['token' => $token]);
    
            if (!$token) {
                return response()->json(['message' => 'Token is missing'], 401);
            }
    
            $token = str_replace('Bearer ', '', $token);
            \Log::info('Extracted token:', ['token' => $token]);

            $user = User::where('token', $token)->first();
            \Log::info('User found:', ['user' => $user]);
            if (!$user) {
                \Log::info('No user found for token:', ['token' => $token]);
                return response()->json(['message' => 'User not authenticated'], 401);
            }
    
            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('Profile error:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }
}