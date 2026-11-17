import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { UserCircle, KeyRound, LogOut, Save, ShieldAlert, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfileData {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    roles: string[];
    created_at?: string;
}

interface EditProps {
    user: UserProfileData;
}

export default function ProfilEdit({ user }: EditProps) {
    /* ── Form 1: Data Diri & Avatar ── */
    const {
        data: profileData,
        setData: setProfileData,
        post: postProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        _method: 'put',
        name: user.name,
        email: user.email,
        current_password: '',
        avatar: null as File | null,
    });

    const isEmailChanged =
        profileData.email.toLowerCase() !== user.email.toLowerCase();

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postProfile(route('admin.profil.update'), {
            onSuccess: () => {
                toast.success('Profil berhasil diperbarui');
                setProfileData('current_password', '');
            },
        });
    };

    /* ── Form 2: Ganti Password ── */
    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        reset: resetPassword,
        errors: passwordErrors,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword(route('admin.profil.password'), {
            onSuccess: () => {
                toast.success('Password berhasil diperbarui');
                resetPassword();
            },
        });
    };

    /* ── Form 3: Keluar Perangkat Lain ── */
    const {
        data: logoutData,
        setData: setLogoutData,
        post: postLogout,
        processing: logoutProcessing,
        reset: resetLogout,
        errors: logoutErrors,
    } = useForm({
        password: '',
    });

    const handleLogoutOthersSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postLogout(route('admin.profil.logout-others'), {
            onSuccess: () => {
                toast.success('Berhasil keluar dari seluruh sesi perangkat lain');
                resetLogout();
            },
        });
    };

    return (
        <AdminLayout title="Profil Saya">
            <Head title="Profil Saya" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                        Profil Saya
                    </h1>
                    <p className="text-neutral-500 text-sm mt-1">
                        Kelola informasi akun, foto profil, dan keamanan kredensial login Anda.
                    </p>
                </div>

                {/* KARTU 1: DATA DIRI & AVATAR */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 pb-5 border-b border-neutral-100 mb-6">
                        <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                            <UserCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">Informasi Pribadi</h2>
                            <p className="text-xs text-neutral-500">Perbarui nama, alamat email, dan foto avatar Anda.</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-2">
                                Foto Avatar
                            </label>
                            <div className="max-w-xs">
                                <ImageUpload
                                    value={user.avatar_url}
                                    onChange={(file) => setProfileData('avatar', file)}
                                    error={profileErrors.avatar}
                                />
                            </div>
                            <p className="text-xs text-neutral-400 mt-2">
                                Format gambar JPG, PNG, atau WebP. Maks 2MB.
                            </p>
                        </div>

                        {/* Nama & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={profileData.name}
                                    onChange={(e) => setProfileData('name', e.target.value)}
                                    required
                                />
                                {profileErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">
                                    Alamat Email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData('email', e.target.value)}
                                    required
                                />
                                {profileErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Konfirmasi password jika email berubah */}
                        {isEmailChanged && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                <label className="block text-sm font-semibold text-amber-900 mb-1">
                                    Password Saat Ini (Dibutuhkan untuk ganti email) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Ketik password Anda saat ini..."
                                    value={profileData.current_password}
                                    onChange={(e) => setProfileData('current_password', e.target.value)}
                                    required
                                />
                                {profileErrors.current_password && (
                                    <p className="text-red-600 text-xs mt-1">{profileErrors.current_password}</p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-neutral-100">
                            <Button type="submit" disabled={profileProcessing} className="gap-2">
                                <Save className="w-4 h-4" />
                                Simpan Profil
                            </Button>
                        </div>
                    </form>
                </div>

                {/* KARTU 2: GANTI PASSWORD */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 pb-5 border-b border-neutral-100 mb-6">
                        <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">Perbarui Password</h2>
                            <p className="text-xs text-neutral-500">Pastikan akun menggunakan password yang kuat dan aman.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Password Saat Ini <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                required
                            />
                            {passwordErrors.current_password && (
                                <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">
                                    Password Baru <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                    required
                                />
                                {passwordErrors.password && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-800 mb-1">
                                    Ulangi Password Baru <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-neutral-100">
                            <Button type="submit" disabled={passwordProcessing} className="gap-2">
                                <Save className="w-4 h-4" />
                                Perbarui Password
                            </Button>
                        </div>
                    </form>
                </div>

                {/* KARTU 3: KELUAR DARI PERANGKAT LAIN */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 pb-5 border-b border-neutral-100 mb-6">
                        <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">Sesi Login Perangkat Lain</h2>
                            <p className="text-xs text-neutral-500">
                                Keluar secara paksa dari semua browser dan perangkat lain yang sedang login.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleLogoutOthersSubmit} className="space-y-4">
                        <p className="text-sm text-neutral-600">
                            Masukkan password akun Anda untuk mengonfirmasi pengeluaran sesi dari seluruh perangkat lain.
                        </p>

                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Password Akun <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="password"
                                placeholder="Masukkan password Anda..."
                                value={logoutData.password}
                                onChange={(e) => setLogoutData('password', e.target.value)}
                                required
                            />
                            {logoutErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{logoutErrors.password}</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="danger"
                                disabled={logoutProcessing || !logoutData.password}
                                className="gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Keluar dari Perangkat Lain
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
