import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { UserCircle, KeyRound, LogOut, Save, ShieldAlert, Check, ShieldCheck, QrCode, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfileData {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    roles: string[];
    created_at?: string;
    two_factor_enabled?: boolean;
    two_factor_qr_svg?: string | null;
    two_factor_secret?: string | null;
}

interface EditProps {
    user: UserProfileData;
    recoveryCodes?: string[] | null;
}

export default function ProfilEdit({ user, recoveryCodes }: EditProps) {
    const [copiedRecovery, setCopiedRecovery] = useState(false);

    /* ── 2FA State & Forms ── */
    const {
        data: confirm2FaData,
        setData: setConfirm2FaData,
        post: postConfirm2Fa,
        processing: confirm2FaProcessing,
        errors: confirm2FaErrors,
        reset: resetConfirm2Fa,
    } = useForm({
        code: '',
    });

    const {
        data: disable2FaData,
        setData: setDisable2FaData,
        post: postDisable2Fa,
        processing: disable2FaProcessing,
        errors: disable2FaErrors,
        reset: resetDisable2Fa,
    } = useForm({
        password: '',
    });

    const handleEnable2Fa = () => {
        router.post(route('admin.profil.two-factor.enable'), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Silakan pindai kode QR untuk melanjutkan aktivasi.'),
        });
    };

    const handleConfirm2FaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postConfirm2Fa(route('admin.profil.two-factor.confirm'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Autentikasi dua faktor berhasil diaktifkan!');
                resetConfirm2Fa();
            },
        });
    };

    const handleDisable2FaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postDisable2Fa(route('admin.profil.two-factor.disable'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Autentikasi dua faktor berhasil dinonaktifkan.');
                resetDisable2Fa();
            },
        });
    };

    const handleRegenerateRecoveryCodes = () => {
        router.post(route('admin.profil.two-factor.recovery-codes'), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Kode pemulihan baru berhasil dibuat.'),
        });
    };

    const handleCopyRecoveryCodes = () => {
        if (!recoveryCodes || recoveryCodes.length === 0) return;
        navigator.clipboard.writeText(recoveryCodes.join('\n'));
        setCopiedRecovery(true);
        toast.success('Kode pemulihan disalin ke clipboard');
        setTimeout(() => setCopiedRecovery(false), 3000);
    };

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

                {/* KARTU 2FA (Autentikasi Dua Faktor) */}
                <div id="2fa" className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 pb-5 border-b border-neutral-100 mb-6">
                        <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">Autentikasi Dua Faktor (2FA)</h2>
                            <p className="text-xs text-neutral-500">
                                Tingkatkan keamanan akun CMS Anda menggunakan aplikasi TOTP (Google Authenticator, dsb).
                            </p>
                        </div>
                    </div>

                    {user.two_factor_enabled ? (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-900">2FA Aktif</p>
                                        <p className="text-xs text-emerald-700">Akun Anda dilindungi oleh verifikasi dua langkah.</p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRegenerateRecoveryCodes}
                                    className="gap-1.5 self-start sm:self-auto"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Buat Ulang Kode Pemulihan
                                </Button>
                            </div>

                            {recoveryCodes && recoveryCodes.length > 0 && (
                                <div className="p-5 rounded-xl bg-neutral-900 text-neutral-100 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-amber-400">Simpan Kode Pemulihan Ini!</p>
                                            <p className="text-xs text-neutral-400">Kode ini hanya ditampilkan sekali. Simpan di tempat yang aman jika Anda kehilangan akses perangkat TOTP.</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyRecoveryCodes}
                                            className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 gap-1.5 self-start sm:self-auto"
                                        >
                                            {copiedRecovery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copiedRecovery ? 'Tersalin' : 'Salin Semua'}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                                        {recoveryCodes.map((rc, idx) => (
                                            <div key={idx} className="font-mono text-xs bg-neutral-800 p-2 rounded text-center border border-neutral-700">
                                                {rc}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-neutral-100">
                                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Nonaktifkan 2FA</h3>
                                <p className="text-xs text-neutral-500 mb-4">
                                    Masukkan kata sandi akun Anda untuk menonaktifkan autentikasi dua faktor.
                                </p>
                                <form onSubmit={handleDisable2FaSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                                    <div className="flex-1">
                                        <Input
                                            type="password"
                                            placeholder="Kata sandi saat ini..."
                                            value={disable2FaData.password}
                                            onChange={(e) => setDisable2FaData('password', e.target.value)}
                                            error={disable2FaErrors.password}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="danger"
                                        disabled={disable2FaProcessing || !disable2FaData.password}
                                        className="shrink-0"
                                    >
                                        Nonaktifkan
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ) : user.two_factor_qr_svg ? (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                <p className="text-sm font-semibold text-amber-900 mb-1">Pindai Kode QR</p>
                                <p className="text-xs text-amber-800">
                                    Pindai gambar kode QR di bawah dengan aplikasi autentikator Anda (seperti Google Authenticator, Authy, dsb), lalu masukkan kode OTP 6 digit untuk menyelesaikan aktivasi.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <div
                                    className="w-48 h-48 bg-white p-2 rounded-lg shadow-xs flex items-center justify-center shrink-0"
                                    dangerouslySetInnerHTML={{ __html: user.two_factor_qr_svg }}
                                />
                                <div className="space-y-3 flex-1 w-full">
                                    <div>
                                        <p className="text-xs text-neutral-500">Atau masukkan kunci rahasia ini secara manual:</p>
                                        <p className="font-mono text-xs sm:text-sm font-bold text-neutral-900 select-all bg-white p-2 rounded border border-neutral-200 inline-block mt-1">
                                            {user.two_factor_secret}
                                        </p>
                                    </div>

                                    <form onSubmit={handleConfirm2FaSubmit} className="space-y-3 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                                                Kode OTP 6 Digit <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="text"
                                                maxLength={6}
                                                placeholder="Contoh: 123456"
                                                value={confirm2FaData.code}
                                                onChange={(e) => setConfirm2FaData('code', e.target.value)}
                                                error={confirm2FaErrors.code}
                                                required
                                                className="font-mono text-center tracking-widest text-lg max-w-xs"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={confirm2FaProcessing || confirm2FaData.code.length < 6}
                                        >
                                            Konfirmasi & Aktifkan 2FA
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-neutral-600">
                                Autentikasi dua faktor menambahkan lapisan keamanan ekstra pada akun Anda saat login.
                            </p>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleEnable2Fa}
                                className="gap-2"
                            >
                                <QrCode className="w-4 h-4" />
                                Aktifkan 2FA Sekarang
                            </Button>
                        </div>
                    )}
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
