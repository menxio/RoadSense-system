<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Violation;
use Carbon\Carbon;

class ViolationController extends Controller
{
    public function index()
    {
        return response()->json(Violation::all());
    }
    
    public function store(Request $request)
    {
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
    
    public function show($customUserId)
    {
        $violations = Violation::where('custom_user_id', $customUserId)->get();

        if ($violations->isEmpty()) {
            return response()->json(['message' => 'No violations found for this user'], 404);
        }

        $startOfToday = Carbon::now()->startOfDay()->toIso8601String();
        $endOfToday = Carbon::now()->endOfDay()->toIso8601String();

        $todaysViolationsCount = Violation::where('custom_user_id', $customUserId)
            ->where('detected_at', '>=', $startOfToday) // Start of today
            ->where('detected_at', '<=', $endOfToday)   // End of today
            ->count();

        $totalViolationsCount = Violation::where('custom_user_id', $customUserId)->count();

        return response()->json([
            'violations' => $violations,
            'todays_violations_count' => $todaysViolationsCount,
            'total_violations_count' => $totalViolationsCount,
        ]);
    }

    public function update(Request $request, $id)
    {
        $violation = Violation::find($id);

        if (!$violation) {
            return response()->json(['message' => 'Violation not found'], 404);
        }

        $validated = $request->validate([
            'plate_number' => 'sometimes|string',
            'detected_at' => 'sometimes|date',
            'speed' => 'sometimes|numeric',
            'decibel_level' => 'sometimes|numeric',
            'status' => 'sometimes|string|in:flagged,reviewed,cleared',
        ]);

        $violation->update([
            'plate_number' => $validated['plate_number'] ?? $violation->plate_number,
            'detected_at' => $validated['detected_at'] ?? $violation->detected_at,
            'speed' => $validated['speed'] ?? $violation->speed,
            'decibel_level' => $validated['decibel_level'] ?? $violation->decibel_level,
            'status' => $validated['status'] ?? $violation->status,
        ]);

        return response()->json([
            'message' => 'Violation updated successfully',
            'violation' => $violation,
        ]);
    }
}
