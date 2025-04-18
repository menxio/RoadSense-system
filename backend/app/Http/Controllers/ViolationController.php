<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Violation;

class ViolationController extends Controller
{
    public function store(Request $request)
    {
        // Validate only the required fields
        $validated = $request->validate([
            'plate_number' => 'required|string',
            'detected_at' => 'required|date',
            'speed' => 'nullable|numeric',
            'decibel_level' => 'nullable|numeric',
            'status' => 'nullable|string|in:flagged,reviewed,cleared',
        ]);

        $user = User::where('plate_number', $validated['plate_number'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Create the violation
        $violation = Violation::create([
            'custom_user_id' => $user->custom_id,
            'plate_number' => $validated['plate_number'],
            'detected_at' => $validated['detected_at'],
            'speed' => $validated['speed'],
            'decibel_level' => $validated['decibel_level'],
            'status' => $validated['status'] ?? 'flagged',
        ]);

        return response()->json($violation, 201);
    }
}
