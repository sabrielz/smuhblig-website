<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePenggunaRequest;
use App\Http\Requests\Admin\UpdatePenggunaRequest;
use App\Http\Resources\Admin\PenggunaResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PenggunaController extends Controller
{
    public function index()
    {
        $penggunas = User::with('roles')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Pengguna/Index', [
            'penggunas' => PenggunaResource::collection($penggunas),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pengguna/Create');
    }

    public function store(StorePenggunaRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.pengguna.index')->with('success', 'Pengguna berhasil ditambahkan');
    }

    public function edit(User $pengguna)
    {
        return Inertia::render('Admin/Pengguna/Edit', [
            'pengguna' => [
                'id' => $pengguna->id,
                'name' => $pengguna->name,
                'email' => $pengguna->email,
                'role' => $pengguna->roles->first()?->name ?? 'author',
                'is_active' => $pengguna->is_active,
            ],
        ]);
    }

    public function update(UpdatePenggunaRequest $request, User $pengguna)
    {
        // Proteksi edit diri sendiri
        if (auth()->id() === $pengguna->id) {
            if ($request->role !== $pengguna->roles->first()?->name || ! $request->is_active) {
                return back()->with('error', 'Tidak dapat mengubah role atau status diri sendiri.');
            }
        }

        $validated = $request->validated();

        $pengguna->name = $validated['name'];
        $pengguna->email = $validated['email'];
        $pengguna->is_active = $validated['is_active'] ?? $pengguna->is_active;

        if ($validated['password']) {
            $pengguna->password = Hash::make($validated['password']);
        }

        $pengguna->save();

        if (auth()->id() !== $pengguna->id) {
            $pengguna->syncRoles([$validated['role']]);
        }

        return redirect()->route('admin.pengguna.index')->with('success', 'Pengguna berhasil diperbarui');
    }

    public function destroy(User $pengguna)
    {
        if (auth()->id() === $pengguna->id) {
            return back()->with('error', 'Tidak dapat menghapus akun diri sendiri.');
        }

        $pengguna->delete();

        return redirect()->route('admin.pengguna.index')->with('success', 'Pengguna berhasil dihapus');
    }
}
