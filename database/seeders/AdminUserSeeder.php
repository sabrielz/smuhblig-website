<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = env('ADMIN_INITIAL_PASSWORD') ?: Str::password(16);

        $admin = User::firstOrCreate(
            ['email' => 'admin@smkmuhbligo.sch.id'],
            [
                'name' => 'Super Administrator',
                'password' => bcrypt($password),
                'is_active' => true,
            ]
        );

        if ($admin->wasRecentlyCreated) {
            $admin->assignRole('admin');

            if (app()->environment('local')) {
                $this->command->info('Admin user created successfully.');
                $this->command->info('Email: admin@smkmuhbligo.sch.id');
                $this->command->warn('Password: '.$password);

                echo "\n----------------------------------------\n";
                echo "Admin user created successfully.\n";
                echo "Email: admin@smkmuhbligo.sch.id\n";
                echo "Password: {$password}\n";
                echo "----------------------------------------\n";
            }
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
