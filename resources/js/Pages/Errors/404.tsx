import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { SearchX, Home, Newspaper } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/motion';

function BubbleBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', filter: 'blur(80px)' }}
            />
            <div
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #0050a8 0%, transparent 70%)', filter: 'blur(100px)' }}
            />
            <div
                className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)', filter: 'blur(60px)' }}
            />
        </div>
    );
}

export default function Error404({ status }: { status: number }) {
    return (
        <PublicLayout>
            <Head title="404 Halaman Tidak Ditemukan — SMK Muhammadiyah Bligo" />

            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#001f4d]">
                {/* Soft Bubble Pattern Overlay */}
                <BubbleBackground />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="relative flex flex-col items-center justify-center"
                    >
                        {/* Background Text "404" */}
                        <motion.div
                            variants={scaleIn}
                            className="absolute z-0 font-serif font-bold select-none text-[#c9a84c] opacity-15"
                            style={{
                                fontFamily: 'Playfair Display, Georgia, serif',
                                fontSize: 'clamp(100px, 20vw, 180px)',
                                lineHeight: 1
                            }}
                        >
                            404
                        </motion.div>

                        {/* Foreground Content */}
                        <motion.div variants={fadeInUp} className="relative z-10 flex flex-col items-center mt-10 md:mt-20">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                <SearchX className="w-10 h-10 text-white" strokeWidth={1.5} />
                            </div>

                            <h1 className="font-serif text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                                Halaman Tidak Ditemukan
                            </h1>

                            <p className="text-lg md:text-xl text-white/70 max-w-lg mb-12">
                                Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 px-8 py-4 rounded-xl text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50 hover:shadow-xl hover:opacity-90 w-full sm:w-auto"
                                    style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #a8821f 100%)' }}
                                >
                                    <Home className="w-5 h-5" strokeWidth={1.5} />
                                    Kembali ke Beranda
                                </Link>

                                <Link
                                    href="/berita"
                                    className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 px-8 py-4 rounded-xl text-white border-2 border-white/40 hover:bg-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto"
                                >
                                    <Newspaper className="w-5 h-5" strokeWidth={1.5} />
                                    Lihat Berita Terbaru
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
