import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight, Info, AlertTriangle, AlertCircle, ArrowLeft } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { formatDate } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import type { SharedProps } from '@/types';

interface PengumumanDetail {
    id: number;
    slug: string;
    tipe: 'info' | 'penting' | 'urgent';
    judul: string;
    konten: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    created_at: string;
}

interface ShowProps {
    pengumuman: PengumumanDetail;
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-pengumuman-detail" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-pengumuman-detail)" />
    </svg>
);

export default function PengumumanShow({ pengumuman }: ShowProps) {
    const { locale } = usePage<SharedProps>().props;

    const getBadgeVariant = (tipe: string): 'info' | 'warning' | 'danger' => {
        if (tipe === 'urgent') return 'danger';
        if (tipe === 'penting') return 'warning';
        return 'info';
    };

    const getTipeIcon = (tipe: string) => {
        if (tipe === 'urgent') return <AlertCircle className="w-4 h-4 mr-1.5" />;
        if (tipe === 'penting') return <AlertTriangle className="w-4 h-4 mr-1.5" />;
        return <Info className="w-4 h-4 mr-1.5" />;
    };

    const getTanggalRentang = () => {
        if (!pengumuman.tanggal_mulai && !pengumuman.tanggal_selesai) return null;
        if (pengumuman.tanggal_mulai && !pengumuman.tanggal_selesai) {
            return `${locale === 'id' ? 'Berlaku mulai: ' : 'Effective from: '} ${formatDate(pengumuman.tanggal_mulai, locale as 'id' | 'en')}`;
        }
        if (!pengumuman.tanggal_mulai && pengumuman.tanggal_selesai) {
            return `${locale === 'id' ? 'Berlaku hingga: ' : 'Valid until: '} ${formatDate(pengumuman.tanggal_selesai, locale as 'id' | 'en')}`;
        }
        return `${formatDate(pengumuman.tanggal_mulai!, locale as 'id' | 'en')} - ${formatDate(pengumuman.tanggal_selesai!, locale as 'id' | 'en')}`;
    };

    return (
        <PublicLayout>
            <Head title={`${pengumuman.judul} | ${locale === 'id' ? 'Pengumuman' : 'Announcement'}`} />

            {/* HERO SECTION */}
            <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-36 pb-20 overflow-hidden">
                <GeometricPattern />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.15),transparent)] pointer-events-none" />

                <div className="container mx-auto px-4 max-w-[1000px] relative z-1">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Breadcrumbs */}
                        <motion.nav variants={fadeInUp} className="flex items-center space-x-2 text-sm text-white/60 mb-6" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                {locale === 'id' ? 'Beranda' : 'Home'}
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <Link href={route('pengumuman.index')} className="hover:text-white transition-colors duration-200">
                                {locale === 'id' ? 'Pengumuman' : 'Announcements'}
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <span className="text-white/90 truncate max-w-[240px]">
                                {pengumuman.judul}
                            </span>
                        </motion.nav>

                        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge variant={getBadgeVariant(pengumuman.tipe)} size="md">
                                {getTipeIcon(pengumuman.tipe)}
                                <span className="uppercase tracking-wider font-semibold">
                                    {pengumuman.tipe}
                                </span>
                            </Badge>

                            {getTanggalRentang() && (
                                <div className="flex items-center text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Calendar className="w-4 h-4 mr-1.5 text-gold-400" />
                                    <span>{getTanggalRentang()}</span>
                                </div>
                            )}
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            {pengumuman.judul}
                        </motion.h1>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* CONTENT DETAIL */}
            <div className="pt-12 pb-24 bg-neutral-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-[1000px]">
                    <div className="mb-6">
                        <Link
                            href={route('pengumuman.index')}
                            className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            <span>{locale === 'id' ? 'Kembali ke Semua Pengumuman' : 'Back to All Announcements'}</span>
                        </Link>
                    </div>

                    <article className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-neutral-200">
                        {/* Divider Gold */}
                        <div className="w-16 h-1 bg-gold-500 mb-8 rounded-full" />

                        {/* Konten HTML */}
                        <div
                            className="prose prose-base sm:prose-lg max-w-none prose-headings:font-serif prose-headings:text-neutral-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 focus:outline-none leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: pengumuman.konten || '' }}
                        />

                        {/* Footer Pengumuman */}
                        <div className="mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-neutral-400 gap-2">
                            <span>
                                {locale === 'id' ? 'Dipublikasikan oleh Sekretariat SMK Muhammadiyah Bligo' : 'Published by Secretariat of SMK Muhammadiyah Bligo'}
                            </span>
                            {pengumuman.created_at && (
                                <span>
                                    {locale === 'id' ? 'Dibuat pada: ' : 'Posted on: '} {formatDate(pengumuman.created_at, locale as 'id' | 'en')}
                                </span>
                            )}
                        </div>
                    </article>
                </div>
            </div>
        </PublicLayout>
    );
}
