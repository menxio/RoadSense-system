<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignRoleSeeder extends Seeder
{
    public function run()
    {
        // Assign the 'admin' role to a user
        $admin = User::find(1); // Replace with the actual user ID
        if ($admin) {
            $admin->assignRole('admin');
        }

        // Assign the 'user' role to another user
        $user = User::find(2); // Replace with the actual user ID
        if ($user) {
            $user->assignRole('user');
        }
    }
}