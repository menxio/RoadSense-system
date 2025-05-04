<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'user')->get();

        return response()->json($users);
    }

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

    public function show($id)
    {
        try {
            $user = User::where('custom_id', $id)->first();
    
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
    
            return response()->json($user, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching user', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::where('custom_id', $id)->first();
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'plate_number' => 'sometimes|string|max:20',
            'role' => 'sometimes|string|in:user,admin',
            'status' => 'sometimes|string|in:pending,active,suspended',
        ]);

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => isset($validated['password']) ? bcrypt($validated['password']) : $user->password,
            'plate_number' => $validated['plate_number'] ?? $user->plate_number,
            'role' => $validated['role'] ?? $user->role,
            'status' => $validated['status'] ?? $user->status,
        ]);
    
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function delete($id)
    {
        $user = User::where('custom_id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getCurrentUser(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json([
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'plate_number' => $user->plate_number,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching user', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getUserById($id)
    {
        try {
            // Fetch user by ID
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('Error fetching user', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}