import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { InfoDanPeta } from '@/Components/Public/Kontak/InfoDanPeta';
import { TautanSection } from '@/Components/Public/Kontak/TautanSection';
import { FormKontak } from '@/Components/Public/Kontak/FormKontak';
import { FaqSingkatSection, FaqKontakItem } from '@/Components/Public/Kontak/FaqSingkatSection';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import type { Pengaturan, Tautan } from '@/types';

interface KontakProps {
    pengaturan: Pengaturan;
    tautan: Tautan[];
    kontenInfo?: Record<string, string>;
    faqUmum?: FaqKontakItem[];
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-kontak" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-kontak)" />
    </svg>
);

const FallbackTautan: Tautan[] = [
    { id: 1, label: 'Pendaftaran Online', url: 'https://spmb.smkmuhbligo.sch.id/', deskripsi: 'Penerimaan Peserta Didik Baru', icon_name: 'Globe', kategori: null, is_active: true, buka_tab_baru: true },
    { id: 2, label: 'LMS', url: 'https://lms.smkmuhbligo.sch.id/', deskripsi: 'Platform pembelajaran digital sekolah', icon_name: 'ExternalLink', kategori: null, is_active: true, buka_tab_baru: true },
    { id: 3, label: 'Portal', url: 'https://portal.smkmuhbligo.sch.id/', deskripsi: 'Akses nilai, absensi, dan informasi akademik', icon_name: 'Link', kategori: null, is_active: true, buka_tab_baru: true },
];

export default function Kontak({ pengaturan, tautan, kontenInfo, faqUmum }: KontakProps) {
    const { t } = useTranslation();
    const displayTautan = tautan && tautan.length > 0 ? tautan : FallbackTautan;

    return (
        <PublicLayout>
            <Head>
                <title>Kontak — SMK Muhammadiyah Bligo</title>
            </Head>

            {/* Page Hero */}
            <section className="relative bg-primary-900 overflow-hidden min-h-[360px] flex items-center">
                <GeometricPattern />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl"
                    >
                        <motion.p
                            variants={fadeInUp}
                            className="text-xs font-bold tracking-[0.25em] uppercase text-gold-500 mb-4"
                        >
                            {t('kontak.eyebrow')}
                        </motion.p>
                        <motion.h1
                            variants={fadeInUp}
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                        >
                            {t('kontak.hero_headline_1')}{' '}
                            <span className="text-gold-500">{t('kontak.hero_headline_2')}</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-white/70 leading-relaxed max-w-2xl"
                        >
                            {t('kontak.hero_subheadline')}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Info Dan Peta */}
            <InfoDanPeta pengaturan={pengaturan} kontenInfo={kontenInfo} />

            {/* Tautan Penting */}
            <TautanSection tautan={displayTautan} />

            {/* FAQ Singkat Sebelum Form */}
            <FaqSingkatSection faqs={faqUmum} />

            {/* Form Kontak */}
            <FormKontak />
        </PublicLayout>
    );
}
