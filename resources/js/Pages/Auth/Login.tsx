import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import { fadeIn, fadeInUp, scaleIn, staggerContainer } from '@/lib/motion';
import type { SharedProps } from '@/types';

// ---------------------------------------------------------------------------
// Islamic Geometric SVG Pattern — subtle overlay
// ---------------------------------------------------------------------------
const IslamicPattern = () => (
    <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern
                id="islamic-star"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
            >
                {/* 8-pointed star element */}
                <polygon
                    points="40,8 46,28 64,22 52,36 72,40 52,44 64,58 46,52 40,72 34,52 16,58 28,44 8,40 28,36 16,22 34,28"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.8"
                />
                <polygon
                    points="40,20 44,32 56,28 48,38 60,40 48,42 56,52 44,48 40,60 36,48 24,52 32,42 20,40 32,38 24,28 36,32"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.4"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star)" />
    </svg>
);

// ---------------------------------------------------------------------------
// Sekolah Logo Mark (monogram) — placeholder visual
// ---------------------------------------------------------------------------
const LogoMark = () => (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center">
            <span className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                SMK
            </span>
        </div>
        <div>
            <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                SMK Muhammadiyah
            </div>
            <div className="text-[#c9a84c] text-xs font-medium tracking-wide">
                Bligo
            </div>
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Main Login Page
// ---------------------------------------------------------------------------
export default function Login() {
    const { flash } = usePage<SharedProps>().props;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    const hasError = errors.email || errors.password || flash.error;

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* ----------------------------------------------------------------
                LEFT PANEL — Branded Visual (60%)
            ---------------------------------------------------------------- */}
            <motion.div
                className="relative hidden md:flex md:w-[60%] flex-col justify-between p-12 overflow-hidden"
                style={{ backgroundColor: '#001f4d' }}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                {/* Islamic geometric pattern overlay */}
                <IslamicPattern />

                {/* Radial glow accent */}
                <div
                    className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,63,135,0.6) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)',
                    }}
                />

                {/* Top — Logo */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <LogoMark />
                </motion.div>

                {/* Center — Tagline area */}
                <motion.div
                    className="relative z-10 space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p
                        variants={fadeInUp}
                        className="text-[#c9a84c] text-sm font-semibold tracking-[0.2em] uppercase"
                    >
                        Panel Administrasi
                    </motion.p>
                    <motion.h1
                        variants={fadeInUp}
                        className="text-white leading-tight"
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '3rem',
                            fontWeight: 800,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Kelola Konten
                        <br />
                        <span style={{ color: '#c9a84c' }}>Sekolah</span> dengan
                        <br />
                        Mudah
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        className="text-white/60 text-lg leading-relaxed max-w-md"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Sistem manajemen konten terpadu untuk SMK Muhammadiyah Bligo.
                        Tulis artikel, kelola galeri, dan pantau pengumuman dari satu dashboard.
                    </motion.p>
                </motion.div>

                {/* Bottom — Decorative quote */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8 }}
                    className="relative z-10 border-l-2 border-[#c9a84c]/40 pl-5"
                >
                    <p className="text-white/50 text-sm italic leading-relaxed">
                        "Mencetak generasi unggul, berilmu, dan berakhlak mulia."
                    </p>
                    <p className="text-[#c9a84c]/70 text-xs mt-2 font-medium tracking-wide">
                        SMK MUHAMMADIYAH BLIGO
                    </p>
                </motion.div>
            </motion.div>

            {/* ----------------------------------------------------------------
                RIGHT PANEL — Login Form (40%)
            ---------------------------------------------------------------- */}
            <motion.div
                className="flex-1 md:w-[40%] flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 bg-white"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
            >

                {/* Mobile-only logo */}
                <div className="flex md:hidden items-center justify-center mb-10">
                    <div
                        className="flex items-center gap-3 px-5 py-3 rounded-xl"
                        style={{ backgroundColor: '#001f4d' }}
                    >
                        <span className="text-[#c9a84c] font-bold text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            SMK
                        </span>
                        <span className="text-white text-sm font-semibold">Muhammadiyah Bligo</span>
                    </div>
                </div>

                <motion.div
                    className="max-w-sm w-full mx-auto space-y-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="space-y-2">
                        <h2
                            className="text-3xl font-bold"
                            style={{
                                color: '#111111',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            Selamat Datang
                        </h2>
                        <p className="text-sm" style={{ color: '#636366', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Masuk ke panel admin SMK Muhammadiyah Bligo
                        </p>
                    </motion.div>

                    {/* Flash / Global error */}
                    {hasError && (
                        <motion.div
                            variants={scaleIn}
                            className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                            style={{
                                backgroundColor: '#fff0ef',
                                borderColor: '#ff453a33',
                            }}
                            role="alert"
                        >
                            <AlertCircle
                                size={18}
                                strokeWidth={1.5}
                                className="mt-0.5 shrink-0"
                                style={{ color: '#ff453a' }}
                            />
                            <p className="text-sm" style={{ color: '#ff453a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {errors.email || errors.password || flash.error}
                            </p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        variants={staggerContainer}
                        onSubmit={handleSubmit}
                        noValidate
                        className="space-y-5"
                    >
                        {/* Email Field */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                            <label
                                htmlFor="login-email"
                                className="block text-sm font-semibold"
                                style={{ color: '#111111' }}
                            >
                                Alamat Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Mail
                                        size={16}
                                        strokeWidth={1.5}
                                        style={{ color: errors.email ? '#ff453a' : '#8e8e93' }}
                                    />
                                </div>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@smkmuhbligo.sch.id"
                                    className={cn(
                                        'w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all duration-200 outline-none',
                                        'focus:ring-2',
                                        errors.email
                                            ? 'border-[#ff453a] bg-[#fff0ef] focus:ring-[#ff453a]/20'
                                            : 'border-[#e5e5ea] bg-white focus:border-[#003f87] focus:ring-[#003f87]/15 hover:border-[#aeaeb2]',
                                    )}
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#111111' }}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    aria-invalid={!!errors.email}
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                            <label
                                htmlFor="login-password"
                                className="block text-sm font-semibold"
                                style={{ color: '#111111' }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Lock
                                        size={16}
                                        strokeWidth={1.5}
                                        style={{ color: errors.password ? '#ff453a' : '#8e8e93' }}
                                    />
                                </div>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password Anda"
                                    className={cn(
                                        'w-full pl-10 pr-12 py-3 rounded-xl text-sm border transition-all duration-200 outline-none',
                                        'focus:ring-2',
                                        errors.password
                                            ? 'border-[#ff453a] bg-[#fff0ef] focus:ring-[#ff453a]/20'
                                            : 'border-[#e5e5ea] bg-white focus:border-[#003f87] focus:ring-[#003f87]/15 hover:border-[#aeaeb2]',
                                    )}
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#111111' }}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    aria-invalid={!!errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors duration-150 hover:bg-[#f2f2f7]"
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} strokeWidth={1.5} style={{ color: '#8e8e93' }} />
                                    ) : (
                                        <Eye size={16} strokeWidth={1.5} style={{ color: '#8e8e93' }} />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember me */}
                        <motion.div variants={fadeInUp} className="flex items-center gap-2.5">
                            <input
                                id="login-remember"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-[#d1d1d6] accent-[#003f87] cursor-pointer"
                            />
                            <label
                                htmlFor="login-remember"
                                className="text-sm cursor-pointer select-none"
                                style={{ color: '#636366' }}
                            >
                                Ingat saya selama 30 hari
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={fadeInUp}>
                            <button
                                id="login-submit"
                                type="submit"
                                disabled={processing}
                                className={cn(
                                    'w-full flex items-center justify-center gap-2.5',
                                    'px-6 py-3.5 rounded-xl text-sm font-semibold text-white',
                                    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    'focus:ring-[#003f87]',
                                    processing
                                        ? 'opacity-75 cursor-not-allowed bg-[#003f87]'
                                        : 'bg-[#003f87] hover:bg-[#002d6b] active:scale-[0.99] shadow-md shadow-[#003f87]/25',
                                )}
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                                        Memverifikasi...
                                    </>
                                ) : (
                                    'Masuk ke Dashboard'
                                )}
                            </button>
                        </motion.div>

                        {/* Forgot Password */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <a
                                href={route('password.request')}
                                className="text-sm font-medium transition-colors duration-150 hover:underline"
                                style={{ color: '#003f87', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                Lupa password?
                            </a>
                        </motion.div>
                    </motion.form>

                    {/* Back to website */}
                    <motion.div
                        variants={fadeInUp}
                        className="pt-2 flex items-center justify-center"
                    >
                        <a
                            href={route('beranda')}
                            className={cn(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                                'transition-all duration-150',
                                'text-[#003f87] hover:bg-[#eef5fc]',
                            )}
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            <ArrowLeft size={15} strokeWidth={1.5} />
                            Kembali ke Website
                        </a>
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
