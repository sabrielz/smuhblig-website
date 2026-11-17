import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, FileDown, Search, Download, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import type { SharedProps } from '@/types';

interface UnduhanPublicItem {
    id: number;
    slug: string;
    kategori: 'brosur' | 'kalender' | 'formulir' | 'sk' | 'lainnya';
    tanggal_terbit: string | null;
    jumlah_unduh: number;
    judul: string;
    deskripsi: string | null;
    file: {
        file_name: string;
        extension: string;
        size: number;
        human_size: string;
    } | null;
    download_url: string;
}

interface Props {
    unduhanList: UnduhanPublicItem[];
}

const KATEGORI_LABELS_ID: Record<string, string> = {
    brosur: 'Brosur & Info Sekolah',
    kalender: 'Kalender Akademik',
    formulir: 'Formulir & Dokumen',
    sk: 'Surat Keputusan (SK)',
    lainnya: 'Dokumen Lainnya',
};

const KATEGORI_LABELS_EN: Record<string, string> = {
    brosur: 'Brochures & Info',
    kalender: 'Academic Calendar',
    formulir: 'Forms & Documents',
    sk: 'Official Decrees (SK)',
    lainnya: 'Other Documents',
};

const KATEGORI_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    brosur: 'primary',
    kalender: 'warning',
    formulir: 'success',
    sk: 'gold',
    lainnya: 'neutral',
};

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-unduhan" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-unduhan)" />
    </svg>
);

export default function UnduhanIndex({ unduhanList }: Props) {
    const { locale } = usePage<SharedProps>().props;
    const isEn = locale === 'en';

    const [search, setSearch] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('all');

    const kategoriLabels = isEn ? KATEGORI_LABELS_EN : KATEGORI_LABELS_ID;

    const kategoriOptions = [
        { value: 'all', label: isEn ? 'All Categories' : 'Semua Kategori' },
        { value: 'brosur', label: kategoriLabels.brosur },
        { value: 'kalender', label: kategoriLabels.kalender },
        { value: 'formulir', label: kategoriLabels.formulir },
        { value: 'sk', label: kategoriLabels.sk },
        { value: 'lainnya', label: kategoriLabels.lainnya },
    ];

    const filteredList = useMemo(() => {
        return unduhanList.filter((item) => {
            const matchKategori = selectedKategori === 'all' || item.kategori === selectedKategori;
            const matchSearch =
                !search.trim() ||
                item.judul.toLowerCase().includes(search.toLowerCase()) ||
                (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()));

            return matchKategori && matchSearch;
        });
    }, [unduhanList, selectedKategori, search]);

    return (
        <PublicLayout>
            <Head
                title={
                    isEn
                        ? 'Document Downloads | SMK Muhammadiyah Bligo'
                        : 'Unduhan Dokumen Resmi | SMK Muhammadiyah Bligo'
                }
            />

            {/* Hero Header */}
            <section className="relative bg-primary-900 text-white py-16 lg:py-24 overflow-hidden">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-white transition-colors">
                            {isEn ? 'Home' : 'Beranda'}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-white font-medium">
                            {isEn ? 'Downloads' : 'Unduhan'}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
                            <FileDown className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Official Center' : 'Pusat Berkas Resmi'}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white mb-4">
                            {isEn ? 'Document Downloads' : 'Pusat Unduhan Dokumen'}
                        </h1>
                        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                            {isEn
                                ? 'Access official documents, brochures, academic calendars, and school registration forms.'
                                : 'Unduh berkas resmi sekolah, brosur penerimaan siswa, kalender akademik, dan formulir administratif dengan mudah dan aman.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-12 lg:py-16 bg-neutral-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Controls & Filter */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs mb-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="relative lg:col-span-2">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <Input
                                    type="text"
                                    placeholder={
                                        isEn ? 'Search document title or keywords...' : 'Cari judul dokumen atau kata kunci...'
                                    }
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select
                                value={selectedKategori}
                                options={kategoriOptions}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Document List */}
                    {filteredList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 p-8">
                            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                                {isEn ? 'No documents found' : 'Tidak ada dokumen yang ditemukan'}
                            </h3>
                            <p className="text-sm text-neutral-500 max-w-md mx-auto">
                                {isEn
                                    ? 'Try resetting the category filter or searching with different keywords.'
                                    : 'Coba pilih kategori lain atau gunakan kata kunci pencarian yang berbeda.'}
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {filteredList.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    whileHover="hover"
                                    className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <Badge variant={KATEGORI_BADGE_VARIANTS[item.kategori] || 'neutral'}>
                                                {kategoriLabels[item.kategori] || item.kategori}
                                            </Badge>
                                            {item.tanggal_terbit && (
                                                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{item.tanggal_terbit}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
                                            {item.judul}
                                        </h2>

                                        {item.deskripsi && (
                                            <div
                                                className="text-xs sm:text-sm text-neutral-600 line-clamp-3 mb-4 prose-sm"
                                                dangerouslySetInnerHTML={{ __html: item.deskripsi }}
                                            />
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4 mt-2">
                                        <div className="text-xs text-neutral-500">
                                            {item.file ? (
                                                <span className="font-medium text-neutral-700">
                                                    {item.file.extension} • {item.file.human_size}
                                                </span>
                                            ) : (
                                                <span className="italic">{isEn ? 'File unavailable' : 'Berkas belum tersedia'}</span>
                                            )}
                                            <span className="mx-1.5 text-neutral-300">•</span>
                                            <span>
                                                {item.jumlah_unduh.toLocaleString('id-ID')} {isEn ? 'downloads' : 'diunduh'}
                                            </span>
                                        </div>

                                        {item.file && (
                                            <a
                                                href={item.download_url}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
                                                title={isEn ? 'Download file' : 'Unduh berkas'}
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>{isEn ? 'Download' : 'Unduh'}</span>
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
