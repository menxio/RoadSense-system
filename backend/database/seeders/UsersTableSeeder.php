<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@roadsense.com',
            'password' => bcrypt('Password!123'),
            'role' => 'admin',
        ]);

        // // Create regular users
        // User::factory(10)->create([
        //     'role' => 'user',
        // ]);
    }
}