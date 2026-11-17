import { useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

export interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    photos: string[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    title?: string;
    subtitle?: string;
}

export function Lightbox({
    isOpen,
    onClose,
    photos = [],
    currentIndex,
    onIndexChange,
    title,
    subtitle,
}: LightboxProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) return;

        previousActiveElement.current = document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
                return;
            }
            if (e.key === 'ArrowRight') {
                e.stopPropagation();
                if (photos.length > 1) {
                    onIndexChange((currentIndex + 1) % photos.length);
                }
                return;
            }
            if (e.key === 'ArrowLeft') {
                e.stopPropagation();
                if (photos.length > 1) {
                    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
                }
                return;
            }

            // Focus trap
            if (e.key === 'Tab' && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        const timer = setTimeout(() => {
            if (dialogRef.current) {
                const closeBtn = dialogRef.current.querySelector<HTMLElement>('button[aria-label="Tutup pratinjau"]');
                if (closeBtn) closeBtn.focus();
                else dialogRef.current.focus();
            }
        }, 50);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, onClose, currentIndex, photos.length, onIndexChange]);

    if (!isOpen || photos.length === 0) return null;

    const prevPhoto = () => {
        onIndexChange((currentIndex - 1 + photos.length) % photos.length);
    };

    const nextPhoto = () => {
        onIndexChange((currentIndex + 1) % photos.length);
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-8 focus:outline-none"
                onClick={onClose}
            >
                {/* Header Title */}
                {(title || subtitle) && (
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white text-left max-w-[70vw] pointer-events-none">
                        {title && (
                            <h3 id={titleId} className="font-serif text-xl sm:text-2xl font-bold drop-shadow-md">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-white/80 text-sm mt-1 drop-shadow-md">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup pratinjau"
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 sm:bg-white/10 sm:hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* Main Image */}
                <div
                    className="relative w-full h-[100dvh] sm:h-[70vh] sm:max-w-5xl flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            src={photos[currentIndex]}
                            alt={title ? `${title} - Foto ${currentIndex + 1}` : `Foto ${currentIndex + 1}`}
                            className="max-w-full max-h-[80dvh] sm:max-h-full object-contain rounded-none sm:rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.8}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 80 || info.offset.y < -80) {
                                    onClose();
                                }
                            }}
                        />
                    </AnimatePresence>

                    {/* Nav Buttons */}
                    {photos.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevPhoto}
                                aria-label="Foto sebelumnya"
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-gold-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg cursor-pointer"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={nextPhoto}
                                aria-label="Foto selanjutnya"
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-gold-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg cursor-pointer"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {photos.length > 1 && (
                    <div
                        className="absolute bottom-4 sm:bottom-6 z-10 left-1/2 -translate-x-1/2 flex gap-2 w-full max-w-3xl overflow-x-auto pb-4 px-4 snap-x no-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {photos.map((photo, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => onIndexChange(i)}
                                aria-label={`Buka foto ke-${i + 1}`}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden snap-center transition-all cursor-pointer ${
                                    currentIndex === i
                                        ? 'ring-2 ring-gold-500 opacity-100 scale-105'
                                        : 'opacity-50 hover:opacity-100'
                                }`}
                            >
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

export default Lightbox;
