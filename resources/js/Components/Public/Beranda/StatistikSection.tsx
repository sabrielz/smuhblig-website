import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import * as icons from 'lucide-react';
import { staggerContainer, scaleIn } from '@/lib/motion';

function AnimatedCounter({
    value,
    suffix = '+',
}: {
    value: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (!inView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), value);
            setCount(current);
            if (current >= value) clearInterval(timer);
        }, duration / steps);

        return () => clearInterval(timer);
    }, [inView, value]);

    return (
        <span ref={ref}>
            {count.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
}

const GeometricPattern = () => (
    <svg
        className="hidden md:block absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern
                id="geo-pattern-beranda-stat"
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
        <rect width="100%" height="100%" fill="url(#geo-pattern-beranda-stat)" />
    </svg>
);

export interface StatItemData {
    key: string;
    nilai: number;
    suffix?: string | null;
    label: string;
    icon_name?: string;
}

export interface StatistikSectionProps {
    statistik: StatItemData[];
}

export function StatistikSection({ statistik }: StatistikSectionProps) {
    if (!statistik || statistik.length === 0) return null;

    return (
        <section
            id="beranda-statistik"
            aria-label="Statistik sekolah"
            className="relative bg-primary-600"
        >
            <GeometricPattern />
            {/* Top separator */}
            <div className="relative h-16 overflow-hidden">
                <svg
                    viewBox="0 0 1440 64"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 w-full h-full fill-primary-600"
                >
                    <path d="M0,64 L0,32 Q360,0 720,32 Q1080,64 1440,32 L1440,64 Z" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pb-20">
                <div className="relative">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2 lg:gap-0 lg:divide-x lg:divide-white/10"
                    >
                        {statistik.map((stat) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const Icon = (icons as any)[stat.icon_name || 'Circle'] || icons.Circle;
                            return (
                                <motion.div
                                    key={stat.key}
                                    variants={scaleIn}
                                    className="flex flex-col items-center text-center px-6 py-8"
                                >
                                    <div className="mb-4 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                                        <Icon className="w-6 h-6 text-gold-500" strokeWidth={1.5} />
                                    </div>
                                    <div
                                        className="font-serif text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2"
                                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                                    >
                                        <AnimatedCounter value={stat.nilai} suffix={stat.suffix || '-'} />
                                    </div>
                                    <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Bottom separator */}
            <div className="relative h-16 overflow-hidden bg-neutral-50">
                <svg
                    viewBox="0 0 1440 64"
                    preserveAspectRatio="none"
                    className="absolute top-0 w-full h-full fill-primary-600"
                >
                    <path d="M0,0 L0,32 Q360,64 720,32 Q1080,0 1440,32 L1440,0 Z" />
                </svg>
            </div>
        </section>
    );
}

export default StatistikSection;
