import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight } from 'lucide-react';
import Accordion from '@/Components/UI/Accordion';
import { fadeInUp } from '@/lib/motion';

export interface FaqKontakItem {
    id: number;
    pertanyaan: string;
    jawaban: string;
}

export interface FaqSingkatSectionProps {
    faqs?: FaqKontakItem[];
}

export function FaqSingkatSection({ faqs }: FaqSingkatSectionProps) {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-20 lg:py-24 bg-white border-t border-neutral-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold uppercase tracking-wider mb-3">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>FAQ SINGKAT</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-xl mx-auto">
                        Mungkin pertanyaan Anda sudah terjawab di bawah ini sebelum mengirim pesan.
                    </p>
                </motion.div>

                <Accordion
                    items={faqs.map((f) => ({
                        id: f.id,
                        title: f.pertanyaan,
                        content: f.jawaban,
                    }))}
                />

                <div className="mt-8 text-center">
                    <Link
                        href="/faq"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                    >
                        <span>Lihat Semua FAQ Sekolah</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default FaqSingkatSection;
