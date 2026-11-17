import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TestimoniCarousel, TestimoniItem } from '@/Components/UI/TestimoniCarousel';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export interface TestimoniSectionProps {
    testimoni: TestimoniItem[];
}

export function TestimoniSection({ testimoni }: TestimoniSectionProps) {
    const { t } = useTranslation();

    if (!testimoni || testimoni.length === 0) return null;

    return (
        <section
            id="beranda-testimoni"
            className="py-20 lg:py-28 bg-neutral-50/70"
            aria-label="Kisah dan testimoni"
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
                        {t('beranda.testimoni_label')}
                    </motion.span>
                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        {t('beranda.testimoni_title')}
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="mt-4 text-lg max-w-2xl mx-auto text-neutral-500"
                    >
                        {t('beranda.testimoni_subtitle')}
                    </motion.p>
                </motion.div>

                <TestimoniCarousel items={testimoni} />
            </div>
        </section>
    );
}

export default TestimoniSection;
