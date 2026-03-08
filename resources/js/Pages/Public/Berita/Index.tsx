import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ArticleCard } from '@/Components/UI/ArticleCard';
import { EmptyState } from '@/Components/UI/EmptyState';
import { Pagination } from '@/Components/UI/Pagination';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Search, Newspaper, ChevronRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface IndexProps {
    articles: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        category?: string;
        q?: string;
    };
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

export default function BeritaIndex({ articles, categories, filters }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.q || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('berita.index'),
            { ...filters, q: searchQuery, page: 1 },
            { preserveState: true }
        );
    };

    const handleCategoryClick = (categoryId?: number) => {
        const queryParams = { ...filters, page: 1 } as any;
        if (categoryId) {
            queryParams.category = categoryId;
        } else {
            delete queryParams.category;
        }

        router.get(route('berita.index'), queryParams, { preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('berita.index'), { ...filters, page }, { preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title="Berita & Informasi" />

            {/* SECTION 1: Page Hero */}
            <section className="relative bg-[#001f4d] overflow-hidden min-h-[360px] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-dark to-primary-900" />
                <GeometricPattern />
                <div className="absolute inset-0 bg-gradient-to-br from-[#003f87]/60 via-transparent to-[#001f4d]" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-4xl mx-auto text-center flex flex-col items-center"
                    >
                        <motion.p
                            variants={fadeInUp}
                            className="text-xs font-bold tracking-[0.25em] uppercase text-[#c9a84c] mb-4"
                        >
                            INFO KAMPUS
                        </motion.p>
                        <motion.h1
                            variants={fadeInUp}
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                        >
                            Berita &amp; <span className="text-[#c9a84c]">Informasi</span>
                        </motion.h1>
                        <motion.nav
                            variants={fadeInUp}
                            aria-label="Breadcrumb"
                            className="flex items-center justify-center gap-2 text-sm text-white/60 mb-8"
                        >
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                Beranda
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <span className="text-white/90">Berita</span>
                        </motion.nav>
                        <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Ikuti perkembangan terbaru, kegiatan sekolah, dan prestasi siswa-siswi SMK Muhammadiyah Bligo.
                        </motion.p>

                        <motion.form variants={fadeInUp} onSubmit={handleSearch} className="w-full max-w-2xl relative flex items-center mx-auto shadow-2xl">
                            <Input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-32 py-5 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-neutral-900 focus:border-white transition-all backdrop-blur-md text-base"
                            />
                            <Search className={cn("absolute left-5 w-6 h-6", searchQuery ? 'text-primary-600' : 'text-white/50')} />
                            <Button type="submit" variant="primary" className="absolute right-2 rounded-full px-8 py-3 bg-[#c9a84c] hover:bg-[#a8821f] text-white border-none font-semibold transition-all">
                                Cari
                            </Button>
                        </motion.form>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            </section>

            <div className="py-16 lg:py-24 bg-neutral-50 min-h-screen">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* SECTION 2: Filter Kategori */}
                    <div className="flex overflow-x-auto pb-4 mb-10 space-x-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        <button
                            onClick={() => handleCategoryClick()}
                            className={cn(
                                "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors border",
                                !filters.category
                                    ? "bg-[#003f87] text-white border-primary-navy shadow-sm"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-navy hover:text-primary-navy"
                            )}
                        >
                            Semua Berita
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors border",
                                    filters.category == category.id.toString()
                                        ? "bg-[#003f87] text-white border-primary-navy shadow-sm"
                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-navy hover:text-primary-navy"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* SECTION 3: Grid Artikel */}
                    {articles.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.data.map((article: any) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Newspaper className="w-10 h-10 text-neutral-400" />}
                            title="Tidak Ada Berita"
                            description="Belum ada berita yang diterbitkan untuk kategori atau pencarian ini."
                            action={filters.category || filters.q ? {
                                label: "Hapus Filter",
                                onClick: () => router.get(route('berita.index'))
                            } : undefined}
                            className="bg-white rounded-2xl border border-neutral-100 shadow-sm py-20"
                        />
                    )}

                    {/* SECTION 4: Pagination */}
                    {articles.last_page > 1 && (
                        <div className="mt-16 flex justify-center">
                            <Pagination
                                currentPage={articles.current_page}
                                totalPages={articles.last_page}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
