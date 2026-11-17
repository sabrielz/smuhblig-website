import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/motion';

const GeometricPattern = () => (
    <svg
        className="hidden md:block absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern
                id="geo-pattern-beranda-cta"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
            >
                <polygon
                    points="40,4 76,22 76,58 40,76 4,58 4,22"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                />
                <polygon
                    points="40,16 64,28 64,52 40,64 16,52 16,28"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-beranda-cta)" />
    </svg>
);

export interface CtaSectionProps {
    kontenCtaAkhir?: Record<string, string>;
    spmbUrl?: string;
}

export function CtaSection({ kontenCtaAkhir, spmbUrl }: CtaSectionProps) {
    return (
        <section
            id="beranda-cta"
            className="relative overflow-hidden py-28 lg:py-36 bg-gradient-to-br from-primary-900 via-primary-600 to-primary-800"
            aria-label="Call to action pendaftaran"
        >
            <GeometricPattern />

            {/* Decorative orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl z-10 pointer-events-none bg-gold-500/10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl z-10 pointer-events-none bg-primary-500/25" />

            {/* Gold top line */}
            <div className="absolute top-0 left-0 right-0 h-1 z-20 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

            <div className="relative z-20 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {/* Label */}
                    <motion.span
                        variants={fadeInUp}
                        className="inline-block font-mono text-xs tracking-[0.3em] uppercase mb-6 text-gold-500"
                    >
                        {kontenCtaAkhir?.label || '-'}
                    </motion.span>

                    {/* Headline */}
                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif font-bold text-white mb-6"
                        style={{
                            fontFamily: 'Playfair Display, Georgia, serif',
                            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                            lineHeight: '1.15',
                            letterSpacing: '-0.01em',
                        }}
                        dangerouslySetInnerHTML={{
                            __html: kontenCtaAkhir?.headline || '',
                        }}
                    />

                    {/* Subheadline */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed text-white/75"
                        dangerouslySetInnerHTML={{
                            __html: kontenCtaAkhir?.subheadline || '',
                        }}
                    />

                    {/* CTA Buttons */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {spmbUrl && (
                            <a
                                href={spmbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="cta-mulai-pendaftaran"
                                className="inline-flex items-center justify-center w-full sm:w-auto gap-3 font-semibold transition-all duration-200 px-10 py-5 text-xl rounded-2xl text-white shadow-2xl hover:shadow-gold-500/30 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-11 bg-gradient-to-br from-gold-500 to-gold-600"
                            >
                                {kontenCtaAkhir?.cta_primary || 'Mulai Pendaftaran'}
                                <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                            </a>
                        )}

                        <Link
                            href="/tentang"
                            id="cta-pelajari-lebih"
                            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 font-semibold transition-all duration-200 px-10 py-5 text-xl rounded-2xl text-white border-2 border-white/45 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-11"
                        >
                            {kontenCtaAkhir?.cta_secondary || 'Pelajari Lebih Lanjut'}
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        variants={fadeInUp}
                        className="mt-14 flex flex-wrap items-center justify-center gap-8"
                    >
                        {[
                            { value: 'Terakreditasi', label: 'Nasional' },
                            { value: 'ISO', label: 'Bersertifikat' },
                            { value: '100%', label: 'Lulusan Terserap' },
                        ].map(({ value, label }) => (
                            <div key={value} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gold-500" />
                                <span className="text-white font-semibold">{value}</span>
                                <span className="text-white/50 text-sm">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Gold bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </section>
    );
}

export default CtaSection;
