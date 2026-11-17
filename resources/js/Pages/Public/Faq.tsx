import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, HelpCircle, Search, MessageSquare, ArrowRight } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Input } from '@/Components/UI/Input';
import Accordion from '@/Components/UI/Accordion';

interface FaqItem {
    id: number;
    kategori: 'umum' | 'pendaftaran' | 'akademik' | 'fasilitas';
    urutan: number;
    pertanyaan: string;
    jawaban: string;
}

interface Props {
    faqs: FaqItem[];
    faqJsonLd: Record<string, any>;
}

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-faq" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-faq)" />
    </svg>
);

export default function FaqIndex({ faqs, faqJsonLd }: Props) {
    const { t } = useTranslation();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const kategoriLabels: Record<string, string> = {
        umum: t('faq.kategori_umum'),
        pendaftaran: t('faq.kategori_pendaftaran'),
        akademik: t('faq.kategori_akademik'),
        fasilitas: t('faq.kategori_fasilitas'),
    };

    const categories = ['umum', 'pendaftaran', 'akademik', 'fasilitas'] as const;

    const filteredFaqs = useMemo(() => {
        return faqs.filter((item) => {
            const matchCategory = selectedCategory === 'all' || item.kategori === selectedCategory;
            const matchSearch =
                !search.trim() ||
                item.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
                item.jawaban.toLowerCase().includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [faqs, selectedCategory, search]);

    // Grouping by category
    const groupedFaqs = useMemo(() => {
        const groups: Record<string, FaqItem[]> = {};

        categories.forEach((cat) => {
            const items = filteredFaqs.filter((f) => f.kategori === cat);
            if (items.length > 0) {
                groups[cat] = items;
            }
        });

        return groups;
    }, [filteredFaqs]);

    return (
        <PublicLayout jsonLd={[faqJsonLd]}>
            <Head
                title={t('faq.meta_title')}
            />

            {/* Hero Header */}
            <section className="relative bg-primary-900 text-white py-16 lg:py-24 overflow-hidden">
                <GeometricPattern />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-white transition-colors">
                            {t('faq.breadcrumb_beranda')}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-white font-medium">{t('faq.breadcrumb_faq')}</span>
                    </nav>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>{t('faq.badge_subtitle')}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white mb-4">
                            {t('faq.hero_title')}
                        </h1>
                        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                            {t('faq.hero_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 lg:py-16 bg-neutral-50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search & Category Pills */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs mb-10 space-y-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder={t('faq.search_placeholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    selectedCategory === 'all'
                                        ? 'bg-primary-600 text-white shadow-xs'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {t('faq.filter_semua')}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-primary-600 text-white shadow-xs'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                >
                                    {kategoriLabels[cat]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grouped Accordions */}
                    {Object.keys(groupedFaqs).length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 p-8">
                            <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                            <h3 className="text-base font-semibold text-neutral-800 mb-1">
                                {t('faq.kosong_title')}
                            </h3>
                            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                                {t('faq.kosong_desc')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {Object.entries(groupedFaqs).map(([cat, items]) => (
                                <div key={cat} className="space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                                        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                                            {kategoriLabels[cat] || cat}
                                        </h2>
                                    </div>

                                    <Accordion
                                        items={items.map((i) => ({
                                            id: i.id,
                                            title: i.pertanyaan,
                                            content: i.jawaban,
                                        }))}
                                        allowMultiple
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Callout ke Kontak */}
                    <div className="mt-16 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 mb-1">
                                    {t('faq.callout_title')}
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
                                    {t('faq.callout_desc')}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/kontak"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all shrink-0"
                        >
                            <span>{t('faq.callout_btn')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
