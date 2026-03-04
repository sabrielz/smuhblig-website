import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import type { SharedProps } from '@/types';
import { fadeInUp, staggerContainer } from '@/lib/motion';

// Geometric Pattern for Portal
const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-portal" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="#ffffff" strokeWidth="1" />
                <path d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="5" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="0.2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="0.2" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-portal)" />
    </svg>
);

export default function Portal() {
    const { pengaturan } = usePage<SharedProps>().props;

    const features = [
        { icon: <FileText size={20} />, label: "Lihat Nilai & Rapor" },
        { icon: <CheckCircle2 size={20} />, label: "Informasi Absensi" },
        { icon: <Calendar size={20} />, label: "Kalender Akademik" },
    ];

    return (
        <div className="min-h-screen bg-[#001f4d] relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-[#c9a84c] selection:text-[#001f4d]">
            <Head title={`Portal Siswa - ${pengaturan.site_name}`} />

            {/* Background elements */}
            <GeometricPattern />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#003f87]/40 via-[#001f4d]/80 to-[#111111]/90" />

            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#003f87] rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c9a84c] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center"
                >
                    {/* Animated Icon */}
                    <motion.div
                        variants={fadeInUp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: [0, -10, 0],
                        }}
                        transition={{
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a38533] p-1 flex items-center justify-center mb-8 shadow-2xl shadow-[#c9a84c]/20"
                    >
                        <div className="w-full h-full rounded-full bg-[#001f4d] flex items-center justify-center border-4 border-[#c9a84c]/30">
                            <ShieldCheck size={48} strokeWidth={1.5} className="text-[#c9a84c]" />
                        </div>
                    </motion.div>

                    {/* Texts */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-4"
                    >
                        SEGERA HADIR
                    </motion.p>

                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                    >
                        Portal Siswa
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-white/70 max-w-lg mx-auto mb-10 leading-relaxed"
                    >
                        Akses nilai, absensi, dan informasi akademik dalam satu platform terintegrasi.
                    </motion.p>

                    {/* Feature Previews (Disabled state) */}
                    <motion.div
                        variants={fadeInUp}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mx-auto mb-12"
                    >
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm grayscale opacity-60 transition-all hover:opacity-100 hover:grayscale-0 hover:border-white/20"
                            >
                                <div className="text-white/60 mb-3 bg-white/5 p-3 rounded-xl">
                                    {feature.icon}
                                </div>
                                <span className="text-sm font-medium text-white/80 text-center">
                                    {feature.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Button */}
                    <motion.div variants={fadeInUp}>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 group shadow-lg"
                        >
                            <ArrowLeft size={18} className="text-white/70 group-hover:text-white transition-colors group-hover:-translate-x-1 duration-300 transform" />
                            Kembali ke Beranda
                        </Link>
                    </motion.div>

                    {/* Footer text */}
                    <motion.p
                        variants={fadeInUp}
                        className="mt-16 text-xs text-white/40 max-w-sm mx-auto"
                    >
                        Fitur ini sedang dalam pengembangan. Pantau terus informasi terbaru terkait akses Portal Siswa.
                    </motion.p>
                </motion.div>
            </div>

            {/* Very bottom border line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#003f87] via-[#c9a84c] to-[#003f87]" />
        </div>
    );
}
