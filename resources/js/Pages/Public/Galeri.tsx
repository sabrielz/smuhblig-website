import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Eye, Play, ImageIcon, Video as VideoIcon, ExternalLink } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedProps, Pengaturan } from '@/types';
import {
    fadeInUp,
    staggerContainer,
} from '@/lib/motion';

// Types
interface GalleryItem {
    id: number;
    slug: string;
    title: string;
    description: string;
    event_date: string | null;
    formatted_date: string | null;
    photo_count: number;
    thumbnail_url: string;
    photos: string[];
}

interface VideoPublicItem {
    id: number;
    youtube_id: string;
    thumbnail_url: string;
    watch_url: string;
    judul: string;
    galeri_id: number | null;
    galeri_title: string | null;
}

interface GaleriProps {
    pengaturan: Pengaturan;
    galleries: GalleryItem[];
    videos?: VideoPublicItem[];
}

// Geometric Pattern
const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-galeri" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-galeri)" />
    </svg>
);

// Page Hero
const PageHero = () => (
    <section className="relative min-h-[45vh] flex flex-col justify-center overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-dark to-primary-900" />
        <GeometricPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16">
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="max-w-3xl"
            >
                <motion.div variants={fadeInUp} className="flex items-center space-x-2 text-gold-500 text-sm font-semibold mb-4 tracking-wider uppercase">
                    <span>Dokumentasi</span>
                    <span className="w-8 h-[1px] bg-gold-500" />
                    <span>Kegiatan</span>
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6"
                >
                    Galeri <span className="text-gold-500 italic">Sekolah</span>
                </motion.h1>

                {/* Breadcrumbs */}
                <motion.nav variants={fadeInUp} className="flex items-center space-x-2 text-sm text-white/60 mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-white transition-colors duration-200">
                        Beranda
                    </Link>
                    <ChevronRight size={14} className="text-white/40" />
                    <span className="text-white/90">Galeri</span>
                </motion.nav>

                <motion.p
                    variants={fadeInUp}
                    className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl font-light"
                >
                    Merekam jejak langkah prestasi, keceriaan, dan dedikasi seluruh civitas akademika SMK Muhammadiyah Bligo melalui foto dan video dokumentasi.
                </motion.p>
            </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
);

export default function Galeri({ galleries, videos = [] }: GaleriProps) {
    const [activeTab, setActiveTab] = useState<'foto' | 'video'>('foto');

    return (
        <PublicLayout>
            <PageHero />

            {/* Tab Navigation */}
            <section className="py-8 bg-white border-b border-neutral-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-center">
                    <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80">
                        <button
                            type="button"
                            onClick={() => setActiveTab('foto')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === 'foto'
                                    ? 'bg-white text-primary-900 shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            <span>Album Foto ({galleries.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('video')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === 'video'
                                    ? 'bg-white text-primary-900 shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        >
                            <VideoIcon className="w-4 h-4 text-red-600" />
                            <span>Galeri Video ({videos.length})</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="py-16 lg:py-24 bg-white min-h-[50vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {activeTab === 'foto' ? (
                        /* Album Foto */
                        galleries.length === 0 ? (
                            <div className="text-center text-neutral-500 py-16">
                                Belum ada album galeri foto yang dipublikasikan.
                            </div>
                        ) : (
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                {galleries.map((album, i) => (
                                    <motion.div
                                        key={album.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="break-inside-avoid relative rounded-2xl overflow-hidden group shadow-xs hover:shadow-xl transition-all duration-300"
                                    >
                                        <Link href={route('galeri.show', { galeri: album.slug })} className="block">
                                            <img
                                                src={album.thumbnail_url}
                                                alt={album.title}
                                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
                                                            {album.formatted_date || 'Tanpa Tanggal'}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs text-white/80 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                            <Eye size={12} />
                                                            {album.photo_count} Foto
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-serif text-lg font-bold leading-tight">
                                                        {album.title}
                                                    </h3>
                                                </div>

                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                                    <Eye size={20} className="text-white" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    ) : (
                        /* Galeri Video YouTube (ADR-006 Opsi a: Thumbnail i.ytimg.com + Tautan Resmi YouTube) */
                        videos.length === 0 ? (
                            <div className="text-center text-neutral-500 py-16">
                                Belum ada video yang dipublikasikan.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {videos.map((vid, i) => (
                                    <motion.div
                                        key={vid.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* Thumbnail YouTube */}
                                            <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                                                <img
                                                    src={vid.thumbnail_url}
                                                    alt={vid.judul}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                                                    </div>
                                                </div>
                                                {vid.galeri_title && (
                                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                                                        {vid.galeri_title}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-bold text-neutral-900 text-base sm:text-lg leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                                                    {vid.judul}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="p-5 pt-0">
                                            <a
                                                href={vid.watch_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 text-xs font-semibold transition-colors"
                                            >
                                                <span>Tonton di YouTube</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
