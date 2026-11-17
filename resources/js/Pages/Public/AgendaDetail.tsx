import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, MapPin, ArrowLeft, Download } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { format, parseISO, isSameDay } from 'date-fns';
import { id as idLocale, enUS as enLocale } from 'date-fns/locale';

interface AgendaDetailProps {
    agenda: any;
    jsonLd?: Record<string, any>[];
}

// ---------------------------------------------------------------------------
// Geometric Pattern SVG (Islamic-inspired, very subtle)
// ---------------------------------------------------------------------------
const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-tentang" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-tentang)" />
    </svg>
);

const PageHero = ({ title }: { title: string }) => {
    const { t } = useTranslation();
    return (
        <section className="relative bg-primary-900 overflow-hidden min-h-[360px] flex items-center">
            <GeometricPattern />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-4xl mx-auto text-center flex flex-col items-center mt-6"
                >
                    <motion.p
                        variants={fadeInUp}
                        className="text-xs font-bold tracking-[0.25em] uppercase text-gold-500 mb-4"
                    >
                        {t('agenda.hero_subtitle')}
                    </motion.p>
                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-tight mb-6"
                    >
                        {t('agenda.detail_hero_1')} <span className="text-gold-500">{t('agenda.detail_hero_2')}</span>
                    </motion.h1>
                    <motion.nav
                        variants={fadeInUp}
                        aria-label="Breadcrumb"
                        className="flex items-center justify-center gap-2 text-sm text-white/60 mb-8"
                    >
                        <Link href="/" className="hover:text-white transition-colors duration-200">
                            {t('nav.home')}
                        </Link>
                        <ChevronRight size={14} className="text-white/40" />
                        <Link href={route('agenda.index')} className="hover:text-white transition-colors duration-200">
                            {t('agenda.breadcrumb')}
                        </Link>
                        <ChevronRight size={14} className="text-white/40" />
                        <span className="text-white/90 truncate max-w-[200px]" title={title}>
                            {title}
                        </span>
                    </motion.nav>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
};

export default function AgendaDetail({ agenda, jsonLd }: AgendaDetailProps) {
    const { t, i18n } = useTranslation();
    const currentLocale = (i18n.language || 'id') as 'id' | 'en';
    const dateFnsLocale = currentLocale === 'en' ? enLocale : idLocale;
    const data = agenda.data || agenda; // From API Resource

    const translation = currentLocale === 'en' && data.translations?.en
        ? data.translations.en
        : data.translations?.id || {};

    const startDate = parseISO(data.tanggal_mulai);
    const endDate = data.tanggal_selesai ? parseISO(data.tanggal_selesai) : null;
    const isSingleDay = !endDate || isSameDay(startDate, endDate);

    return (
        <PublicLayout jsonLd={jsonLd}>
            <PageHero title={translation.judul || data.judul_id} />

            <section className="bg-neutral-50 pb-20 min-h-screen z-2">
                <div className="container mx-auto px-4 max-w-4xl -mt-[100px] relative z-10">
                    <Link
                        href={route('agenda.index')}
                        className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-6 transition-colors shadow-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm w-fit"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('agenda.back_to_all')}
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-xl shadow-neutral-200/50"
                    >
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Date Block */}
                            <div className="flex-shrink-0 md:w-32">
                                <div
                                    className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center text-white shadow-inner relative overflow-hidden"
                                    style={{ backgroundColor: data.warna }}
                                >
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <span className="relative text-4xl sm:text-5xl font-bold leading-none mb-2">
                                        {format(startDate, 'd')}
                                    </span>
                                    <span className="relative text-sm font-medium uppercase tracking-widest opacity-90">
                                        {format(startDate, 'MMM', { locale: dateFnsLocale })}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <span
                                    className="inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider mb-4"
                                    style={{
                                        backgroundColor: `${data.warna}15`,
                                        color: data.warna
                                    }}
                                >
                                    {data.tipe}
                                </span>

                                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6 font-serif leading-tight">
                                    {translation.judul || data.judul_id}
                                </h1>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    <div className="flex gap-3 text-neutral-600">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-500">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{t('agenda.time_label')}</p>
                                            <p className="text-sm font-medium text-neutral-800">
                                                {format(startDate, 'EEEE, d MMMM yyyy', { locale: dateFnsLocale })}
                                                {!isSingleDay && endDate && (
                                                    <>
                                                        <span className="mx-2 text-neutral-400">-</span>
                                                        <br className="sm:hidden" />
                                                        {format(endDate, 'EEEE, d MMMM yyyy', { locale: dateFnsLocale })}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {translation.lokasi && (
                                        <div className="flex gap-3 text-neutral-600">
                                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-500">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{t('agenda.location')}</p>
                                                <p className="text-sm font-medium text-neutral-800">{translation.lokasi}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tombol Tambah ke Kalender (.ics) */}
                                <div className="mb-8">
                                    <a
                                        href={route('agenda.ics', { agenda: data.slug })}
                                        download
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>{t('agenda.add_to_calendar')}</span>
                                    </a>
                                </div>

                                {translation.deskripsi && (
                                    <div className="pt-8 border-t border-neutral-100">
                                        <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('agenda.desc_label')}</h3>
                                        <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed whitespace-pre-wrap">
                                            {translation.deskripsi}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
