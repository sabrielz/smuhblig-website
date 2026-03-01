<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'manage artikel',
            'manage galeri',
            'manage pengumuman',
            'manage jurusan',
            'manage tautan',
            'manage pengguna',
            'manage pengaturan',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles and assign permissions

        // 1. Author
        $authorRole = Role::firstOrCreate(['name' => 'author']);

        // 2. Editor
        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $editorRole->givePermissionTo([
            'manage artikel',
            'manage galeri',
            'manage pengumuman',
        ]);

        // 3. Admin
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all()); // Admin gets all permissions
    }
}
