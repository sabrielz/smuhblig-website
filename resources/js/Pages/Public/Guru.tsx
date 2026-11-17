import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, GraduationCap, Briefcase, BookOpen, Search } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface GuruItem {
    id: number;
    nama: string;
    nama_lengkap: string;
    kelompok: 'guru' | 'tendik';
    jurusan_id: number | null;
    jurusan?: {
        id: number;
        nama: string;
        slug: string;
    } | null;
    jabatan: string;
    mapel: string | null;
    foto_url: string | null;
}

interface JurusanFilter {
    id: number;
    nama: string;
    slug: string;
}

interface Props {
    guruList: GuruItem[];
    jurusans: JurusanFilter[];
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-guru" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-guru)" />
    </svg>
);

export default function GuruPublik({ guruList, jurusans }: Props) {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<'semua' | 'guru' | 'tendik'>('semua');
    const [selectedJurusan, setSelectedJurusan] = useState<string>('semua');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredList = useMemo(() => {
        return guruList.filter((item) => {
            // Filter tab kelompok
            if (activeTab !== 'semua' && item.kelompok !== activeTab) {
                return false;
            }

            // Filter jurusan
            if (selectedJurusan !== 'semua') {
                if (String(item.jurusan_id) !== selectedJurusan) {
                    return false;
                }
            }

            // Filter keyword pencarian
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchNama = item.nama_lengkap.toLowerCase().includes(q);
                const matchJabatan = item.jabatan.toLowerCase().includes(q);
                const matchMapel = item.mapel ? item.mapel.toLowerCase().includes(q) : false;
                if (!matchNama && !matchJabatan && !matchMapel) {
                    return false;
                }
            }

            return true;
        });
    }, [guruList, activeTab, selectedJurusan, searchQuery]);

    const titleText = t('guru.title');
    const subtitleText = t('guru.subtitle');

    return (
        <PublicLayout>
            <Head title={`${titleText} | SMK Muhammadiyah Bligo`} />

            {/* Hero Section */}
            <section className="relative bg-primary-900 overflow-hidden min-h-[320px] flex items-center">
                <GeometricPattern />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 lg:py-28">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs md:text-sm text-primary-200 mb-4">
                        <Link href="/" className="hover:text-white transition-colors">
                            {t('nav.home')}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-white font-medium">{titleText}</span>
                    </div>

                    <h1 className="text-display-lg md:text-display-xl font-bold text-white mb-4">
                        {titleText}
                    </h1>
                    <p className="text-base md:text-lg text-primary-100 max-w-2xl">
                        {subtitleText}
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-8 bg-neutral-50 border-b border-neutral-200 sticky top-16 z-30 shadow-xs backdrop-blur-md bg-neutral-50/90">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tab Kelompok */}
                        <div className="flex bg-neutral-200/80 p-1 rounded-xl w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab('semua')}
                                className={cn(
                                    'px-4 py-2 text-sm font-semibold rounded-lg transition-all',
                                    activeTab === 'semua'
                                        ? 'bg-white text-primary-600 shadow-xs'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                {t('guru.tab_all')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('guru')}
                                className={cn(
                                    'px-4 py-2 text-sm font-semibold rounded-lg transition-all',
                                    activeTab === 'guru'
                                        ? 'bg-white text-primary-600 shadow-xs'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                {t('guru.tab_guru')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('tendik')}
                                className={cn(
                                    'px-4 py-2 text-sm font-semibold rounded-lg transition-all',
                                    activeTab === 'tendik'
                                        ? 'bg-white text-primary-600 shadow-xs'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                {t('guru.tab_tendik')}
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder={t('guru.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white"
                            />
                        </div>
                    </div>

                    {/* Filter Jurusan (Chips) */}
                    {activeTab !== 'tendik' && jurusans.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap mr-1">
                                {t('guru.program_label')}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedJurusan('semua')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-full font-medium transition-colors whitespace-nowrap',
                                    selectedJurusan === 'semua'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                                )}
                            >
                                {t('guru.all_programs')}
                            </button>
                            {jurusans.map((j) => (
                                <button
                                    key={j.id}
                                    type="button"
                                    onClick={() => setSelectedJurusan(String(j.id))}
                                    className={cn(
                                        'px-3 py-1 text-xs rounded-full font-medium transition-colors whitespace-nowrap',
                                        selectedJurusan === String(j.id)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                                    )}
                                >
                                    {j.nama}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Directory Grid */}
            <section className="py-16 bg-white min-h-[500px]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {filteredList.length === 0 ? (
                        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                            <GraduationCap className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-neutral-900">
                                {t('guru.not_found')}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                                {t('pencarian.not_found_desc', { keyword: searchQuery })}
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {filteredList.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                                        {item.foto_url ? (
                                            <img
                                                src={item.foto_url}
                                                alt={item.nama_lengkap}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 bg-gradient-to-b from-neutral-100 to-neutral-200">
                                                <GraduationCap className="w-16 h-16 stroke-1 mb-2 opacity-60" />
                                                <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
                                                    {item.kelompok === 'guru' ? t('guru.label_guru') : t('guru.label_tendik')}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute top-3 right-3">
                                            <Badge
                                                variant={item.kelompok === 'guru' ? 'primary' : 'neutral'}
                                                size="sm"
                                                className="shadow-xs backdrop-blur-xs"
                                            >
                                                {item.kelompok === 'guru' ? t('guru.label_guru') : t('guru.label_tendik')}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Info Details */}
                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                        <div>
                                            <h3 className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                {item.nama_lengkap}
                                            </h3>

                                            <p className="text-sm font-medium text-primary-600 mt-1 flex items-center gap-1.5">
                                                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span>{item.jabatan}</span>
                                            </p>

                                            {item.mapel && (
                                                <p className="text-xs text-neutral-500 mt-1 flex items-start gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                    <span>{item.mapel}</span>
                                                </p>
                                            )}
                                        </div>

                                        {item.jurusan && (
                                            <div className="pt-2 border-t border-neutral-100">
                                                <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                                                    {item.jurusan.nama}
                                                </span>
                                            </div>
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
