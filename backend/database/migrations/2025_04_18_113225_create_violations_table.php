<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('violations', function (Blueprint $table) {
            $table->id();
            $table->string('custom_user_id');
            $table->string('plate_number');
            $table->timestamp('detected_at');
            $table->float('speed')->nullable();
            $table->float('decibel_level')->nullable();
            $table->string('letter_path')->nullable();
            $table->enum('status', ['flagged', 'under_review', 'cleared'])->default('flagged');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};
