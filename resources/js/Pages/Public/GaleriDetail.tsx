import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, ArrowLeft, Image as ImageIcon, Eye } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Lightbox } from '@/Components/UI/Lightbox';
import { fadeInUp, staggerContainer } from '@/lib/motion';

interface AlbumDetail {
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

interface DetailProps {
    album: AlbumDetail;
    jsonLd?: Record<string, any>[];
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-galeri-detail" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-galeri-detail)" />
    </svg>
);

export default function GaleriDetail({ album, jsonLd }: DetailProps) {
    const { t } = useTranslation();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (idx: number) => {
        setCurrentIndex(idx);
        setLightboxOpen(true);
    };

    return (
        <PublicLayout jsonLd={jsonLd}>
            <Head title={`${album.title} | ${t('galeri.detail_page_title')}`} />

            {/* HERO SECTION */}
            <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-36 pb-20 overflow-hidden">
                <GeometricPattern />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.15),transparent)] pointer-events-none" />

                <div className="container mx-auto px-4 max-w-[1280px] relative z-1">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="max-w-3xl"
                    >
                        {/* Breadcrumbs */}
                        <motion.nav variants={fadeInUp} className="flex items-center space-x-2 text-sm text-white/60 mb-6" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                {t('nav.home')}
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <Link href={route('galeri')} className="hover:text-white transition-colors duration-200">
                                {t('galeri.breadcrumb')}
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <span className="text-white/90 truncate max-w-[240px]">
                                {album.title}
                            </span>
                        </motion.nav>

                        <motion.div variants={fadeInUp} className="flex items-center gap-3 text-gold-400 text-sm font-medium mb-3">
                            <ImageIcon className="w-4 h-4 text-gold-400" />
                            <span>
                                {album.photo_count} {t('galeri.detail_photos_badge')}
                            </span>
                            {album.formatted_date && (
                                <>
                                    <span className="text-white/40">•</span>
                                    <span className="flex items-center gap-1 text-white/80">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {album.formatted_date}
                                    </span>
                                </>
                            )}
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            {album.title}
                        </motion.h1>

                        {album.description && (
                            <motion.p variants={fadeInUp} className="text-white/80 text-base sm:text-lg leading-relaxed">
                                {album.description}
                            </motion.p>
                        )}
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* FOTO GRID */}
            <section className="py-16 bg-neutral-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-[1280px]">
                    <div className="mb-8">
                        <Link
                            href={route('galeri')}
                            className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            <span>{t('galeri.back_to_all')}</span>
                        </Link>
                    </div>

                    {album.photos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {album.photos.map((photo, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                    onClick={() => openLightbox(idx)}
                                    className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-200 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <img
                                        src={photo}
                                        alt={`${album.title} - ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-gold-500 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <Eye className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
                            <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-neutral-800 mb-1">
                                {t('galeri.empty_album_title')}
                            </h3>
                            <p className="text-neutral-500 text-sm">
                                {t('galeri.empty_album_desc')}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* LIGHTBOX COMPONENT */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                photos={album.photos}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
                title={album.title}
                subtitle={`${album.photo_count} ${t('galeri.photos_count')} • ${album.formatted_date ?? ''}`}
            />
        </PublicLayout>
    );
}
