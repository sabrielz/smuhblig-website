import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { heroStagger, fadeInUp, fadeIn } from '@/lib/motion';

function HeroMeshPattern({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <path
                d="M-100,100 C300,300 700,-50 1200,150 C1400,230 1500,100 1600,200"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="1.5"
                strokeOpacity="0.3"
            />
            <path
                d="M-50,150 C350,350 750,0 1250,200 C1450,280 1550,150 1650,250"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="1"
                strokeOpacity="0.2"
            />
            <path
                d="M0,220 C400,370 800,70 1440,270"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="1"
                strokeOpacity="0.1"
            />
            <path
                d="M0,500 C500,300 900,600 1440,400"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.15"
            />
            <path
                d="M0,520 C500,320 900,620 1440,420"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.05"
            />
        </svg>
    );
}

export interface HeroSectionProps {
    kontenHero?: Record<string, string>;
    spmbUrl?: string;
}

export function HeroSection({ kontenHero, spmbUrl }: HeroSectionProps) {
    const { t } = useTranslation();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const heroImageY = useTransform(scrollY, [0, 600], [0, -120]);

    return (
        <section
            ref={heroRef}
            id="beranda-hero"
            className="relative min-h-screen flex items-center overflow-hidden"
            aria-label="Hero section"
        >
            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: heroImageY }}
            >
                <img
                    src="/smuhblig/smk.jpg"
                    alt="SMK Muhammadiyah Bligo"
                    className="w-full h-full object-cover scale-110"
                    loading="eager"
                />
            </motion.div>

            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    background:
                        'linear-gradient(to right, rgba(0,31,77,0.92) 0%, rgba(0,63,135,0.72) 55%, transparent 100%)',
                }}
            />

            {/* Dynamic Mesh Overlays - Full Size */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <HeroMeshPattern className="w-full h-full opacity-80 mix-blend-screen" />
            </div>

            {/* Hero Content */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                <motion.div
                    variants={heroStagger}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl"
                >
                    {/* Eyebrow */}
                    <motion.div variants={fadeInUp} className="mb-6">
                        <span className="font-mono text-xs tracking-[0.3em] uppercase text-gold-500">
                            {kontenHero?.eyebrow || '-'}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif font-bold text-white leading-tight mb-6"
                        style={{
                            fontFamily: 'Playfair Display, Georgia, serif',
                            fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                        }}
                        dangerouslySetInnerHTML={{
                            __html: kontenHero?.headline || '',
                        }}
                    />

                    {/* Subheadline */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg max-w-lg mb-10 leading-relaxed text-white/80"
                        dangerouslySetInnerHTML={{
                            __html: kontenHero?.subheadline || '',
                        }}
                    />

                    {/* CTA Row */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        {spmbUrl && (
                            <a
                                href={spmbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="hero-cta-daftar"
                                className="inline-flex flex-1 sm:flex-none justify-center w-full sm:w-auto items-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-8 py-4 text-lg rounded-xl text-white hover:opacity-90 focus:ring-gold-500/50 shadow-lg hover:shadow-xl min-h-11 bg-gradient-to-br from-gold-500 to-gold-600"
                            >
                                {kontenHero?.cta_primer_label || '-'}
                                <ArrowRight
                                    className="w-5 h-5"
                                    strokeWidth={1.5}
                                />
                            </a>
                        )}

                        <Link
                            href="/jurusan"
                            id="hero-cta-jurusan"
                            className="inline-flex flex-1 sm:flex-none justify-center w-full sm:w-auto items-center gap-2 font-semibold transition-all duration-200 px-8 py-4 text-lg rounded-xl text-white border-2 border-white/60 hover:bg-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50 min-h-11"
                        >
                            {kontenHero?.cta_sekunder_label || '-'}
                        </Link>
                    </motion.div>

                    {/* Gold Divider Line */}
                    <motion.div
                        variants={fadeIn}
                        className="mt-12 flex items-center gap-4"
                    >
                        <div className="h-px w-12 bg-gold-500/60" />
                        <span
                            className="text-xs text-white/40 tracking-widest uppercase"
                            dangerouslySetInnerHTML={{
                                __html: kontenHero?.footnote || '',
                            }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                aria-hidden="true"
            >
                <span className="text-white/40 text-xs tracking-widest uppercase font-mono">
                    {t('beranda.scroll')}
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                    }}
                >
                    <ChevronDown
                        className="w-6 h-6 text-white/50"
                        strokeWidth={1.5}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

export default HeroSection;
