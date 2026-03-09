import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Search, SearchX, ArrowRight, BookOpen, Layers } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer, slideFromLeft } from '@/lib/motion';
import { Pagination } from '@/Components/UI/Pagination';
import type { SharedProps } from '@/types';

// Interfaces for our specific search result payloads
interface JurusanResult {
    id: string;
    slug: string;
    kode: string;
    nama: string;
    deskripsi_singkat: string;
    thumbnail: string;
}

interface ArtikelResult {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    published_at: string;
    category: {
        name: string;
    };
    thumbnail: string;
}

interface PaginatedArtikel {
    data: ArtikelResult[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PencarianProps extends SharedProps {
    keyword: string;
    type: 'semua' | 'artikel' | 'jurusan';
    hasil: {
        jurusan: JurusanResult[];
        artikel: PaginatedArtikel | null;
    };
    totalHasil: number;
}

export default function Pencarian({
    keyword,
    type,
    hasil,
    totalHasil,
    locale,
}: PencarianProps) {
    const [searchQuery, setSearchQuery] = useState(keyword);
    const [activeTab, setActiveTab] = useState<'semua' | 'artikel' | 'jurusan'>(type);

    const handleSearch = (e?: FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/pencarian',
            { q: searchQuery, type: activeTab },
            { preserveState: true }
        );
    };

    const handleTabChange = (newTab: 'semua' | 'artikel' | 'jurusan') => {
        setActiveTab(newTab);
        router.get(
            '/pencarian',
            { q: keyword, type: newTab },
            { preserveState: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/pencarian',
            { q: keyword, type: activeTab, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasResults = totalHasil > 0;

    return (
        <PublicLayout>
            <Head>
                <title>{`Pencarian: ${keyword} | SMK Muhammadiyah Bligo`}</title>
            </Head>

            {/* Header Section */}
            <section className="bg-[#001f4d] pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg
                        className="h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,100 L100,0 L100,100 Z"
                            fill="currentColor"
                            className="text-[#c9a84c]"
                        />
                    </svg>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="text-center"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight"
                        >
                            {locale === 'id' ? 'Pencarian' : 'Search'}
                        </motion.h1>

                        {/* Search Input Box */}
                        <motion.form
                            variants={fadeInUp}
                            onSubmit={handleSearch}
                            className="relative max-w-2xl mx-auto mb-8"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={locale === 'id' ? "Cari informasi, artikel, atau jurusan..." : "Search information, articles, or programs..."}
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-6 pr-16 text-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all shadow-lg"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 bg-[#c9a84c] text-white p-3 rounded-xl hover:bg-[#a8821f] transition-colors shadow-sm"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </motion.form>

                        {/* Filter Tabs */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none"
                        >
                            {(['semua', 'artikel', 'jurusan'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={cn(
                                        'px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                                        activeTab === tab
                                            ? 'bg-white text-[#001f4d] shadow-md'
                                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                                    )}
                                >
                                    {locale === 'id'
                                        ? tab.charAt(0).toUpperCase() + tab.slice(1)
                                        : tab === 'semua' ? 'All' : tab === 'artikel' ? 'Articles' : 'Programs'}
                                </button>
                            ))}
                        </motion.div>

                        <motion.p variants={fadeInUp} className="mt-8 text-white/70 text-sm">
                            {locale === 'id' ? 'Menampilkan' : 'Showing'} <strong className="text-white">{totalHasil}</strong> {locale === 'id' ? 'hasil untuk' : 'results for'} "<strong className="text-[#c9a84c]">{keyword}</strong>"
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-16 bg-gray-50 min-h-[50vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                    {!hasResults ? (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-400 mb-6">
                                <SearchX className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#111111] mb-3">
                                {locale === 'id' ? 'Tidak ada hasil ditemukan' : 'No results found'}
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                {locale === 'id'
                                    ? `Kami tidak menemukan data apa pun untuk kata kunci "${keyword}". Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda.`
                                    : `We couldn't find any data matching the keyword "${keyword}". Try using a different keyword or check your spelling.`}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => router.get('/berita')}
                                    className="px-6 py-3 rounded-xl bg-[#003f87]/5 text-[#003f87] font-semibold hover:bg-[#003f87]/10 transition-colors flex items-center gap-2"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    {locale === 'id' ? 'Lihat Semua Artikel' : 'View All Articles'}
                                </button>
                                <button
                                    onClick={() => router.get('/jurusan')}
                                    className="px-6 py-3 rounded-xl bg-[#c9a84c]/10 text-[#a8821f] font-semibold hover:bg-[#c9a84c]/20 transition-colors flex items-center gap-2"
                                >
                                    <Layers className="w-5 h-5" />
                                    {locale === 'id' ? 'Lihat Program Keahlian' : 'View Programs'}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-16">

                            {/* JURUSAN RESULTS */}
                            {hasil.jurusan && hasil.jurusan.length > 0 && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
                                        <Layers className="w-6 h-6 text-[#c9a84c]" />
                                        <h2 className="text-2xl font-bold text-[#111111] font-serif">
                                            {locale === 'id' ? 'Jurusan' : 'Programs'}
                                        </h2>
                                        <span className="bg-[#003f87]/10 text-[#003f87] font-semibold text-xs py-1 px-3 rounded-full ml-2">
                                            {hasil.jurusan.length} {locale === 'id' ? 'Hasil' : 'Results'}
                                        </span>
                                    </motion.div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {hasil.jurusan.map((j) => (
                                            <motion.a
                                                href={`/jurusan/${j.slug}`}
                                                key={j.id}
                                                variants={fadeInUp}
                                                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="relative h-40 w-full overflow-hidden">
                                                    <img
                                                        src={j.thumbnail}
                                                        alt={j.nama || j.kode}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    <div className="absolute bottom-4 left-4 right-4">
                                                        <span className="inline-block bg-[#c9a84c] text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded mb-2">
                                                            {j.kode}
                                                        </span>
                                                        <h3
                                                            className="text-white font-bold text-lg leading-tight line-clamp-1 group-hover:text-[#c9a84c] transition-colors"
                                                            dangerouslySetInnerHTML={{ __html: j.nama }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col justify-between">
                                                    <p
                                                        className="text-gray-600 text-sm line-clamp-2 mb-4"
                                                        dangerouslySetInnerHTML={{ __html: j.deskripsi_singkat }}
                                                    />
                                                    <span className="text-[#003f87] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        {locale === 'id' ? 'Lihat Detail' : 'View Detail'} <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Divider if both exist */}
                            {hasil.jurusan?.length > 0 && hasil.artikel?.data?.length > 0 && (
                                <hr className="border-gray-200" />
                            )}

                            {/* ARTIKEL RESULTS */}
                            {hasil.artikel && hasil.artikel.data.length > 0 && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
                                        <BookOpen className="w-6 h-6 text-[#c9a84c]" />
                                        <h2 className="text-2xl font-bold text-[#111111] font-serif">
                                            {locale === 'id' ? 'Artikel & Berita' : 'Articles & News'}
                                        </h2>
                                        <span className="bg-[#003f87]/10 text-[#003f87] font-semibold text-xs py-1 px-3 rounded-full ml-2">
                                            {hasil.artikel.total} {locale === 'id' ? 'Hasil' : 'Results'}
                                        </span>
                                    </motion.div>

                                    <div className="flex flex-col gap-6">
                                        {hasil.artikel.data.map((artikel) => (
                                            <motion.a
                                                href={`/berita/${artikel.slug}`}
                                                key={artikel.id}
                                                variants={slideFromLeft}
                                                className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                                            >
                                                <div className="sm:w-1/3 lg:w-1/4 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={artikel.thumbnail}
                                                        alt={artikel.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#003f87] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                                        {artikel.category.name}
                                                    </div>
                                                </div>
                                                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                                                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                                        {artikel.published_at}
                                                    </span>
                                                    <h3
                                                        className="text-xl md:text-2xl font-bold text-[#111111] mb-3 group-hover:text-[#003f87] transition-colors"
                                                        dangerouslySetInnerHTML={{ __html: artikel.title }}
                                                    />
                                                    <p
                                                        className="text-gray-600 mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: artikel.excerpt }}
                                                    />
                                                    <div className="mt-auto">
                                                        <span className="text-[#c9a84c] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                            {locale === 'id' ? 'Baca Selengkapnya' : 'Read More'} <ArrowRight className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>

                                    {/* Pagination for Artikel */}
                                    {hasil.artikel.last_page > 1 && (
                                        <div className="mt-12 flex justify-center">
                                            <Pagination
                                                currentPage={hasil.artikel.current_page}
                                                totalPages={hasil.artikel.last_page}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                        </div>
                    )}

                </div>
            </section>
        </PublicLayout>
    );
}
