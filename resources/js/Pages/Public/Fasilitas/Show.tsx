import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, Building2, ImageIcon, Maximize2 } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Lightbox } from '@/Components/UI/Lightbox';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import type { SharedProps } from '@/types';

interface FasilitasPhoto {
    id: number;
    url: string;
    thumb_url: string;
    file_name: string;
}

interface FasilitasDetail {
    id: number;
    slug: string;
    kategori: 'ruang_praktik' | 'umum' | 'olahraga' | 'ibadah';
    nama: string;
    deskripsi: string | null;
    photos: FasilitasPhoto[];
}

interface Props {
    fasilitas: FasilitasDetail;
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
            <pattern id="geo-pattern-show" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-show)" />
    </svg>
);

export default function FasilitasShow({ fasilitas }: Props) {
    const { locale } = usePage<SharedProps>().props;
    const isId = locale === 'id';

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const photoUrls = fasilitas.photos.map((p) => p.url);

    const handleOpenLightbox = (index: number) => {
        setCurrentPhotoIndex(index);
        setLightboxOpen(true);
    };

    return (
        <PublicLayout>
            <Head>
                <title>{`${fasilitas.nama} - SMK Muhammadiyah Bligo`}</title>
            </Head>

            {/* Header Hero */}
            <section className="relative bg-primary-900 text-white overflow-hidden py-14 md:py-20">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gold-400 transition-colors">
                            {isId ? 'Beranda' : 'Home'}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <Link href={route('fasilitas.index')} className="hover:text-gold-400 transition-colors">
                            {isId ? 'Fasilitas' : 'Facilities'}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                        <span className="text-gold-400 font-medium truncate max-w-xs sm:max-w-md">
                            {fasilitas.nama}
                        </span>
                    </nav>

                    <div className="max-w-3xl">
                        <div className="mb-3">
                            <Badge variant={KATEGORI_BADGE_VARIANTS[fasilitas.kategori] || 'neutral'}>
                                {KATEGORI_LABELS[fasilitas.kategori]?.[locale === 'en' ? 'en' : 'id'] || fasilitas.kategori}
                            </Badge>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                            {fasilitas.nama}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content & Photos */}
            <section className="py-12 md:py-16 bg-neutral-50 min-h-[50vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Deskripsi & Detail */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <h2 className="text-xl font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary-600" />
                                    {isId ? 'Informasi Fasilitas' : 'Facility Details'}
                                </h2>

                                {fasilitas.deskripsi ? (
                                    <div
                                        className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: fasilitas.deskripsi }}
                                    />
                                ) : (
                                    <p className="text-neutral-500 italic">
                                        {isId
                                            ? 'Belum ada penjelasan detail untuk fasilitas ini.'
                                            : 'No detailed description available for this facility yet.'}
                                    </p>
                                )}
                            </div>

                            {/* Galeri Dokumentasi Foto */}
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
                                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-primary-600" />
                                        {isId ? 'Dokumentasi Foto' : 'Photo Gallery'}
                                    </h2>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                                        {fasilitas.photos.length} {isId ? 'Foto' : 'Photos'}
                                    </span>
                                </div>

                                {fasilitas.photos.length === 0 ? (
                                    <div className="text-center py-12 text-neutral-400 flex flex-col items-center gap-2">
                                        <ImageIcon className="w-10 h-10 stroke-1" />
                                        <p className="text-sm">
                                            {isId ? 'Belum ada foto yang diunggah.' : 'No photos uploaded yet.'}
                                        </p>
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                    >
                                        {fasilitas.photos.map((photo, index) => (
                                            <motion.div
                                                key={photo.id}
                                                variants={fadeInUp}
                                                onClick={() => handleOpenLightbox(index)}
                                                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 cursor-pointer border border-neutral-200 shadow-xs"
                                            >
                                                <img
                                                    src={photo.thumb_url || photo.url}
                                                    alt={photo.file_name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Maximize2 className="w-6 h-6 drop-shadow-sm" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
                                <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                                    {isId ? 'Ringkasan Fasilitas' : 'Facility Summary'}
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                                            {isId ? 'Kategori' : 'Category'}
                                        </span>
                                        <span className="font-semibold text-neutral-800">
                                            {KATEGORI_LABELS[fasilitas.kategori]?.[locale === 'en' ? 'en' : 'id'] || fasilitas.kategori}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                                            {isId ? 'Jumlah Foto' : 'Total Photos'}
                                        </span>
                                        <span className="font-semibold text-neutral-800">
                                            {fasilitas.photos.length} {isId ? 'Dokumentasi' : 'Images'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-100">
                                    <Link href={route('fasilitas.index')}>
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            {isId ? 'Kembali ke Daftar Fasilitas' : 'Back to Facilities'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                photos={photoUrls}
                currentIndex={currentPhotoIndex}
                onIndexChange={setCurrentPhotoIndex}
                title={fasilitas.nama}
                subtitle={`${currentPhotoIndex + 1} dari ${photoUrls.length}`}
            />
        </PublicLayout>
    );
}
