<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SMSController extends Controller
{
    protected $apiKey;
    protected $senderName;

    public function __construct()
    {
        $this->apiKey = config('services.semaphore.api_key');
        $this->senderName = config('services.semaphore.sender_name');
    }

    public function sendSMS(Request $request)
    {
        $request->validate([
            'to' => 'required|string',
            'message' => 'required|string'
        ]);

        try {
            $response = Http::post('https://api.semaphore.co/api/v4/messages', [
                'apikey' => $this->apiKey,
                'number' => $request->to,
                'message' => $request->message,
                'sendername' => $this->senderName,
            ]);

            $responseBody = $response->json();

            if ($response->successful() && isset($responseBody[0]['status']) && $responseBody[0]['status'] === 'Success') {
                Log::info('SMS sent successfully via Semaphore', [
                    'to' => $request->to,
                    'message' => $request->message,
                    'response' => $responseBody
                ]);

                return response()->json([
                    'message' => 'SMS sent successfully via Semaphore',
                    'data' => $responseBody
                ]);
            } else {
                Log::error('Failed to send SMS via Semaphore', [
                    'to' => $request->to,
                    'message' => $request->message,
                    'response' => $responseBody,
                    'status_code' => $response->status()
                ]);

                return response()->json([
                    'message' => 'Failed to send SMS via Semaphore: ' . ($responseBody[0]['message'] ?? 'Unknown error'),
                    'details' => $responseBody
                ], $response->status());
            }
        } catch (\Exception $e) {
            Log::error('Failed to send SMS via Semaphore (Exception)', [
                'to' => $request->to,
                'message' => $request->message,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to send SMS via Semaphore: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendViolationSMS(Request $request)
    {
        $request->validate([
            'custom_id' => 'required|string',
            'violation_type' => 'required|string',
            'offense_count' => 'required|integer|min:1|max:3',
            'timestamp' => 'required|date'
        ]);

        $user = User::where('custom_id', $request->custom_id)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if (!$user->phone_number) {
            return response()->json([
                'message' => 'User has no phone number registered'
            ], 400);
        }

        $message = $this->getViolationMessage(
            $request->violation_type, 
            $request->offense_count,
            $request->timestamp
        );

        try {
            $response = Http::post('https://api.semaphore.co/api/v4/messages', [
                'apikey' => $this->apiKey,
                'number' => $user->phone_number,
                'message' => $message,
                'sendername' => $this->senderName,
            ]);

            $responseBody = $response->json();

            if ($response->successful() && is_array($responseBody) && isset($responseBody[0]['status'])) {
                if (in_array($responseBody[0]['status'], ['Success', 'Pending'])) {
                    Log::info('Violation SMS sent or pending via Semaphore', [
                        'custom_id' => $user->custom_id,
                        'phone' => $user->phone_number,
                        'violation_type' => $request->violation_type,
                        'offense_count' => $request->offense_count,
                        'timestamp' => $request->timestamp,
                        'response' => $responseBody
                    ]);
                    return response()->json([
                        'message' => 'Violation SMS sent or pending via Semaphore',
                        'data' => $responseBody
                    ]);
                } else {
                    Log::warning('Semaphore responded but status not Success/Pending', [
                        'custom_id' => $user->custom_id,
                        'phone' => $user->phone_number,
                        'violation_type' => $request->violation_type,
                        'offense_count' => $request->offense_count,
                        'timestamp' => $request->timestamp,
                        'response' => $responseBody
                    ]);
                    return response()->json([
                        'message' => 'Semaphore responded but status not Success/Pending: ' . ($responseBody[0]['message'] ?? 'Unknown error'),
                        'details' => $responseBody
                    ], 200);
                }
            } else {
                Log::error('Unexpected Semaphore response structure', [
                    'custom_id' => $user->custom_id,
                    'phone' => $user->phone_number,
                    'violation_type' => $request->violation_type,
                    'offense_count' => $request->offense_count,
                    'timestamp' => $request->timestamp,
                    'response' => $responseBody,
                    'status_code' => $response->status()
                ]);
                return response()->json([
                    'message' => 'Unexpected Semaphore response structure',
                    'details' => $responseBody
                ], $response->status());
            }
        } catch (\Exception $e) {
            Log::error('Failed to send violation SMS via Semaphore (Exception)', [
                'custom_id' => $user->custom_id,
                'phone' => $user->phone_number,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to send violation SMS via Semaphore: ' . $e->getMessage()
            ], 500);
        }
    }

    protected function getViolationMessage($violationType, $offenseCount, $timestamp)
    {
        $baseMessage = "RoadSense Alert: You have been detected with a {$violationType} violation on {$timestamp}. ";
        
        switch ($offenseCount) {
            case 1:
                return $baseMessage . "This is your 1st offense. Please submit an apology letter.";
            case 2:
                return $baseMessage . "This is your 2nd offense. Please report to the Physical Office.";
            case 3:
                return $baseMessage . "This is your 3rd offense. Your gate pass has been suspended.";
            default:
                return $baseMessage . "Please drive safely.";
        }
    }
} 