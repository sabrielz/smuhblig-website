import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Trophy, Search, ArrowRight, Calendar, ImageIcon } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import type { SharedProps } from '@/types';

interface PrestasiItem {
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
    prestasiList: PrestasiItem[];
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
            <pattern id="geo-pattern-prestasi" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-prestasi)" />
    </svg>
);

export default function PrestasiIndex({ prestasiList }: Props) {
    const { locale } = usePage<SharedProps>().props;
    const isId = locale === 'id';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTingkat, setSelectedTingkat] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('');
    const [selectedTahun, setSelectedTahun] = useState('');

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(prestasiList.map((p) => p.tahun)));
        return uniqueYears.sort((a, b) => b - a);
    }, [prestasiList]);

    const filteredList = useMemo(() => {
        return prestasiList.filter((item) => {
            const matchesTingkat = !selectedTingkat || item.tingkat === selectedTingkat;
            const matchesKategori = !selectedKategori || item.kategori === selectedKategori;
            const matchesTahun = !selectedTahun || item.tahun.toString() === selectedTahun;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                item.judul.toLowerCase().includes(q) ||
                (item.jurusan?.nama && item.jurusan.nama.toLowerCase().includes(q));

            return matchesTingkat && matchesKategori && matchesTahun && matchesSearch;
        });
    }, [prestasiList, selectedTingkat, selectedKategori, selectedTahun, searchQuery]);

    const tingkatOptions = [
        { value: '', label: isId ? 'Semua Tingkat' : 'All Levels' },
        { value: 'internasional', label: isId ? 'Tingkat Internasional' : 'International' },
        { value: 'nasional', label: isId ? 'Tingkat Nasional' : 'National' },
        { value: 'provinsi', label: isId ? 'Tingkat Provinsi' : 'Provincial' },
        { value: 'kabupaten', label: isId ? 'Tingkat Kabupaten/Kota' : 'Regency/City' },
        { value: 'sekolah', label: isId ? 'Tingkat Sekolah' : 'School Level' },
    ];

    const kategoriOptions = [
        { value: '', label: isId ? 'Semua Kategori' : 'All Categories' },
        { value: 'akademik', label: isId ? 'Akademik' : 'Academic' },
        { value: 'non_akademik', label: isId ? 'Non-Akademik' : 'Non-Academic' },
    ];

    const tahunOptions = [
        { value: '', label: isId ? 'Semua Tahun' : 'All Years' },
        ...years.map((y) => ({ value: y.toString(), label: y.toString() })),
    ];

    return (
        <PublicLayout>
            <Head>
                <title>{isId ? 'Prestasi & Kejuaraan - SMK Muhammadiyah Bligo' : 'Achievements & Honors - SMK Muhammadiyah Bligo'}</title>
            </Head>

            {/* Hero Section */}
            <section className="relative bg-primary-900 text-white overflow-hidden py-16 md:py-24">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gold-400 transition-colors">
                            {isId ? 'Beranda' : 'Home'}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <span className="text-gold-400 font-medium">
                            {isId ? 'Prestasi' : 'Achievements'}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-800 text-gold-400 border border-gold-500/20 mb-4">
                            <Trophy className="w-3.5 h-3.5" />
                            {isId ? 'Tradisi Juara & Berprestasi' : 'Excellence & Honors'}
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                            {isId ? 'Prestasi & Penghargaan' : 'Student Achievements'}
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
                            {isId
                                ? 'Bukti nyata dedikasi dan keunggulan kompetensi siswa SMK Muhammadiyah Bligo dalam berbagai kompetisi akademik, teknologi, kejuruan, dan seni olahraga.'
                                : 'A testament to the dedication and vocational excellence of our students across academic, technological, and athletic competitions.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Listing Section */}
            <section className="py-12 md:py-16 bg-neutral-50 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter Bar */}
                    <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs mb-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <Input
                                    placeholder={isId ? 'Cari judul prestasi...' : 'Search achievement...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 text-sm"
                                />
                            </div>

                            <Select
                                value={selectedTingkat}
                                options={tingkatOptions}
                                onChange={(e) => setSelectedTingkat(e.target.value)}
                            />

                            <Select
                                value={selectedKategori}
                                options={kategoriOptions}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                            />

                            <Select
                                value={selectedTahun}
                                options={tahunOptions}
                                onChange={(e) => setSelectedTahun(e.target.value)}
                            />
                        </div>

                        {(searchQuery || selectedTingkat || selectedKategori || selectedTahun) && (
                            <div className="flex justify-end pt-2 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedTingkat('');
                                        setSelectedKategori('');
                                        setSelectedTahun('');
                                    }}
                                    className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                                >
                                    {isId ? 'Reset Semua Filter' : 'Reset All Filters'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Grid */}
                    {filteredList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 p-8">
                            <Trophy className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-neutral-800">
                                {isId ? 'Prestasi tidak ditemukan' : 'No achievements found'}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">
                                {isId
                                    ? 'Coba ubah kata kunci atau kombinasi filter Anda.'
                                    : 'Try adjusting your search keywords or filter criteria.'}
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
                                    <Link href={route('prestasi.show', { prestasi: item.slug })} className="block relative aspect-16/10 bg-neutral-100 overflow-hidden">
                                        {item.foto_url ? (
                                            <img
                                                src={item.foto_url}
                                                alt={item.judul}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                                                <Trophy className="w-8 h-8 text-gold-500/60" />
                                                <span className="text-xs">Foto Prestasi</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex gap-1.5">
                                            <Badge variant={TINGKAT_BADGE_VARIANTS[item.tingkat] || 'neutral'}>
                                                {item.tingkat_label}
                                            </Badge>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-xs">
                                                {item.tahun}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Info Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link href={route('prestasi.show', { prestasi: item.slug })}>
                                                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                                                    {item.judul}
                                                </h3>
                                            </Link>
                                            {item.ringkasan && (
                                                <p className="mt-2 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                                                    {item.ringkasan.replace(/<[^>]*>?/gm, '')}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>{item.tanggal || `Tahun ${item.tahun}`}</span>
                                            </div>
                                            <Link
                                                href={route('prestasi.show', { prestasi: item.slug })}
                                                className="inline-flex items-center gap-1 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors"
                                            >
                                                {isId ? 'Detail' : 'Details'}
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
