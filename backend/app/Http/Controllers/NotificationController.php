<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MongoNotification;
use App\Notifications\RealTimeNotification;

class NotificationController extends Controller
{
    /**
     * Fetch all notifications for a specific user.
     */
    public function index($userId)
    {
        $notifications = MongoNotification::where('notifiable_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead($userId, $id)
    {
        $notification = MongoNotification::where('notifiable_id', $userId)
            ->where('_id', $id)
            ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->update(['read_at' => now()]);
        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read for a specific user.
     */
    public function markAllAsRead($userId)
    {
        MongoNotification::where('notifiable_id', $userId)->update(['read_at' => now()]);
        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete a specific notification.
     */
    public function delete($userId, $id)
    {
        $notification = MongoNotification::where('notifiable_id', $userId)
            ->where('_id', $id)
            ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);
    }

    /**
     * Send a notification to all users.
     */
    public function sendNotification()
    {
        $users = User::all();
        $data = [
            'title' => 'New Violation Detected',
            'message' => 'A new speed violation has been detected.',
            'url' => '/violations',
        ];

        foreach ($users as $user) {
            MongoNotification::create([
                'notifiable_id' => $user->_id,
                'type' => 'App\Notifications\RealTimeNotification',
                'data' => $data,
                'read_at' => null,
            ]);
        }

        return response()->json(['message' => 'Notification sent successfully.']);
    }

    /**
     * Send a notification to a specific user.
     */
    public function notifyUser(Request $request, $userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'url' => 'nullable|string',
        ]);

        MongoNotification::create([
            'notifiable_id' => $user->_id,
            'type' => 'App\Notifications\RealTimeNotification',
            'data' => $data,
            'read_at' => null,
        ]);

        return response()->json(['message' => 'Notification sent to user successfully.']);
    }
}