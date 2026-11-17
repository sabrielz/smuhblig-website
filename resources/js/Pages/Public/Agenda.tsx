import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { format, parseISO, isSameDay } from 'date-fns';
import { id as idLocale, enUS as enLocale } from 'date-fns/locale';

interface ContentItem {
    id: number;
    slug: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    warna: string;
    tipe: string;
    judul_id?: string;
    judul_en?: string;
    translations: {
        id: any;
        en: any;
    };
}

interface FilterOption {
    bulan: number;
    tahun: number;
    label_id: string;
    label_en: string;
    value: string;
}

interface AgendaProps {
    agendasGrouped: Record<string, ContentItem[]>;
    filterOptions: FilterOption[];
    activeFilter: string | null;
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-agenda" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect x="20" y="20" width="40" height="40" fill="none" stroke="white" strokeWidth="1" transform="rotate(45 40 40)" />
                <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-agenda)" />
    </svg>
);

const PageHero = () => {
    const { t } = useTranslation();
    return (
        <section className="relative bg-primary-900 overflow-hidden min-h-[360px] flex items-center">
            <GeometricPattern />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl"
                >
                    <motion.p
                        variants={fadeInUp}
                        className="text-xs font-bold tracking-[0.25em] uppercase text-gold-500 mb-4"
                    >
                        {t('agenda.hero_subtitle')}
                    </motion.p>
                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                    >
                        {t('agenda.hero_title_1')} <span className="text-gold-500">{t('agenda.hero_title_2')}</span>
                    </motion.h1>
                    <motion.nav
                        variants={fadeInUp}
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-sm text-white/60"
                    >
                        <Link href="/" className="hover:text-white transition-colors duration-200">
                            {t('nav.home')}
                        </Link>
                        <ChevronRight size={14} className="text-white/40" />
                        <span className="text-white/90">{t('agenda.breadcrumb')}</span>
                    </motion.nav>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
};

export default function Agenda({ agendasGrouped, filterOptions, activeFilter }: AgendaProps) {
    const { t, i18n } = useTranslation();
    const currentLocale = (i18n.language || 'id') as 'id' | 'en';
    const dateFnsLocale = currentLocale === 'en' ? enLocale : idLocale;

    const getTipeBadge = (tipe: string) => {
        let label = t('agenda.type_kegiatan');
        if (tipe === 'libur') label = t('agenda.type_libur');
        if (tipe === 'ujian') label = t('agenda.type_ujian');
        if (tipe === 'penerimaan') label = t('agenda.type_penerimaan');

        return label;
    };

    const handleFilter = (bulan: number, tahun: number) => {
        router.get(route('agenda.index'), { bulan, tahun }, { preserveScroll: true });
    };

    const handleClearFilter = () => {
        router.get(route('agenda.index'), {}, { preserveScroll: true });
    };

    return (
        <PublicLayout>
            <PageHero />

            <section className="py-16 bg-white min-h-[50vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-4 hide-scrollbar">
                            <button
                                onClick={handleClearFilter}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0",
                                    !activeFilter
                                        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                )}
                            >
                                {t('agenda.all_events')}
                            </button>

                            {filterOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleFilter(opt.bulan, opt.tahun)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0",
                                        activeFilter === opt.value
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                    )}
                                >
                                    {currentLocale === 'en' ? opt.label_en : opt.label_id}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-16">
                        {Object.keys(agendasGrouped).length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100"
                            >
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                                <p className="text-neutral-500 font-medium">{t('agenda.empty_desc')}</p>
                            </motion.div>
                        ) : (
                            Object.keys(agendasGrouped).sort().map((monthKey, idx) => {
                                const agendas = agendasGrouped[monthKey];
                                const dateForMonth = parseISO(`${monthKey}-01`);
                                const monthLabel = format(dateForMonth, 'MMMM yyyy', { locale: dateFnsLocale });

                                return (
                                    <motion.div
                                        key={monthKey}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className="relative"
                                    >
                                        <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                                            <span className="w-8 h-1 rounded-full bg-gold-500 inline-block"></span>
                                            {monthLabel}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            {agendas.map((agenda, i) => {
                                                const translation = currentLocale === 'en' && agenda.translations?.en
                                                    ? agenda.translations.en
                                                    : agenda.translations?.id || {};

                                                const startDate = parseISO(agenda.tanggal_mulai);
                                                const endDate = agenda.tanggal_selesai ? parseISO(agenda.tanggal_selesai) : null;
                                                const isSingleDay = !endDate || isSameDay(startDate, endDate);

                                                return (
                                                    <div
                                                        key={agenda.id}
                                                        className="group bg-white rounded-2xl p-4 sm:p-5 border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-start gap-4 sm:gap-6"
                                                    >
                                                        {/* Date Box */}
                                                        <div
                                                            className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center text-white shadow-inner relative overflow-hidden"
                                                            style={{ backgroundColor: agenda.warna }}
                                                        >
                                                            <div className="absolute inset-0 bg-black/10"></div>
                                                            <span className="relative text-2xl sm:text-3xl font-bold leading-none mb-1">
                                                                {format(startDate, 'd')}
                                                            </span>
                                                            <span className="relative text-xs font-medium uppercase tracking-wider opacity-90">
                                                                {format(startDate, 'MMM', { locale: dateFnsLocale })}
                                                            </span>
                                                        </div>

                                                        {/* Content section */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                <span
                                                                    className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                                                                    style={{
                                                                        backgroundColor: `${agenda.warna}15`,
                                                                        color: agenda.warna
                                                                    }}
                                                                >
                                                                    {getTipeBadge(agenda.tipe)}
                                                                </span>
                                                                {!isSingleDay && endDate && (
                                                                    <span className="text-xs text-neutral-500 font-medium">
                                                                        {format(startDate, 'd MMM')} - {format(endDate, 'd MMM yyyy', { locale: dateFnsLocale })}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h4 className="font-bold text-neutral-900 text-base sm:text-lg mb-2 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                                                                {translation.judul || agenda.judul_id || 'Untitled Event'}
                                                            </h4>

                                                            {translation.lokasi && (
                                                                <div className="flex items-center text-xs sm:text-sm text-neutral-500 mb-3 gap-1.5 line-clamp-1">
                                                                    <MapPin size={14} className="flex-shrink-0" />
                                                                    <span className="truncate">{translation.lokasi}</span>
                                                                </div>
                                                            )}

                                                            {/* We don't have show page yet, but user asked for GET /agenda/{agenda:slug} */}
                                                            {/* Let's avoid dead link if show page isn't needed, but user mentioned GET /agenda/{agenda:slug} */}
                                                            {agenda.slug && (
                                                                <Link
                                                                    href={route('agenda.show', { agenda: agenda.slug })}
                                                                    className="inline-flex items-center text-sm font-semibold hover:gap-2 gap-1.5 transition-all"
                                                                    style={{ color: agenda.warna }}
                                                                >
                                                                    {t('agenda.detail_link')}
                                                                    <ArrowRight size={14} />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
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
            </section>
        </PublicLayout>
    );
}
