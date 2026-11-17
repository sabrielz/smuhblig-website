import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { AlertCircle, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface UrgentAnnouncement {
    id: number;
    slug: string;
    judul: string;
}

interface AnnouncementBannerProps {
    announcement: UrgentAnnouncement | null;
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(true);

    useEffect(() => {
        if (!announcement) return;
        try {
            const isDismissed = sessionStorage.getItem(`dismissed_urgent_announcement_${announcement.id}`);
            if (!isDismissed) {
                setDismissed(false);
            }
        } catch {
            setDismissed(false);
        }
    }, [announcement]);

    if (!announcement || dismissed) {
        return null;
    }

    const handleDismiss = () => {
        setDismissed(true);
        try {
            sessionStorage.setItem(`dismissed_urgent_announcement_${announcement.id}`, 'true');
        } catch {
            // ignore sessionStorage error
        }
    };

    return (
        <aside
            aria-label={t('ui.announcement_urgent')}
            className="relative bg-red-600 text-white px-4 py-2.5 z-40 shadow-sm"
        >
            <div className="container mx-auto max-w-[1280px] flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-white text-red-700 font-bold text-[11px] uppercase tracking-wider shrink-0">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
                        Urgent
                    </span>
                    <span className="font-medium truncate">
                        {announcement.judul}
                    </span>
                    <Link
                        href={route('pengumuman.show', { pengumuman: announcement.slug })}
                        className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:text-red-100 transition-colors shrink-0 ml-1"
                    >
                        <span>{t('ui.announcement_view_detail')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <button
                    onClick={handleDismiss}
                    aria-label={t('ui.announcement_close')}
                    className="p-1 rounded hover:bg-red-700 text-white/80 hover:text-white transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </aside>
    );
}

export default AnnouncementBanner;
