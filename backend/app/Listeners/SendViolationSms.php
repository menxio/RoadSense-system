<?php

namespace App\Listeners;
use App\Events\ViolationCreated;
use App\Models\User;
use App\Http\Controllers\SMSController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SendViolationSms
{
    public function handle(ViolationCreated $event)
    {
        $violation = $event->violation;
        $offenseCount = $event->offenseCount;

        $user = User::where('custom_id', $violation->custom_user_id)->first();

        if (!$user) {
            Log::error('SendViolationSms: User not found for custom_id', [
                'custom_id' => $violation->custom_user_id,
                'violation_id' => $violation->_id
            ]);
            return;
        }

        if (!$user->phone_number) {
            Log::warning('SendViolationSms: User has no phone number registered', [
                'custom_id' => $user->custom_id
            ]);
            return;
        }

        $violationType = $this->getViolationType($violation);

        $smsRequest = new Request([
            'custom_id' => $user->custom_id,
            'violation_type' => $violationType,
            'offense_count' => $offenseCount,
            'timestamp' => $violation->detected_at,
        ]);
        $smsController = new SMSController();
        $smsController->sendViolationSMS($smsRequest);
    }

    /**
     * Determines the violation type based on violation data.
     *
     * @param \App\Models\Violation $violation
     * @return string
     */
    protected function getViolationType($violation)
    {
        if (!is_null($violation->speed) && $violation->speed > 10) {
            return 'Overspeeding';
        }
        if (!is_null($violation->decibel_level) && $violation->decibel_level > 91) {
            return 'Illegal Honking';
        }
        return 'General Violation'; // Fallback for unspecified types
    }
}