import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight, Info, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/UI/Badge';
import { Pagination } from '@/Components/UI/Pagination';
import { formatDate } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/motion';

interface PengumumanItem {
    id: number;
    slug: string;
    tipe: 'info' | 'penting' | 'urgent';
    judul: string;
    konten: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    created_at: string;
}

interface IndexProps {
    pengumuman: {
        data: PengumumanItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        tipe?: string | null;
    };
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-pengumuman" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-pengumuman)" />
    </svg>
);

export default function PengumumanIndex({ pengumuman, filters }: IndexProps) {
    const { t, i18n } = useTranslation();
    const currentLocale = (i18n.language || 'id') as 'id' | 'en';

    const filterOptions = [
        { value: '', labelKey: 'pengumuman.filter_all' },
        { value: 'info', labelKey: 'pengumuman.filter_info' },
        { value: 'penting', labelKey: 'pengumuman.filter_important' },
        { value: 'urgent', labelKey: 'pengumuman.filter_urgent' },
    ];

    const getBadgeVariant = (tipe: string): 'info' | 'warning' | 'danger' => {
        if (tipe === 'urgent') return 'danger';
        if (tipe === 'penting') return 'warning';
        return 'info';
    };

    const getTipeIcon = (tipe: string) => {
        if (tipe === 'urgent') return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
        if (tipe === 'penting') return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
        return <Info className="w-3.5 h-3.5 mr-1" />;
    };

    return (
        <PublicLayout>
            <Head title={t('pengumuman.page_title')} />

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
                        <motion.div variants={fadeInUp} className="flex items-center space-x-2 text-gold-400 text-sm font-medium mb-3">
                            <Bell className="w-4 h-4 text-gold-400" />
                            <span className="uppercase tracking-wider">
                                {t('pengumuman.eyebrow')}
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                            {t('pengumuman.headline')}
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl leading-relaxed">
                            {t('pengumuman.hero_desc')}
                        </motion.p>

                        {/* Breadcrumbs */}
                        <motion.nav variants={fadeInUp} className="flex items-center space-x-2 text-sm text-white/60 mt-8" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                {t('nav.home')}
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <span className="text-white/90">
                                {t('pengumuman.breadcrumb')}
                            </span>
                        </motion.nav>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* CONTENT SECTION */}
            <section className="py-16 bg-neutral-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-[1280px]">
                    {/* FILTER CHIPS */}
                    <div className="flex flex-wrap items-center gap-2 mb-10">
                        {filterOptions.map((opt) => {
                            const isSelected = (filters.tipe ?? '') === opt.value;
                            return (
                                <Link
                                    key={opt.value}
                                    href={route('pengumuman.index', opt.value ? { tipe: opt.value } : {})}
                                    preserveScroll
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                                    }`}
                                >
                                    {t(opt.labelKey)}
                                </Link>
                            );
                        })}
                    </div>

                    {/* ANNOUNCEMENT GRID */}
                    {pengumuman.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {pengumuman.data.map((item) => (
                                    <motion.article
                                        key={item.id}
                                        variants={fadeInUp}
                                        initial="initial"
                                        whileInView="animate"
                                        viewport={{ once: true }}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-4">
                                                <Badge variant={getBadgeVariant(item.tipe)}>
                                                    {getTipeIcon(item.tipe)}
                                                    <span className="uppercase text-[11px] font-semibold tracking-wider">
                                                        {item.tipe}
                                                    </span>
                                                </Badge>

                                                {item.tanggal_mulai && (
                                                    <div className="flex items-center text-xs text-neutral-500">
                                                        <Calendar className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                                                        <span>{formatDate(item.tanggal_mulai, currentLocale)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                                                <Link href={route('pengumuman.show', { pengumuman: item.slug })}>
                                                    {item.judul}
                                                </Link>
                                            </h3>

                                            <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed mb-6">
                                                {item.konten.replace(/<[^>]*>/g, '').trim()}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                            <Link
                                                href={route('pengumuman.show', { pengumuman: item.slug })}
                                                className="text-primary-600 font-semibold text-sm inline-flex items-center gap-1.5 hover:gap-2.5 transition-all group"
                                            >
                                                <span>{t('pengumuman.read_more')}</span>
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>

                            {pengumuman.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <Pagination
                                        currentPage={pengumuman.current_page}
                                        totalPages={pengumuman.last_page}
                                        onPageChange={(page) => {
                                            router.get(
                                                route('pengumuman.index'),
                                                {
                                                    ...(filters.tipe ? { tipe: filters.tipe } : {}),
                                                    page,
                                                },
                                                { preserveScroll: true }
                                            );
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
                            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-neutral-800 mb-1">
                                {t('pengumuman.empty_title')}
                            </h3>
                            <p className="text-neutral-500 text-sm">
                                {t('pengumuman.empty_desc')}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
