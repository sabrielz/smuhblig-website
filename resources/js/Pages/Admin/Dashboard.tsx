import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut } from 'lucide-react';

import { fadeInUp, staggerContainer } from '@/lib/motion';
import type { SharedProps } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-[#f8f9fa]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Top Bar */}
            <header className="bg-white border-b border-[#e5e5ea] sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#003f87' }}
                        >
                            <LayoutDashboard size={16} strokeWidth={1.5} className="text-white" />
                        </div>
                        <span className="font-semibold text-sm" style={{ color: '#111111' }}>
                            CMS Admin
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold" style={{ color: '#111111' }}>
                                {user?.name}
                            </p>
                            <p className="text-xs capitalize" style={{ color: '#636366' }}>
                                {user?.role ?? '—'}
                            </p>
                        </div>
                        <img
                            src={user?.avatar_url}
                            alt={user?.name ?? 'User'}
                            className="w-9 h-9 rounded-full border-2 border-[#e5e5ea] object-cover"
                        />
                        <a
                            href={route('logout')}
                            onClick={(e) => {
                                e.preventDefault();
                                const form = document.createElement('form');
                                form.method = 'POST';
                                form.action = route('logout');
                                const csrfInput = document.createElement('input');
                                csrfInput.type = 'hidden';
                                csrfInput.name = '_token';
                                csrfInput.value = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
                                form.appendChild(csrfInput);
                                document.body.appendChild(form);
                                form.submit();
                            }}
                            className="p-2 rounded-lg transition-colors duration-150 hover:bg-[#f2f2f7]"
                            title="Keluar"
                            aria-label="Keluar dari akun"
                        >
                            <LogOut size={18} strokeWidth={1.5} style={{ color: '#636366' }} />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Welcome Hero */}
                    <motion.div
                        variants={fadeInUp}
                        className="rounded-2xl p-8 sm:p-12 relative overflow-hidden"
                        style={{ backgroundColor: '#001f4d' }}
                    >
                        {/* Decorative gradient */}
                        <div
                            className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
                                transform: 'translate(30%, -30%)',
                            }}
                        />
                        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                            Panel Administrasi
                        </p>
                        <h1
                            className="text-white text-3xl sm:text-4xl font-bold mb-3"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.01em' }}
                        >
                            Selamat datang, {user?.name?.split(' ')[0] ?? 'Admin'}!
                        </h1>
                        <p className="text-white/60 text-sm max-w-lg">
                            Dashboard CMS SMK Muhammadiyah Bligo. Kelola konten, artikel, galeri, dan pengumuman sekolah dari sini.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
                            <span className="text-white/70 text-xs">
                                Login berhasil · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </motion.div>

                    {/* Under Construction Notice */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white rounded-2xl border border-[#e5e5ea] p-8 text-center"
                    >
                        <div
                            className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                            style={{ backgroundColor: '#eef5fc' }}
                        >
                            <LayoutDashboard size={28} strokeWidth={1.5} style={{ color: '#003f87' }} />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#111111' }}>
                            Dashboard Sedang Dipersiapkan
                        </h2>
                        <p className="text-sm max-w-md mx-auto" style={{ color: '#636366' }}>
                            Halaman dashboard lengkap dengan statistik, artikel terbaru, dan widget lainnya akan segera tersedia. Autentikasi berhasil dikonfigurasi!
                        </p>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
