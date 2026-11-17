import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowLeft, Activity, Clock, User, ImageIcon } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/UI/Button';

interface EkskulDetail {
    id: number;
    slug: string;
    nama: string;
    deskripsi: string | null;
    jadwal: string | null;
    pembina?: {
        id: number;
        nama_lengkap: string;
        jabatan?: string | null;
        foto_url?: string | null;
    } | null;
    foto_url: string | null;
}

interface Props {
    ekskul: EkskulDetail;
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-ekskul-show" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-ekskul-show)" />
    </svg>
);

export default function EkstrakurikulerShow({ ekskul }: Props) {
    const { t, i18n } = useTranslation();
    const currentLocale = (i18n.language || 'id') as 'id' | 'en';

    return (
        <PublicLayout>
            <Head>
                <title>{`${ekskul.nama} - SMK Muhammadiyah Bligo`}</title>
            </Head>

            {/* Header Hero */}
            <section className="relative bg-primary-900 text-white overflow-hidden py-14 md:py-20">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gold-400 transition-colors">
                            {t('nav.home')}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <Link href={route('ekstrakurikuler.index')} className="hover:text-gold-400 transition-colors">
                            {t('ekskul.breadcrumb')}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <span className="text-gold-400 font-medium truncate max-w-xs sm:max-w-md">
                            {ekskul.nama}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-800 text-gold-400 border border-gold-500/20 mb-3">
                            <Activity className="w-3.5 h-3.5" />
                            {t('ekskul.detail_eyebrow')}
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                            {ekskul.nama}
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
                            {ekskul.foto_url && (
                                <div className="rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs aspect-16/9 bg-neutral-100">
                                    <img
                                        src={ekskul.foto_url}
                                        alt={ekskul.nama}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Deskripsi */}
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary-600" />
                                    {t('ekskul.about_title')}
                                </h2>

                                {ekskul.deskripsi ? (
                                    <div
                                        className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: ekskul.deskripsi }}
                                    />
                                ) : (
                                    <p className="text-neutral-500 italic">
                                        {currentLocale === 'en'
                                            ? 'No detailed description available yet.'
                                            : 'Belum ada penjelasan detail untuk kegiatan ini.'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Card Jadwal & Pembina */}
                            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-5">
                                <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                                    {t('ekskul.info_title')}
                                </h3>

                                {/* Jadwal */}
                                <div>
                                    <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1.5">
                                        {t('ekskul.schedule_label')}
                                    </span>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                                        <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                                        <span>{ekskul.jadwal || t('ekskul.schedule_flexible')}</span>
                                    </div>
                                </div>

                                {/* Pembina */}
                                <div className="pt-2 border-t border-neutral-100">
                                    <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-2">
                                        {t('ekskul.mentor_label')}
                                    </span>
                                    {ekskul.pembina ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                                                {ekskul.pembina.foto_url ? (
                                                    <img
                                                        src={ekskul.pembina.foto_url}
                                                        alt={ekskul.pembina.nama_lengkap}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6 text-neutral-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-neutral-900 text-sm">
                                                    {ekskul.pembina.nama_lengkap}
                                                </div>
                                                {ekskul.pembina.jabatan && (
                                                    <div className="text-xs text-neutral-500">
                                                        {ekskul.pembina.jabatan}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-neutral-500 italic">
                                            {t('ekskul.mentor_unassigned')}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-neutral-100">
                                    <Link href={route('ekstrakurikuler.index')}>
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            {t('ekskul.back_to_all')}
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
