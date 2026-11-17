import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArticleCard } from '@/Components/UI/ArticleCard';
import { Button } from '@/Components/UI/Button';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export interface ArticleItem {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    thumbnail: string;
    published_at: string;
    category: { name: string; color: string };
    author: { name: string; avatar: string };
}

export interface BeritaSectionProps {
    beritaTerbaru: ArticleItem[];
    kontenBerita?: Record<string, string>;
}

export function BeritaSection({ beritaTerbaru, kontenBerita }: BeritaSectionProps) {
    const { t } = useTranslation();

    return (
        <section
            id="beranda-berita"
            className="py-20 lg:py-28 bg-white"
            aria-label="Berita terkini"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-16"
                >
                    <motion.span
                        variants={fadeInUp}
                        className="inline-block font-mono text-xs tracking-[0.3em] uppercase mb-4 text-primary-600"
                    >
                        {kontenBerita?.label || '-'}
                    </motion.span>
                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        {kontenBerita?.headline || '-'}
                    </motion.h2>
                    {kontenBerita?.subheadline && (
                        <motion.p
                            variants={fadeInUp}
                            className="mt-4 text-lg max-w-2xl mx-auto text-neutral-500"
                        >
                            {kontenBerita.subheadline}
                        </motion.p>
                    )}
                </motion.div>

                {beritaTerbaru.length > 0 ? (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {beritaTerbaru.map((article) => (
                            <motion.div key={article.id} variants={fadeInUp}>
                                <ArticleCard article={article} className="h-full" />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-16 text-neutral-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>{t('beranda.berita_empty')}</p>
                    </div>
                )}

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-14"
                >
                    <Link href="/berita" id="berita-lihat-semua">
                        <Button
                            variant="outline"
                            size="lg"
                            rightIcon={
                                <ArrowRight
                                    className="w-5 h-5"
                                    strokeWidth={1.5}
                                />
                            }
                        >
                            {t('beranda.berita_all')}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default BeritaSection;
