import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { AnnouncementBanner, UrgentAnnouncement } from '@/Components/UI/AnnouncementBanner';
import { HeroSection } from '@/Components/Public/Beranda/HeroSection';
import { StatistikSection, StatItemData } from '@/Components/Public/Beranda/StatistikSection';
import { JurusanSection, JurusanItem } from '@/Components/Public/Beranda/JurusanSection';
import { PrestasiSection, PrestasiItem } from '@/Components/Public/Beranda/PrestasiSection';
import { BeritaSection, ArticleItem } from '@/Components/Public/Beranda/BeritaSection';
import { TestimoniSection } from '@/Components/Public/Beranda/TestimoniSection';
import { MitraSection } from '@/Components/Public/Beranda/MitraSection';
import { CtaSection } from '@/Components/Public/Beranda/CtaSection';
import type { TestimoniItem } from '@/Components/UI/TestimoniCarousel';
import type { MitraItem } from '@/Components/UI/MitraStrip';
import type { SharedProps } from '@/types';

function SectionDivider() {
    return (
        <div className="relative flex items-center justify-center py-0">
            <div className="absolute inset-x-0 top-1/2 border-t border-gold-500/20" />
            <div className="relative z-10 bg-inherit px-3">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-gold-500/40"
                >
                    <path
                        d="M8 0L9.5 5.5H16L10.8 8.9L12.7 14.5L8 11.1L3.3 14.5L5.2 8.9L0 5.5H6.5L8 0Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </div>
    );
}

export interface BerandaProps {
    jurusan?: JurusanItem[];
    prestasiTerbaru?: PrestasiItem[];
    beritaTerbaru?: ArticleItem[];
    testimoni?: TestimoniItem[];
    mitraIndustri?: MitraItem[];
    statistik?: StatItemData[];
    kontenHero?: Record<string, string>;
    kontenStatistik?: Record<string, string>;
    kontenJurusan?: Record<string, string>;
    kontenBerita?: Record<string, string>;
    kontenCtaAkhir?: Record<string, string>;
    pengumumanUrgent?: UrgentAnnouncement | null;
}

export default function Beranda({
    jurusan = [],
    prestasiTerbaru = [],
    beritaTerbaru = [],
    testimoni = [],
    mitraIndustri = [],
    statistik = [],
    kontenHero = {},
    kontenJurusan = {},
    kontenBerita = {},
    kontenCtaAkhir = {},
    pengumumanUrgent = null,
}: BerandaProps) {
    const { pengaturan } = usePage<SharedProps>().props;

    return (
        <PublicLayout>
            <Head>
                <title>Beranda — SMK Muhammadiyah Bligo</title>
                <link rel="preload" as="image" href="/smuhblig/smk.jpg" fetchPriority="high" />
            </Head>

            <AnnouncementBanner announcement={pengumumanUrgent} />

            {/* SECTION 1 — HERO */}
            <HeroSection kontenHero={kontenHero} spmbUrl={pengaturan?.spmb_url} />

            {/* SECTION 2 — STATISTIK */}
            <StatistikSection statistik={statistik} />

            {/* SECTION 3 — JURUSAN */}
            <JurusanSection jurusan={jurusan} kontenJurusan={kontenJurusan} />

            {/* SECTION PRESTASI TERBARU */}
            {prestasiTerbaru.length > 0 && (
                <>
                    <SectionDivider />
                    <PrestasiSection prestasiTerbaru={prestasiTerbaru} />
                </>
            )}

            <SectionDivider />

            {/* SECTION 4 — BERITA TERBARU */}
            <BeritaSection beritaTerbaru={beritaTerbaru} kontenBerita={kontenBerita} />

            {/* SECTION — TESTIMONI */}
            {testimoni.length > 0 && (
                <>
                    <SectionDivider />
                    <TestimoniSection testimoni={testimoni} />
                </>
            )}

            {/* SECTION — MITRA INDUSTRI */}
            {mitraIndustri.length > 0 && (
                <>
                    <SectionDivider />
                    <MitraSection mitraIndustri={mitraIndustri} />
                </>
            )}

            {/* SECTION 5 — CTA AKHIR */}
            <CtaSection kontenCtaAkhir={kontenCtaAkhir} spmbUrl={pengaturan?.spmb_url} />
        </PublicLayout>
    );
}
