import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ArticleCard } from '@/Components/UI/ArticleCard';
import { Badge } from '@/Components/UI/Badge';
import { CalendarIcon, Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
interface ShowProps {
    article: {
        id: number;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        published_at: string;
        thumbnail: string;
        category: {
            id: number;
            name: string;
            slug: string;
            color: string;
        };
        author: {
            name: string;
            avatar: string;
        };
    };
    relatedArticles: any[];
    categories: {
        id: number;
        name: string;
        slug: string;
        articles_count: number;
    }[];
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

export default function BeritaShow({ article, relatedArticles, categories }: ShowProps) {
    // Estimasi waktu baca dari jumlah kata konten (asumsi 200 kata/menit)
    const getReadingTime = (content: string) => {
        const text = content.replace(/<[^>]+>/g, ' ');
        const wordCount = text.trim().split(/\s+/).length;
        const time = Math.ceil(wordCount / 200);
        return time < 1 ? 1 : time;
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // Toast notification idealnya dipanggil disini
        alert('Tautan disalin ke clipboard');
    };

    const handleShareWA = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`;
        window.open(url, '_blank');
    };

    return (
        <PublicLayout>
            <Head>
                <title>{`${article.title} - Berita SMK Muhammadiyah Bligo`}</title>
                <meta name="description" content={article.excerpt} />
                <meta property="og:image" content={article.thumbnail} />
            </Head>

            <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden bg-primary-dark">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-dark to-primary-900" />
                <GeometricPattern />
                <div className="absolute inset-0 bg-gradient-to-br from-[#003f87]/60 via-transparent to-[#001f4d]" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-32">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-4xl mx-auto text-center flex flex-col items-center mt-10"
                    >
                        <motion.p
                            variants={fadeInUp}
                            className="text-xs font-bold tracking-[0.25em] uppercase text-[#c9a84c] mb-4"
                        >
                            JENDELA INFORMASI
                        </motion.p>
                        <motion.h1
                            variants={fadeInUp}
                            className="font-serif text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-tight mb-6"
                        >
                            Dinamika &amp; <span className="text-[#c9a84c]">Wawasan</span>
                        </motion.h1>
                        <motion.nav
                            variants={fadeInUp}
                            aria-label="Breadcrumb"
                            className="flex items-center justify-center gap-2 text-sm text-white/60 mb-8"
                        >
                            <Link href={route('beranda')} className="hover:text-white transition-colors duration-200">
                                Beranda
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <Link href={route('berita.index')} className="hover:text-white transition-colors duration-200">
                                Berita
                            </Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <span className="text-white/90 truncate max-w-[200px]" title={article.title}>
                                {article.title}
                            </span>
                        </motion.nav>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            </section>

            <div className="pt-24 pb-20 bg-neutral-50 min-h-screen z-2">
                <div className="container mx-auto px-4 max-w-[1280px]">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Kiri: Konten Artikel (65%) */}
                        <div className="w-full lg:w-[65%]">
                            <article className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-neutral-100">
                                {/* Thumbnail */}
                                <div className="aspect-video w-full overflow-hidden rounded-2xl mb-10 bg-neutral-100">
                                    <img
                                        src={article.thumbnail}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Badge & Date */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <span
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: `${article.category.color}15`,
                                            color: article.category.color
                                        }}
                                    >
                                        {article.category.name}
                                    </span>
                                    <div className="flex items-center text-sm text-neutral-500">
                                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                                        {article.published_at}
                                    </div>
                                </div>

                                {/* Headline */}
                                <h1 className="font-serif text-3xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-8">
                                    {article.title}
                                </h1>

                                {/* Meta Penulis */}
                                <div className="flex items-center text-neutral-600 mb-8 pt-4">
                                    <img
                                        src={article.author.avatar}
                                        alt={article.author.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4 bg-neutral-100"
                                    />
                                    <div>
                                        <div className="font-medium text-neutral-900 capitalize">
                                            {article.author.name}
                                        </div>
                                        <div className="text-sm">
                                            Penulis • {getReadingTime(article.content)} min read
                                        </div>
                                    </div>
                                </div>

                                {/* Divider Gold */}
                                <div className="w-16 h-1.5 bg-primary-gold mb-10 rounded-full"></div>

                                {/* Konten TipTap Render */}
                                <div
                                    className="prose prose-base sm:prose-lg max-w-none prose-img:rounded-2xl prose-headings:font-serif prose-headings:text-neutral-900 prose-a:text-primary-navy hover:prose-a:text-primary-600 focus:outline-none"
                                    dangerouslySetInnerHTML={{ __html: article.content || '' }}
                                />

                                {/* Share Buttons */}
                                <div className="mt-16 pt-8 border-t border-neutral-100">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                                        <Share2 className="w-5 h-5 mr-2 text-primary-navy" />
                                        Bagikan Artikel
                                    </h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11"
                                        >
                                            <LinkIcon className="w-4 h-4 mr-1 sm:mr-2" />
                                            Salin <span className="hidden sm:inline">&nbsp;Tautan</span>
                                        </button>
                                        <button
                                            onClick={handleShareWA}
                                            className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
                                            WhatsApp
                                        </button>
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11"
                                        >
                                            <Facebook className="w-4 h-4 mr-1 sm:mr-2" />
                                            Facebook
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11"
                                        >
                                            <Twitter className="w-4 h-4 mr-1 sm:mr-2" />
                                            Twitter
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Kanan: Sidebar (35%) */}
                        <div className="w-full lg:w-[35%] space-y-8">
                            {/* Box: Artikel Terkait */}
                            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-neutral-100">
                                <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                                    <div className="w-1.5 h-6 bg-primary-gold rounded-full mr-3"></div>
                                    Artikel Terkait
                                </h3>
                                <div className="space-y-4">
                                    {relatedArticles.length > 0 ? (
                                        relatedArticles.map((rel) => (
                                            <ArticleCard key={rel.id} article={rel} className="shadow-none border-neutral-50 bg-neutral-50/50 hover:bg-white" />
                                        ))
                                    ) : (
                                        <p className="text-neutral-500 text-sm">Tidak ada artikel terkait.</p>
                                    )}
                                </div>
                            </div>

                            {/* Box: Kategori */}
                            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-neutral-100 sticky top-28">
                                <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                                    <div className="w-1.5 h-6 bg-[#003f87] rounded-full mr-3"></div>
                                    Kategori
                                </h3>
                                <ul className="space-y-3">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={route('berita.index', { category: category.id })}
                                                className="group flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 hover:text-primary-navy transition-colors"
                                            >
                                                <span className="font-medium text-neutral-700 group-hover:text-primary-navy">
                                                    {category.name}
                                                </span>
                                                <span className="bg-neutral-100 group-hover:bg-[#003f87] group-hover:text-white text-neutral-600 text-xs font-bold px-2.5 py-1 rounded-full transition-colors">
                                                    {category.articles_count}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </PublicLayout>
    );
}
