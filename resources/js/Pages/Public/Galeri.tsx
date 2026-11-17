import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Eye } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Lightbox } from '@/Components/UI/Lightbox';
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

interface GaleriProps {
    pengaturan: Pengaturan;
    galleries: GalleryItem[];
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
    <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-dark to-primary-900" />
        <GeometricPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-20">
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
                <motion.nav variants={fadeInUp} className="flex items-center space-x-2 text-sm text-white/60 mb-8" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-white transition-colors duration-200">
                        Beranda
                    </Link>
                    <ChevronRight size={14} className="text-white/40" />
                    <span className="text-white/90">Galeri</span>
                </motion.nav>

                <motion.p
                    variants={fadeInUp}
                    className="text-white/80 text-lg leading-relaxed max-w-2xl font-light"
                >
                    Merekam jejak langkah prestasi, keceriaan, dan dedikasi seluruh civitas akademika SMK Muhammadiyah Bligo.
                </motion.p>
            </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
);

// Main Content
const GaleriSection = ({ galleries }: { galleries: GalleryItem[] }) => {
    return (
        <section className="py-20 lg:py-28 bg-white min-h-[50vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {galleries.length === 0 ? (
                    <div className="text-center text-neutral-500 py-16">
                        Belum ada album galeri.
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
                                className="break-inside-avoid relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <Link href={route('galeri.show', { galeri: album.slug })} className="block">
                                    <img
                                        src={album.thumbnail_url}
                                        alt={album.title}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    {/* Overlay hover */}
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

                                        {/* Center Icon */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                            <Eye size={20} className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default function Galeri({ pengaturan, galleries }: GaleriProps) {
    return (
        <PublicLayout>
            <PageHero />
            <GaleriSection galleries={galleries} />
        </PublicLayout>
    );
}
