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
            'letter' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $user = User::where('plate_number', $validated['plate_number'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $letterPath = null;
        if ($request->hasFile('letter')) {
            $letterPath = $request->file('letter')->store('letters', 'public');
        }

        $violation = Violation::create([
            'custom_user_id' => $user->custom_id,
            'plate_number' => $validated['plate_number'],
            'detected_at' => $validated['detected_at'],
            'speed' => $validated['speed'],
            'decibel_level' => $validated['decibel_level'],
            'letter_path' => $letterPath,
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
            ->where('detected_at', '>=', $startOfToday) 
            ->where('detected_at', '<=', $endOfToday)   
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
            'letter' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        // Handle letter file upload if present
        if ($request->hasFile('letter')) {
            $letterPath = $request->file('letter')->store('letters', 'public');
            $violation->letter_path = $letterPath;
            // Automatically set status to 'under review' when a letter is uploaded
            $violation->status = 'under review';
        }

        // Update other fields only if they are present in the request
        $violation->plate_number = $violation->plate_number;
        $violation->detected_at = $violation->detected_at;
        $violation->speed = $violation->speed;
        $violation->decibel_level = $violation->decibel_level;

        // If the status is not overridden by the letter upload, keep the original status
        $violation->status = $validated['status'] ?? $violation->status;

        $violation->save();

        return response()->json([
            'message' => 'Violation updated successfully',
            'violation' => $violation,
        ]);
    }
}
