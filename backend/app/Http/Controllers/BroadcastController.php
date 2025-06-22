<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BroadcastController extends Controller
{
    public function authenticate(Request $request)
    {
        // Log the request for debugging
        \Log::info('Broadcasting Auth Route Hit', ['request' => $request->all()]);

        // Example logic for authentication
        if ($request->user()) {
            return response()->json(['message' => 'Authenticated'], 200);
        }

        return response()->json(['message' => 'Unauthenticated'], 401);
    }
}
