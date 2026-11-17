import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { JurusanCard } from '@/Components/UI/JurusanCard';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export interface JurusanItem {
    kode: string;
    slug: string;
    nama: string;
    tagline: string;
    deskripsi: string;
    color_start: string;
    color_end: string;
    icon_name: string;
}

export interface JurusanSectionProps {
    jurusan: JurusanItem[];
    kontenJurusan?: Record<string, string>;
}

export function JurusanSection({ jurusan, kontenJurusan }: JurusanSectionProps) {
    return (
        <section
            id="beranda-jurusan"
            className="py-20 lg:py-28 bg-neutral-50"
            aria-label="Program keahlian"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-16"
                >
                    <motion.span
                        variants={fadeInUp}
                        className="inline-block font-mono text-xs tracking-[0.3em] uppercase mb-4 text-primary-600"
                    >
                        {kontenJurusan?.label || '-'}
                    </motion.span>
                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        {kontenJurusan?.headline || '-'}
                    </motion.h2>
                    {kontenJurusan?.subheadline && (
                        <motion.p
                            variants={fadeInUp}
                            className="mt-4 text-lg max-w-2xl mx-auto text-neutral-500"
                        >
                            {kontenJurusan.subheadline}
                        </motion.p>
                    )}
                </motion.div>

                {/* Grid 3+2 layout */}
                {jurusan.length > 0 ? (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {/* Row 1: max 3 cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {jurusan.slice(0, 3).map((j) => (
                                <motion.div key={j.kode} variants={fadeInUp}>
                                    <JurusanCard jurusan={j} className="h-64 lg:h-72" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Row 2: remaining cards centered */}
                        {jurusan.length > 3 && (
                            <div className="flex justify-center">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-2/3">
                                    {jurusan.slice(3).map((j) => (
                                        <motion.div key={j.kode} variants={fadeInUp}>
                                            <JurusanCard jurusan={j} className="h-64 lg:h-72" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-neutral-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Jurusan belum tersedia.</p>
                    </div>
                )}

                {/* CTA link Semua Jurusan */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/jurusan"
                        id="jurusan-lihat-semua"
                        className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-900 transition-colors group"
                    >
                        Lihat Semua Program Keahlian
                        <ArrowRight
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
                            strokeWidth={1.5}
                        />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default JurusanSection;
