import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye, X, ChevronLeft } from 'lucide-react';
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
    <section className="relative bg-[#001f4d] overflow-hidden min-h-[360px] flex items-center">
        <GeometricPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003f87]/60 via-transparent to-[#001f4d]" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-3xl"
            >
                <motion.p
                    variants={fadeInUp}
                    className="text-xs font-bold tracking-[0.25em] uppercase text-[#c9a84c] mb-4"
                >
                    GALERI KAMI
                </motion.p>
                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                >
                    Momen &amp; Kegiatan <span className="text-[#c9a84c]">Berkesan</span>
                </motion.h1>
                <motion.nav
                    variants={fadeInUp}
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-white/60"
                >
                    <a href="/" className="hover:text-white transition-colors duration-200">
                        Beranda
                    </a>
                    <ChevronRight size={14} className="text-white/40" />
                    <span className="text-white/90">Galeri</span>
                </motion.nav>
            </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
);

// Grid Album + Modal
const GaleriSection = ({ galleries }: { galleries: GalleryItem[] }) => {
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryItem | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const openModal = (album: GalleryItem) => {
        setSelectedAlbum(album);
        setCurrentPhotoIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedAlbum(null);
        document.body.style.overflow = 'auto';
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedAlbum) {
            setCurrentPhotoIndex((prev) => (prev + 1) % selectedAlbum.photos.length);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedAlbum) {
            setCurrentPhotoIndex((prev) => (prev - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length);
        }
    };

    return (
        <section className="py-20 lg:py-28 bg-white min-h-[50vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {galleries.length === 0 ? (
                    <div className="text-center text-[#636366] py-16">
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
                                className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                                onClick={() => openModal(album)}
                            >
                                <img
                                    src={album.thumbnail_url}
                                    alt={album.title}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Overlay hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#001f4d]/90 via-[#001f4d]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-wider">
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
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#c9a84c] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                        <Eye size={20} className="text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedAlbum && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-8"
                        onClick={closeModal}
                    >
                        {/* Header Title */}
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white text-left max-w-[70vw] pointer-events-none">
                            <h3 className="font-serif text-xl sm:text-2xl font-bold drop-shadow-md">{selectedAlbum.title}</h3>
                            <p className="text-white/80 text-sm mt-1 drop-shadow-md">{selectedAlbum.photo_count} Foto • {selectedAlbum.formatted_date}</p>
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 sm:bg-white/10 sm:hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>

                        {/* Main Image */}
                        <div className="relative w-full h-[100dvh] sm:h-[70vh] sm:max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentPhotoIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    src={selectedAlbum.photos[currentPhotoIndex]}
                                    alt={`${selectedAlbum.title} - ${currentPhotoIndex + 1}`}
                                    className="max-w-full max-h-[80dvh] sm:max-h-full object-contain rounded-none sm:rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
                                    drag="y"
                                    dragConstraints={{ top: 0, bottom: 0 }}
                                    dragElastic={0.8}
                                    onDragEnd={(e, info) => {
                                        if (info.offset.y > 80 || info.offset.y < -80) {
                                            closeModal();
                                        }
                                    }}
                                />
                            </AnimatePresence>

                            {/* Nav Buttons */}
                            {selectedAlbum.photos.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prevPhoto}
                                        className="absolute left-[-20px] sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-[#c9a84c] text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextPhoto}
                                        className="absolute right-[-20px] sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-[#c9a84c] text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-4 sm:bottom-6 z-10 left-1/2 -translate-x-1/2 flex gap-2 w-full max-w-3xl overflow-x-auto pb-4 px-4 snap-x hide-scrollbar" onClick={(e) => e.stopPropagation()}>
                            {selectedAlbum.photos.map((photo, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setCurrentPhotoIndex(i)}
                                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden snap-center transition-all ${
                                        currentPhotoIndex === i ? 'ring-2 ring-[#c9a84c] opacity-100 scale-105' : 'opacity-50 hover:opacity-100'
                                    }`}
                                >
                                    <img src={photo} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <style>{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .hide-scrollbar {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default function Galeri({ pengaturan, galleries }: GaleriProps) {
    const { locale } = usePage<SharedProps>().props;

    return (
        <PublicLayout>
            <PageHero />
            <GaleriSection galleries={galleries} />
        </PublicLayout>
    );
}
