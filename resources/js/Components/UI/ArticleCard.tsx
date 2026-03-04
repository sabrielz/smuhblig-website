import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardHover } from '@/lib/motion';

interface ArticleCardProps {
    article: {
        id: number;
        title: string;
        excerpt: string;
        thumbnail: string;
        category: {
            name: string;
            color: string;
        };
        author: {
            name: string;
            avatar: string;
        };
        published_at: string;
        slug: string;
    };
    className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
    return (
        <motion.div
            whileHover={cardHover}
            className={cn(
                "group bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300",
                className
            )}
        >
            <Link href={`/berita/${article.slug}`} className="block h-full flex flex-col">
                {/* Thumbnail */}
                <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                    <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>

                {/* Content */}
                <div className="px-6 py-5 flex flex-col h-full grow">
                    {/* Category Badge */}
                    <div className="mb-3">
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: `${article.category.color}15`,
                                color: article.category.color
                            }}
                        >
                            {article.category.name}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg text-neutral-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-neutral-500 line-clamp-3 mb-6 flex-grow">
                        {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center mt-auto">
                        <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-6 h-6 rounded-full object-cover mr-2 bg-neutral-100"
                        />
                        <div className="text-xs text-neutral-400 capitalize">
                            <span className="font-medium text-neutral-500">{article.author.name}</span>
                            <span className="mx-1.5">•</span>
                            {article.published_at}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
