import { Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import { fadeIn, fadeInUp, scaleIn, staggerContainer } from '@/lib/motion';

// ─── Islamic Geometric Pattern ─────────────────────────────────────────────────
const IslamicPattern = () => (
    <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern id="islamic-star-reset" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon
                    points="40,8 46,28 64,22 52,36 72,40 52,44 64,58 46,52 40,72 34,52 16,58 28,44 8,40 28,36 16,22 34,28"
                    fill="none" stroke="white" strokeWidth="0.8"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star-reset)" />
    </svg>
);

interface PageProps {
    token: string;
    email: string;
}

export default function ResetPassword() {
    const { token, email } = usePage<PageProps>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('password.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const hasError = errors.email || errors.password || errors.password_confirmation;

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* ── LEFT PANEL ── */}
            <motion.div
                className="relative hidden md:flex md:w-[60%] flex-col justify-between p-12 overflow-hidden"
                style={{ backgroundColor: '#001f4d' }}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                <IslamicPattern />
                <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(0,63,135,0.6) 0%, transparent 70%)' }} />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)' }} />

                {/* Logo */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center">
                            <span className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SMK</span>
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm leading-tight">SMK Muhammadiyah</div>
                            <div className="text-[#c9a84c] text-xs font-medium">Bligo</div>
                        </div>
                    </div>
                </motion.div>

                {/* Center */}
                <motion.div className="relative z-10 space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
                    <motion.p variants={fadeInUp} className="text-[#c9a84c] text-sm font-semibold tracking-[0.2em] uppercase">
                        Buat Password Baru
                    </motion.p>
                    <motion.h1
                        variants={fadeInUp}
                        className="text-white leading-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.01em' }}
                    >
                        Password <span style={{ color: '#c9a84c' }}>baru,</span>
                        <br />akses kembali.
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-white/60 text-lg leading-relaxed max-w-md" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Buat password yang kuat dan mudah Anda ingat. Gunakan minimal 8 karakter.
                    </motion.p>
                </motion.div>

                {/* Bottom */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="relative z-10 border-l-2 border-[#c9a84c]/40 pl-5">
                    <p className="text-white/50 text-sm italic leading-relaxed">"Mencetak generasi unggul, berilmu, dan berakhlak mulia."</p>
                    <p className="text-[#c9a84c]/70 text-xs mt-2 font-medium tracking-wide">SMK MUHAMMADIYAH BLIGO</p>
                </motion.div>
            </motion.div>

            {/* ── RIGHT PANEL ── */}
            <motion.div
                className="flex-1 md:w-[40%] flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 bg-white"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
            >
                {/* Mobile logo */}
                <div className="flex md:hidden items-center justify-center mb-10">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl" style={{ backgroundColor: '#001f4d' }}>
                        <span className="text-[#c9a84c] font-bold text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SMK</span>
                        <span className="text-white text-sm font-semibold">Muhammadiyah Bligo</span>
                    </div>
                </div>

                <motion.div className="max-w-sm w-full mx-auto space-y-8" variants={staggerContainer} initial="hidden" animate="visible">
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#003f87]/10 flex items-center justify-center mb-4">
                            <KeyRound className="w-6 h-6 text-[#003f87]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold" style={{ color: '#111111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Buat Password Baru
                        </h2>
                        <p className="text-sm" style={{ color: '#636366', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Untuk akun: <strong>{email}</strong>
                        </p>
                    </motion.div>

                    {/* Error */}
                    {hasError && (
                        <motion.div
                            variants={scaleIn}
                            className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                            style={{ backgroundColor: '#fff0ef', borderColor: '#ff453a33' }}
                            role="alert"
                        >
                            <AlertCircle size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: '#ff453a' }} />
                            <p className="text-sm" style={{ color: '#ff453a' }}>
                                {errors.email || errors.password || errors.password_confirmation}
                            </p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form variants={staggerContainer} onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Email (hidden) */}
                        <input type="hidden" name="email" value={data.email} />
                        <input type="hidden" name="token" value={data.token} />

                        {/* Password */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                            <label htmlFor="reset-password" className="block text-sm font-semibold" style={{ color: '#111111' }}>
                                Password Baru
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Lock size={16} strokeWidth={1.5} style={{ color: errors.password ? '#ff453a' : '#8e8e93' }} />
                                </div>
                                <input
                                    id="reset-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className={cn(
                                        'w-full pl-10 pr-12 py-3 rounded-xl text-sm border transition-all duration-200 outline-none focus:ring-2',
                                        errors.password
                                            ? 'border-[#ff453a] bg-[#fff0ef] focus:ring-[#ff453a]/20'
                                            : 'border-[#e5e5ea] bg-white focus:border-[#003f87] focus:ring-[#003f87]/15 hover:border-[#aeaeb2]',
                                    )}
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#111111' }}
                                    aria-invalid={!!errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors hover:bg-[#f2f2f7]"
                                    aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {showPassword
                                        ? <EyeOff size={16} strokeWidth={1.5} style={{ color: '#8e8e93' }} />
                                        : <Eye size={16} strokeWidth={1.5} style={{ color: '#8e8e93' }} />
                                    }
                                </button>
                            </div>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                            <label htmlFor="reset-password-confirm" className="block text-sm font-semibold" style={{ color: '#111111' }}>
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Lock size={16} strokeWidth={1.5} style={{ color: errors.password_confirmation ? '#ff453a' : '#8e8e93' }} />
                                </div>
                                <input
                                    id="reset-password-confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password baru"
                                    className={cn(
                                        'w-full pl-10 pr-12 py-3 rounded-xl text-sm border transition-all duration-200 outline-none focus:ring-2',
                                        errors.password_confirmation
                                            ? 'border-[#ff453a] bg-[#fff0ef] focus:ring-[#ff453a]/20'
                                            : 'border-[#e5e5ea] bg-white focus:border-[#003f87] focus:ring-[#003f87]/15 hover:border-[#aeaeb2]',
                                    )}
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#111111' }}
                                    aria-invalid={!!errors.password_confirmation}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors hover:bg-[#f2f2f7]"
                                    aria-label={showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {showConfirm
                                        ? <EyeOff size={16} strokeWidth={1.5} style={{ color: '#8e8e93' }} />
                                        : <Eye size={16} strokeWidth={1.5} style={{ color: '#8e8e93' }} />
                                    }
                                </button>
                            </div>
                        </motion.div>

                        {/* Submit */}
                        <motion.div variants={fadeInUp}>
                            <button
                                id="reset-submit"
                                type="submit"
                                disabled={processing}
                                className={cn(
                                    'w-full flex items-center justify-center gap-2.5',
                                    'px-6 py-3.5 rounded-xl text-sm font-semibold text-white',
                                    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003f87]',
                                    processing
                                        ? 'opacity-75 cursor-not-allowed bg-[#003f87]'
                                        : 'bg-[#003f87] hover:bg-[#002d6b] active:scale-[0.99] shadow-md shadow-[#003f87]/25',
                                )}
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : 'Reset Password'}
                            </button>
                        </motion.div>
                    </motion.form>

                    {/* Back to login */}
                    <motion.div variants={fadeInUp} className="pt-2 flex items-center justify-center">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-[#003f87] hover:bg-[#eef5fc]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            <ArrowLeft size={15} strokeWidth={1.5} />
                            Kembali ke halaman login
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1 }}
                    className="mt-12 text-center text-xs"
                    style={{ color: '#aeaeb2', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    © {new Date().getFullYear()} SMK Muhammadiyah Bligo. Hak cipta dilindungi.
                </motion.p>
            </motion.div>
        </div>
    );
}
