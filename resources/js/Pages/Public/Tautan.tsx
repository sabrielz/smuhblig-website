import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedProps, Pengaturan } from '@/types';
import {
    fadeInUp,
    staggerContainer,
} from '@/lib/motion';

// Types
interface TautanItem {
    id: number;
    label: string;
    description: string | null;
    url: string;
    icon_name: string | null;
    kategori: string | null;
    buka_tab_baru: boolean;
}

interface GroupedLinks {
    category: string | null;
    items: TautanItem[];
}

interface TautanProps {
    pengaturan: Pengaturan;
    groupedLinks: GroupedLinks[];
}

// Geometric Pattern
const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-tautan" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-tautan)" />
    </svg>
);

// Page Hero (Small)
const PageHero = () => (
    <section className="relative bg-[#001f4d] overflow-hidden min-h-[320px] flex items-center">
        <GeometricPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003f87]/60 via-transparent to-[#001f4d]" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-3xl"
            >
                <motion.p
                    variants={fadeInUp}
                    className="text-xs font-bold tracking-[0.25em] uppercase text-[#c9a84c] mb-3"
                >
                    AKSES CEPAT
                </motion.p>
                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
                >
                    Tautan <span className="text-[#c9a84c]">Penting</span>
                </motion.h1>
                <motion.nav
                    variants={fadeInUp}
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-white/60"
                >
                    <a href="/" className="hover:text-white transition-colors duration-200">
                        Beranda
                    </a>
                    <ChevronRight size={14} className="text-white/40" />
                    <span className="text-white/90">Tautan</span>
                </motion.nav>
            </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
);

// Icon Renderer
const IconRenderer = ({ iconName, className }: { iconName: string | null; className?: string }) => {
    // Default fallback icon
    const FallbackIcon = LucideIcons.Link2;

    if (!iconName) return <FallbackIcon className={className} />;

    // Capitalize first letter to match Lucide export names if needed
    const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

    // Check if icon exists in LucideIcons
    // @ts-ignore
    const Icon = LucideIcons[formattedName] || LucideIcons[iconName] || FallbackIcon;

    return <Icon className={className} />;
};

export default function Tautan({ pengaturan, groupedLinks }: TautanProps) {
    const { locale } = usePage<SharedProps>().props;

    return (
        <PublicLayout
            seoTitle="Tautan Penting"
            seoDescription={`Direktori tautan dan layanan penting ${pengaturan.site_name}`}
        >
            <PageHero />

            <section className="py-16 lg:py-24 bg-white min-h-[50vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {groupedLinks.length === 0 ? (
                        <div className="text-center text-[#636366] py-16">
                            Belum ada tautan tersedia.
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {groupedLinks.map((group, groupIndex) => (
                                <motion.div
                                    key={groupIndex}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={staggerContainer}
                                >
                                    <motion.h2
                                        variants={fadeInUp}
                                        className="text-2xl font-serif font-bold text-[#003f87] mb-6 flex items-center gap-3"
                                    >
                                        <span className="w-8 h-px bg-[#c9a84c] inline-block"></span>
                                        {group.category || 'Lainnya'}
                                    </motion.h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {group.items.map((item, itemIndex) => (
                                            <motion.a
                                                key={item.id}
                                                variants={fadeInUp}
                                                href={item.url}
                                                target={item.buka_tab_baru ? "_blank" : "_self"}
                                                rel={item.buka_tab_baru ? "noopener noreferrer" : undefined}
                                                className="group relative bg-white border border-[#e5e5ea] hover:border-[#003f87] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#003f87]/5 block overflow-hidden"
                                            >
                                                {/* Hover line indicator */}
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#003f87] to-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="flex items-start gap-4 flex-nowrap">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f8f9fa] group-hover:bg-[#003f87]/5 border border-[#e5e5ea] group-hover:border-[#003f87]/20 flex items-center justify-center transition-colors duration-300">
                                                        <IconRenderer iconName={item.icon_name} className="w-6 h-6 text-[#003f87]" />
                                                    </div>

                                                    <div className="flex-1 min-w-0 pr-8">
                                                        <h3 className="text-lg font-bold text-[#111111] group-hover:text-[#003f87] transition-colors truncate mb-1">
                                                            {item.label}
                                                        </h3>
                                                        {item.description && (
                                                            <p className="text-sm text-[#636366] line-clamp-2 leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f8f9fa] group-hover:bg-[#003f87] flex items-center justify-center transition-colors duration-300">
                                                    <ExternalLink className="w-4 h-4 text-[#636366] group-hover:text-white transition-colors" />
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
