import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, Search, ArrowRight, ImageIcon } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface FasilitasItem {
    id: number;
    slug: string;
    kategori: 'ruang_praktik' | 'umum' | 'olahraga' | 'ibadah';
    nama: string;
    deskripsi: string | null;
    cover_url: string | null;
    foto_count: number;
}

interface Props {
    fasilitas: FasilitasItem[];
}

const KATEGORI_LABELS: Record<string, { id: string; en: string }> = {
    ruang_praktik: { id: 'Ruang Praktik & Bengkel', en: 'Workshops & Labs' },
    umum: { id: 'Fasilitas Umum', en: 'General Facilities' },
    olahraga: { id: 'Sarana Olahraga', en: 'Sports Facilities' },
    ibadah: { id: 'Sarana Ibadah', en: 'Worship Facilities' },
};

const KATEGORI_BADGE_VARIANTS: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
    ruang_praktik: 'primary',
    umum: 'neutral',
    olahraga: 'warning',
    ibadah: 'success',
};

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-fasilitas" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-fasilitas)" />
    </svg>
);

export default function FasilitasIndex({ fasilitas }: Props) {
    const { t, i18n } = useTranslation();
    const currentLocale = (i18n.language || 'id') as 'id' | 'en';

    const [activeKategori, setActiveKategori] = useState<string>('semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredList = useMemo(() => {
        return fasilitas.filter((item) => {
            const matchesKategori = activeKategori === 'semua' || item.kategori === activeKategori;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || item.nama.toLowerCase().includes(q);
            return matchesKategori && matchesSearch;
        });
    }, [fasilitas, activeKategori, searchQuery]);

    const categories = [
        { key: 'semua', labelKey: 'fasilitas.cat_all' },
        { key: 'ruang_praktik', labelKey: 'fasilitas.cat_ruang_praktik' },
        { key: 'umum', labelKey: 'fasilitas.cat_umum' },
        { key: 'olahraga', labelKey: 'fasilitas.cat_olahraga' },
        { key: 'ibadah', labelKey: 'fasilitas.cat_ibadah' },
    ];

    return (
        <PublicLayout>
            <Head>
                <title>{t('fasilitas.page_title')} - SMK Muhammadiyah Bligo</title>
            </Head>

            {/* Hero Section */}
            <section className="relative bg-primary-900 text-white overflow-hidden py-16 md:py-24">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gold-400 transition-colors">
                            {t('nav.home')}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <span className="text-gold-400 font-medium">
                            {t('fasilitas.breadcrumb')}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-800 text-gold-400 border border-gold-500/20 mb-4">
                            <Building2 className="w-3.5 h-3.5" />
                            {t('fasilitas.eyebrow')}
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                            {t('fasilitas.headline')}
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
                            {currentLocale === 'en'
                                ? 'Equipped with industry-standard infrastructure and comprehensive facilities to cultivate high-performing vocational students.'
                                : 'Didukung dengan sarana prasarana standar industri dan fasilitas lengkap untuk kenyamanan dan keunggulan kompetensi seluruh peserta didik.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter & Listing Section */}
            <section className="py-12 md:py-16 bg-neutral-50 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Controls Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                        {/* Kategori Tabs */}
                        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => setActiveKategori(cat.key)}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer',
                                        activeKategori === cat.key
                                            ? 'bg-primary-600 text-white shadow-xs'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                                    )}
                                >
                                    {t(cat.labelKey)}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder={t('fasilitas.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 text-sm"
                            />
                        </div>
                    </div>

                    {/* Fasilitas Grid */}
                    {filteredList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 p-8">
                            <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-neutral-800">
                                {t('fasilitas.not_found')}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">
                                {t('pencarian.not_found_desc', { keyword: searchQuery })}
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredList.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    whileHover={cardHover}
                                    className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col group transition-shadow hover:shadow-md"
                                >
                                    {/* Cover Image */}
                                    <Link href={route('fasilitas.show', { fasilitas: item.slug })} className="block relative aspect-16/10 bg-neutral-100 overflow-hidden">
                                        {item.cover_url ? (
                                            <img
                                                src={item.cover_url}
                                                alt={item.nama}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-xs">Foto Fasilitas</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <Badge variant={KATEGORI_BADGE_VARIANTS[item.kategori] || 'neutral'}>
                                                {KATEGORI_LABELS[item.kategori]?.[currentLocale] || item.kategori}
                                            </Badge>
                                        </div>
                                        {item.foto_count > 0 && (
                                            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                                                <ImageIcon className="w-3 h-3" />
                                                {item.foto_count} {t('galeri.photos_count')}
                                            </div>
                                        )}
                                    </Link>

                                    {/* Info Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link href={route('fasilitas.show', { fasilitas: item.slug })}>
                                                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                                    {item.nama}
                                                </h3>
                                            </Link>
                                            {item.deskripsi && (
                                                <p className="mt-2 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                                                    {item.deskripsi.replace(/<[^>]*>?/gm, '')}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                                            <Link
                                                href={route('fasilitas.show', { fasilitas: item.slug })}
                                                className="inline-flex items-center gap-1 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors"
                                            >
                                                {t('fasilitas.view_detail')}
                                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </div>
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
