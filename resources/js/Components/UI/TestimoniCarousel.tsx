import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/Components/UI/Badge';

export interface TestimoniItem {
    id: number;
    nama: string;
    peran: 'alumni' | 'orang_tua' | 'mitra';
    keterangan: string;
    kutipan: string;
    foto_url: string | null;
}

interface Props {
    items: TestimoniItem[];
    isEn?: boolean;
}

const PERAN_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    alumni: 'primary',
    orang_tua: 'gold',
    mitra: 'success',
};

export function TestimoniCarousel({ items }: Props) {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        // Cek prefers-reduced-motion untuk autoplay
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let interval: ReturnType<typeof setInterval> | null = null;

        if (!prefersReducedMotion && items && items.length > 1) {
            interval = setInterval(() => {
                emblaApi.scrollNext();
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [emblaApi, onSelect, items]);

    if (!items || items.length === 0) return null;

    return (
        <div className="relative">
            {/* Carousel Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4 sm:-ml-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 sm:pl-6 min-w-0"
                        >
                            <div className="h-full bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <Badge variant={PERAN_BADGE_VARIANTS[item.peran] || 'neutral'}>
                                            {t(`ui.peran.${item.peran}`, { defaultValue: item.peran })}
                                        </Badge>
                                        <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                            <Quote className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <p className="text-neutral-700 text-sm sm:text-base italic leading-relaxed mb-6">
                                        "{item.kutipan}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3.5 pt-4 border-t border-neutral-100">
                                    {item.foto_url ? (
                                        <img
                                            src={item.foto_url}
                                            alt={item.nama}
                                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-neutral-200"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs shrink-0">
                                            {item.nama.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-neutral-900 truncate">
                                            {item.nama}
                                        </h4>
                                        <p className="text-xs text-neutral-500 truncate">
                                            {item.keterangan}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            {items.length > 1 && (
                <div className="flex items-center justify-between pt-6 mt-4">
                    <div className="flex items-center gap-1.5">
                        {items.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-label={`Pergi ke testimoni slide ${idx + 1}`}
                                onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    selectedIndex === idx
                                        ? 'w-6 bg-primary-600'
                                        : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label="Testimoni Sebelumnya"
                            className="w-9 h-9 rounded-full border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label="Testimoni Berikutnya"
                            className="w-9 h-9 rounded-full border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestimoniCarousel;
