import React from 'react';
import { Head } from '@inertiajs/react';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
// We don't import framer-motion here to keep it highly robust and independent
// We don't import Layouts to prevent cascading failures if layout dependencies fail

export default function Error500({ status }: { status: number }) {
    // 500 should be robust. Inline styles for fallback if tailwind fails to load
    return (
        <>
            <Head title="500 Terjadi Kesalahan — SMK Muhammadiyah Bligo" />

            <div
                className="min-h-screen flex items-center justify-center p-6 sm:p-8 relative overflow-hidden"
                style={{ backgroundColor: '#001f4d', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
                {/* Soft Bubble Pattern Overlay */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div
                        style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px', borderRadius: '50%', opacity: 0.2, pointerEvents: 'none', background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', filter: 'blur(80px)' }}
                    />
                    <div
                        style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', maxWidth: '800px', maxHeight: '800px', borderRadius: '50%', opacity: 0.3, pointerEvents: 'none', background: 'radial-gradient(circle, #0050a8 0%, transparent 70%)', filter: 'blur(100px)' }}
                    />
                    <div
                        style={{ position: 'absolute', top: '20%', right: '10%', width: '40vw', height: '40vw', maxWidth: '500px', maxHeight: '500px', borderRadius: '50%', opacity: 0.1, pointerEvents: 'none', background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)', filter: 'blur(60px)' }}
                    />
                </div>

                <div className="w-full max-w-2xl mx-auto text-center relative z-10" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <style>
                        {`
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}
                    </style>

                    <div className="flex flex-col items-center">
                        <div
                            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <ServerCrash size={64} color="white" strokeWidth={1.5} />
                        </div>

                        <h1
                            className="text-white font-bold mb-4 tracking-tight"
                            style={{
                                fontFamily: 'Playfair Display, Georgia, serif',
                                fontSize: 'clamp(2rem, 5vw, 3rem)'
                            }}
                        >
                            Terjadi Kesalahan
                        </h1>

                        <p
                            className="text-lg md:text-xl mb-12 max-w-lg mx-auto"
                            style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}
                        >
                            Server kami sedang mengalami gangguan. Tim teknis sudah diberitahu. Silakan coba beberapa saat lagi.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 px-8 py-4 rounded-xl text-white shadow-lg w-full sm:w-auto hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #a8821f 100%)' }}
                            >
                                <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
                                Muat Ulang Halaman
                            </button>

                            <a
                                href="/"
                                className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 px-8 py-4 rounded-xl text-white border-2 hover:bg-white/10 w-full sm:w-auto"
                                style={{ borderColor: 'rgba(255,255,255,0.4)' }}
                            >
                                <Home className="w-5 h-5" strokeWidth={1.5} />
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
