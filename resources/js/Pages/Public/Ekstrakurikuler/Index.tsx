import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Activity, Search, ArrowRight, Clock, User, ImageIcon } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Input } from '@/Components/UI/Input';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import type { SharedProps } from '@/types';

interface EkskulItem {
    id: number;
    slug: string;
    nama: string;
    deskripsi: string | null;
    jadwal: string | null;
    pembina?: {
        id: number;
        nama_lengkap: string;
    } | null;
    foto_url: string | null;
}

interface Props {
    ekskulList: EkskulItem[];
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-ekskul" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-ekskul)" />
    </svg>
);

export default function EkstrakurikulerIndex({ ekskulList }: Props) {
    const { locale } = usePage<SharedProps>().props;
    const isId = locale === 'id';

    const [searchQuery, setSearchQuery] = useState('');

    const filteredList = useMemo(() => {
        return ekskulList.filter((item) => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            return (
                item.nama.toLowerCase().includes(q) ||
                (item.pembina?.nama_lengkap && item.pembina.nama_lengkap.toLowerCase().includes(q))
            );
        });
    }, [ekskulList, searchQuery]);

    return (
        <PublicLayout>
            <Head>
                <title>{isId ? 'Ekstrakurikuler - SMK Muhammadiyah Bligo' : 'Extracurricular Activities - SMK Muhammadiyah Bligo'}</title>
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
                            {isId ? 'Ekstrakurikuler' : 'Extracurricular'}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-800 text-gold-400 border border-gold-500/20 mb-4">
                            <Activity className="w-3.5 h-3.5" />
                            {isId ? 'Pengembangan Bakat & Minat' : 'Talent & Character Building'}
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                            {isId ? 'Kegiatan Ekstrakurikuler' : 'Extracurricular Activities'}
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
                            {isId
                                ? 'Wadah eksplorasi potensi kepemimpinan, kepanduan Hizbul Wathan, seni beladiri Tapak Suci, sains robotika, hingga olahraga prestasi.'
                                : 'A platform to explore leadership, Hizbul Wathan scouting, martial arts, robotics, and competitive sports for character development.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Listing Section */}
            <section className="py-12 md:py-16 bg-neutral-50 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Controls Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <p className="text-sm font-medium text-neutral-600">
                            {isId ? `Menampilkan ${filteredList.length} ekstrakurikuler aktif` : `Showing ${filteredList.length} active activities`}
                        </p>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder={isId ? 'Cari nama kegiatan atau pembina...' : 'Search activity or mentor...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 text-sm"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 p-8">
                            <Activity className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-neutral-800">
                                {isId ? 'Ekstrakurikuler tidak ditemukan' : 'No activities found'}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">
                                {isId
                                    ? 'Coba ubah kata kunci pencarian Anda.'
                                    : 'Try adjusting your search query.'}
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
                                    <Link href={route('ekstrakurikuler.show', { ekstrakurikuler: item.slug })} className="block relative aspect-16/10 bg-neutral-100 overflow-hidden">
                                        {item.foto_url ? (
                                            <img
                                                src={item.foto_url}
                                                alt={item.nama}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-xs">Foto Ekstrakurikuler</span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Info Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link href={route('ekstrakurikuler.show', { ekstrakurikuler: item.slug })}>
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

                                        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                                            {item.jadwal && (
                                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    <span className="truncate">{item.jadwal}</span>
                                                </div>
                                            )}
                                            {item.pembina?.nama_lengkap && (
                                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                                    <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    <span className="truncate">Pembina: {item.pembina.nama_lengkap}</span>
                                                </div>
                                            )}
                                            <div className="pt-2 flex items-center justify-end">
                                                <Link
                                                    href={route('ekstrakurikuler.show', { ekstrakurikuler: item.slug })}
                                                    className="inline-flex items-center gap-1 text-xs text-primary-600 font-semibold group-hover:text-primary-700 transition-colors"
                                                >
                                                    {isId ? 'Lihat Profil Lengkap' : 'View Full Details'}
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </Link>
                                            </div>
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
