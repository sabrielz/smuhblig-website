import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowLeft, Trophy, Calendar, BookOpen } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';

interface PrestasiDetail {
    id: number;
    slug: string;
    tingkat: 'sekolah' | 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';
    tingkat_label: string;
    kategori: 'akademik' | 'non_akademik';
    kategori_label: string;
    tahun: number;
    tanggal: string | null;
    jurusan?: {
        id: number;
        nama: string;
        slug: string;
    } | null;
    judul: string;
    ringkasan: string | null;
    foto_url: string | null;
}

interface Props {
    prestasi: PrestasiDetail;
    jsonLd?: Record<string, any>[];
}

const TINGKAT_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    internasional: 'gold',
    nasional: 'primary',
    provinsi: 'warning',
    kabupaten: 'success',
    sekolah: 'neutral',
};

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-prestasi-show" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-prestasi-show)" />
    </svg>
);

export default function PrestasiShow({ prestasi, jsonLd }: Props) {
    const { t } = useTranslation();

    return (
        <PublicLayout jsonLd={jsonLd}>
            <Head>
                <title>{`${prestasi.judul} - SMK Muhammadiyah Bligo`}</title>
            </Head>

            {/* Header Hero */}
            <section className="relative bg-primary-900 text-white overflow-hidden py-14 md:py-20">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gold-400 transition-colors">
                            {t('prestasi.breadcrumb_beranda')}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <Link href={route('prestasi.index')} className="hover:text-gold-400 transition-colors">
                            {t('prestasi.breadcrumb_prestasi')}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <span className="text-gold-400 font-medium truncate max-w-xs sm:max-w-md">
                            {prestasi.judul}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant={TINGKAT_BADGE_VARIANTS[prestasi.tingkat] || 'neutral'}>
                                {prestasi.tingkat_label}
                            </Badge>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-xs">
                                {prestasi.kategori_label}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                                {`${t('prestasi.tahun_prefix')} ${prestasi.tahun}`}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white leading-snug">
                            {prestasi.judul}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-16 bg-neutral-50 min-h-[50vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Body */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Foto Utama */}
                            {prestasi.foto_url && (
                                <div className="rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs aspect-16/9 bg-neutral-100">
                                    <img
                                        src={prestasi.foto_url}
                                        alt={prestasi.judul}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Deskripsi */}
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-gold-500" />
                                    {t('prestasi.detail_ringkasan_title')}
                                </h2>

                                {prestasi.ringkasan ? (
                                    <div
                                        className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: prestasi.ringkasan }}
                                    />
                                ) : (
                                    <p className="text-neutral-500 italic">
                                        {t('prestasi.detail_ringkasan_kosong')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-5">
                                <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                                    {t('prestasi.sidebar_info_title')}
                                </h3>

                                <div className="space-y-4 text-sm">
                                    <div>
                                        <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                                            {t('prestasi.sidebar_tingkat')}
                                        </span>
                                        <span className="font-semibold text-neutral-800">
                                            {prestasi.tingkat_label}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                                            {t('prestasi.sidebar_kategori')}
                                        </span>
                                        <span className="font-semibold text-neutral-800">
                                            {prestasi.kategori_label}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                                            {t('prestasi.sidebar_tahun')}
                                        </span>
                                        <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
                                            <Calendar className="w-4 h-4 text-primary-600" />
                                            <span>{prestasi.tanggal || prestasi.tahun}</span>
                                        </div>
                                    </div>

                                    {prestasi.jurusan && (
                                        <div>
                                            <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                                                {t('prestasi.sidebar_jurusan')}
                                            </span>
                                            <Link
                                                href={route('jurusan.show', { jurusan: prestasi.jurusan.slug })}
                                                className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                                            >
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>{prestasi.jurusan.nama}</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-neutral-100">
                                    <Link href={route('prestasi.index')}>
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            {t('prestasi.sidebar_semua_btn')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
