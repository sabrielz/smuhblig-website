import React from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    ExternalLink,
    Link as LinkIcon,
    Youtube,
    Instagram,
    Facebook,
    ArrowUpRight,
} from 'lucide-react';
import { scaleIn, fadeInUp, staggerContainer } from '@/lib/motion';
import type { Tautan } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
    Globe: <Globe size={20} strokeWidth={1.5} />,
    ExternalLink: <ExternalLink size={20} strokeWidth={1.5} />,
    Link: <LinkIcon size={20} strokeWidth={1.5} />,
    Youtube: <Youtube size={20} strokeWidth={1.5} />,
    Instagram: <Instagram size={20} strokeWidth={1.5} />,
    Facebook: <Facebook size={20} strokeWidth={1.5} />,
};

export function TautanCard({ tautan }: { tautan: Tautan }) {
    const icon = tautan.icon_name && iconMap[tautan.icon_name]
        ? iconMap[tautan.icon_name]
        : <LinkIcon size={20} strokeWidth={1.5} />;

    return (
        <motion.a
            href={tautan.url}
            target={tautan.buka_tab_baru ? '_blank' : '_self'}
            rel={tautan.buka_tab_baru ? 'noopener noreferrer' : undefined}
            variants={scaleIn}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
            className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-neutral-100 hover:border-primary-600/30 hover:shadow-lg transition-all duration-300"
        >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-600/15 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-200">
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 text-sm mb-0.5 truncate group-hover:text-primary-600 transition-colors">
                    {tautan.label}
                </p>
                {tautan.deskripsi && (
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">{tautan.deskripsi}</p>
                )}
            </div>

            {/* Arrow */}
            <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="flex-shrink-0 mt-0.5 text-neutral-300 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
        </motion.a>
    );
}

export interface TautanSectionProps {
    tautan: Tautan[];
}

export function TautanSection({ tautan }: TautanSectionProps) {
    if (!tautan || tautan.length === 0) return null;

    return (
        <section className="py-20 lg:py-28 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                        NAVIGASI CEPAT
                    </p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600 mb-4">
                        Tautan Penting
                    </h2>
                    <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                        Akses cepat ke halaman dan layanan yang sering dibutuhkan.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {tautan.map((t) => (
                        <TautanCard key={t.id} tautan={t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default TautanSection;
