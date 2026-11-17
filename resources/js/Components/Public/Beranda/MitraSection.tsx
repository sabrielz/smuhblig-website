import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MitraStrip, MitraItem } from '@/Components/UI/MitraStrip';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export interface MitraSectionProps {
    mitraIndustri: MitraItem[];
}

export function MitraSection({ mitraIndustri }: MitraSectionProps) {
    const { t } = useTranslation();

    if (!mitraIndustri || mitraIndustri.length === 0) return null;

    return (
        <section
            id="beranda-mitra"
            className="py-16 lg:py-24 bg-white"
            aria-label="Mitra industri dan kerjasama"
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
                        {t('beranda.mitra_label')}
                    </motion.span>
                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        {t('beranda.mitra_title')}
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="mt-4 text-lg max-w-2xl mx-auto text-neutral-500"
                    >
                        {t('beranda.mitra_subtitle')}
                    </motion.p>
                </motion.div>

                <MitraStrip items={mitraIndustri} />
            </div>
        </section>
    );
}

export default MitraSection;
