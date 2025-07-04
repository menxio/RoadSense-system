<?php

namespace App\Events;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Violation;

class ViolationCreated
{
    use Dispatchable, SerializesModels;

    public $violation;
    public $offenseCount;

    public function __construct(Violation $violation, $offenseCount)
    {
        $this->violation = $violation;
        $this->offenseCount = $offenseCount;
    }
}