import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fadeInUp } from '@/lib/motion';

interface JurusanGalleryProps {
    images: string[];
}

export default function JurusanGallery({ images }: JurusanGalleryProps) {
    const { t } = useTranslation();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }
    }, [lightboxOpen]);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, images.length]);

    if (!images || images.length === 0) return null;

    return (
        <>
            <section className="py-20 bg-neutral-50 border-t border-gray-200">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-gold-500 uppercase mb-4 block">
                            {t('jurusan.gallery_badge')}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary-900">
                            {t('jurusan.gallery_heading')}
                        </h2>
                    </motion.div>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {images.map((src, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-zoom-in"
                                onClick={() => openLightbox(idx)}
                            >
                                <img src={src} alt={`Galeri ${idx + 1}`} className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIGHTBOX PORTAL */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
                        onClick={closeLightbox}
                    >
                        <div className="flex justify-between items-center p-4 lg:p-6 select-none shrink-0 text-white/50">
                            <div className="font-mono text-sm tracking-widest">{currentImageIndex + 1} / {images.length}</div>
                            <button onClick={closeLightbox} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors" aria-label="Tutup pratinjau foto">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 relative flex items-center justify-center">
                            <button
                                onClick={prevImage}
                                className="absolute left-2 lg:left-8 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors z-10 hidden sm:block"
                                aria-label="Foto sebelumnya"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>

                            <img
                                src={images[currentImageIndex]}
                                alt="Gallery Preview"
                                className="max-w-[95%] max-h-full object-contain mx-auto"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                onClick={nextImage}
                                className="absolute right-2 lg:right-8 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors z-10 hidden sm:block"
                                aria-label="Foto selanjutnya"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="p-4 shrink-0 text-center text-white/30 text-xs sm:hidden">
                            Geser layar atau tap sisi layar untuk navigasi // Tekan X untuk tutup
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
