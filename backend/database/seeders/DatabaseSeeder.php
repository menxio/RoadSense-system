<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RoleSeeder::class, // Ensure roles are seeded first
            UsersTableSeeder::class, // Seed users and assign roles
        ]);
    }
}