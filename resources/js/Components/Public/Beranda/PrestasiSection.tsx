import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export interface PrestasiItem {
    id: number;
    slug: string;
    judul: string;
    ringkasan: string | null;
    tingkat_label: string;
    tahun: number;
    foto_url: string | null;
}

export interface PrestasiSectionProps {
    prestasiTerbaru: PrestasiItem[];
}

export function PrestasiSection({ prestasiTerbaru }: PrestasiSectionProps) {
    const { t } = useTranslation();

    if (!prestasiTerbaru || prestasiTerbaru.length === 0) return null;

    return (
        <section
            id="beranda-prestasi"
            className="py-20 lg:py-28 bg-white"
            aria-label="Prestasi Siswa Terbaru"
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
                        Prestasi & Penghargaan
                    </motion.span>
                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        Jejak Juara Generasi Unggul
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="mt-4 text-lg max-w-2xl mx-auto text-neutral-500"
                    >
                        Dedikasi, bakat, dan kerja keras peserta didik SMK Muhammadiyah Bligo yang menorehkan kebanggaan di berbagai ajang kompetisi.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {prestasiTerbaru.map((p) => (
                        <motion.div
                            key={p.id}
                            variants={fadeInUp}
                            className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <Link href={`/prestasi/${p.slug}`} className="block relative aspect-16/10 bg-neutral-100 overflow-hidden">
                                {p.foto_url ? (
                                    <img
                                        src={p.foto_url}
                                        alt={p.judul}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                                        <Trophy className="w-8 h-8 text-gold-500/60" />
                                        <span className="text-xs">Foto Prestasi</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex gap-1.5">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-600 text-white shadow-xs">
                                        {p.tingkat_label}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-xs">
                                        {p.tahun}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <Link href={`/prestasi/${p.slug}`}>
                                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                                            {p.judul}
                                        </h3>
                                    </Link>
                                    {p.ringkasan && (
                                        <p className="mt-2.5 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                                            {p.ringkasan.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                                    <Link
                                        href={`/prestasi/${p.slug}`}
                                        className="inline-flex items-center gap-1 group-hover:text-primary-700 transition-colors"
                                    >
                                        {t('beranda.prestasi_badge')}
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/prestasi"
                        className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-900 transition-colors group"
                    >
                        {t('beranda.prestasi_all')}
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

export default PrestasiSection;
