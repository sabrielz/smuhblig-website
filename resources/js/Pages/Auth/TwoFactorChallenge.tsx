import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import { fadeIn, fadeInUp, scaleIn, staggerContainer } from '@/lib/motion';

const IslamicPattern = () => (
    <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern
                id="islamic-star-challenge"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
            >
                <polygon
                    points="40,8 46,28 64,22 52,36 72,40 52,44 64,58 46,52 40,72 34,52 16,58 28,44 8,40 28,36 16,22 34,28"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.8"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star-challenge)" />
    </svg>
);

export default function TwoFactorChallenge() {
    const [useRecovery, setUseRecovery] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('two-factor.login'));
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200/80 overflow-hidden relative"
            >
                {/* Header Background */}
                <div className="bg-primary-900 px-6 py-8 text-center relative overflow-hidden">
                    <IslamicPattern />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mb-3">
                            <ShieldCheck className="w-8 h-8 text-gold-500" />
                        </div>
                        <h1 className="text-xl font-bold text-white font-sans">
                            Autentikasi Dua Faktor
                        </h1>
                        <p className="text-primary-200 text-xs mt-1 max-w-xs">
                            {useRecovery
                                ? 'Masukkan salah satu kode pemulihan darurat akun Anda.'
                                : 'Buka aplikasi autentikator Anda dan masukkan kode 6 digit.'}
                        </p>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {/* Error Alerts */}
                    {(errors.code || errors.recovery_code) && (
                        <motion.div
                            variants={scaleIn}
                            initial="hidden"
                            animate="visible"
                            className="p-3.5 rounded-xl bg-error-light border border-error/30 flex items-start gap-2.5"
                        >
                            <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
                            <p className="text-xs text-error font-medium">
                                {errors.code || errors.recovery_code}
                            </p>
                        </motion.div>
                    )}

                    {!useRecovery ? (
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                            <label
                                htmlFor="otp-code"
                                className="block text-sm font-semibold text-neutral-900"
                            >
                                Kode Otentikasi (OTP)
                            </label>
                            <input
                                id="otp-code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                autoFocus
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="000000"
                                className={cn(
                                    'w-full py-3 text-center tracking-[0.3em] font-mono text-2xl font-bold rounded-xl border transition-all duration-200 outline-none text-neutral-900',
                                    'focus:ring-2',
                                    errors.code
                                        ? 'border-error bg-error-light focus:ring-error/20'
                                        : 'border-neutral-200 bg-white focus:border-primary-600 focus:ring-primary-600/15'
                                )}
                            />
                        </motion.div>
                    ) : (
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                            <label
                                htmlFor="recovery-code"
                                className="block text-sm font-semibold text-neutral-900"
                            >
                                Kode Pemulihan Darurat
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                    <KeyRound size={16} />
                                </div>
                                <input
                                    id="recovery-code"
                                    type="text"
                                    autoFocus
                                    value={data.recovery_code}
                                    onChange={(e) => setData('recovery_code', e.target.value)}
                                    placeholder="xxxx-xxxx-xxxx"
                                    className={cn(
                                        'w-full pl-10 pr-4 py-3 font-mono text-sm rounded-xl border transition-all duration-200 outline-none text-neutral-900',
                                        'focus:ring-2',
                                        errors.recovery_code
                                            ? 'border-error bg-error-light focus:ring-error/20'
                                            : 'border-neutral-200 bg-white focus:border-primary-600 focus:ring-primary-600/15'
                                    )}
                                />
                            </div>
                        </motion.div>
                    )}

                    <motion.div variants={fadeInUp} className="space-y-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing || (!useRecovery && data.code.length < 6) || (useRecovery && !data.recovery_code)}
                            className={cn(
                                'w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md',
                                'bg-primary-600 hover:bg-primary-700 active:scale-[0.98]',
                                'disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2'
                            )}
                        >
                            {processing && <Loader2 size={16} className="animate-spin" />}
                            <span>Verifikasi & Masuk</span>
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setUseRecovery(!useRecovery);
                                    setData({ code: '', recovery_code: '' });
                                }}
                                className="text-xs text-primary-600 hover:text-primary-800 font-medium underline-offset-4 hover:underline"
                            >
                                {useRecovery
                                    ? 'Gunakan kode autentikasi aplikasi (OTP)'
                                    : 'Kehilangan perangkat? Pakai kode pemulihan'}
                            </button>
                        </div>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}
