<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\PersonalAccessToken;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        return response()->json(User::all());
    }

    // Create a new user
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return response()->json($user, 201);
    }

    // Get a specific user
    public function read($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => isset($validated['password']) ? bcrypt($validated['password']) : $user->password,
        ]);

        return response()->json($user);
    }

    // Delete a user
    public function delete($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    public function getCurrentUser(Request $request)
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json(['error' => 'Token not provided'], 401);
            }

            $personalAccessToken = PersonalAccessToken::findToken($token);
            if (!$personalAccessToken) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $user = $personalAccessToken->tokenable; // Retrieve the associated user
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('Error fetching user', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}