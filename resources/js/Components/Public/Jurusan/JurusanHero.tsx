import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export interface JurusanData {
    id: number;
    kode: string;
    slug: string;
    nama: string;
    tagline: string;
    deskripsi_singkat: string;
    deskripsi_lengkap: string;
    konten_hero: string;
    color_start: string;
    color_end: string;
    icon_name: string;
    akreditasi: string;
    lama_pendidikan: string;
    total_siswa: number;
    highlight_1_icon: string;
    highlight_2_icon: string;
    highlight_3_icon: string;
    highlight_1_label: string;
    highlight_2_label: string;
    highlight_3_label: string;
    kompetensi: string[];
    prospek_karir: string[];
    fasilitas: string[];
    cover_image: string | null;
    gallery_images: string[];
    mitras?: Array<{
        id: number;
        nama: string;
        bidang?: string;
        url?: string | null;
        logo_url?: string | null;
    }>;
}

interface JurusanHeroProps {
    jurusan: JurusanData;
    spmbUrl: string;
}

export function resolveIcon(name: string | null, size = 20, className = ''): React.ReactElement {
    const IconComponent = (
        name && Icons[name as keyof typeof Icons] ? Icons[name as keyof typeof Icons] : Icons.GraduationCap
    ) as React.ElementType;

    return <IconComponent size={size} strokeWidth={1.5} className={className} />;
}

export default function JurusanHero({ jurusan, spmbUrl }: JurusanHeroProps) {
    const { t } = useTranslation();
    const hasCover = !!jurusan.cover_image;
    const heroGradient = hasCover
        ? `linear-gradient(to right, ${jurusan.color_start}E6 0%, ${jurusan.color_start}66 100%)`
        : `linear-gradient(to bottom right, ${jurusan.color_start}, ${jurusan.color_end})`;

    return (
        <section className="relative min-h-[70vh] lg:min-h-screen flex items-end overflow-hidden pb-16 pt-32 lg:pb-24 bg-primary-800">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0">
                {hasCover && (
                    <img
                        src={jurusan.cover_image as string}
                        alt={jurusan.nama}
                        className="w-full h-full object-cover"
                    />
                )}
                <div
                    className="absolute inset-0"
                    style={{ background: heroGradient }}
                />
            </div>

            {/* Breadcrumb */}
            <nav className="absolute top-24 left-4 lg:left-8 z-20 flex items-center text-xs lg:text-sm text-white/60">
                <Link href="/" className="hover:text-white transition">{t('nav.home')}</Link>
                <span className="mx-2">/</span>
                <Link href="/jurusan" className="hover:text-white transition">{t('jurusan.show_breadcrumb')}</Link>
                <span className="mx-2">/</span>
                <span className="text-white/80">{jurusan.nama}</span>
            </nav>

            <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <motion.div variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] uppercase text-white/60 mb-4">
                            {jurusan.kode}
                        </motion.div>
                        <motion.h1
                            variants={fadeInUp}
                            className="font-serif text-4xl lg:text-[56px] font-bold text-white leading-tight mb-4"
                        >
                            {jurusan.nama}
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-white/80 text-lg italic mb-6">
                            {jurusan.tagline}
                        </motion.p>
                        {jurusan.konten_hero && (
                            <motion.p variants={fadeInUp} className="text-white/70 text-base max-w-lg mb-8 leading-relaxed">
                                {jurusan.konten_hero}
                            </motion.p>
                        )}

                        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                            <a
                                href={spmbUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 rounded-lg font-semibold border border-transparent shadow-lg text-white hover:-translate-y-1 transition-all"
                                style={{ backgroundColor: jurusan.color_start, color: 'white' }}
                            >
                                {t('jurusan.register_now')}
                            </a>
                            <button
                                disabled
                                className="px-6 py-3 rounded-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all opacity-50 cursor-not-allowed hidden sm:inline-flex"
                            >
                                {t('jurusan.download_brochure')}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Highlight Boxes Horizontal Row */}
                <div className="mt-12 lg:mt-16 w-full -mx-4 px-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                    <div className="flex items-center gap-4 min-w-max pr-4">
                        {[
                            { icon: jurusan.highlight_1_icon, label: jurusan.highlight_1_label },
                            { icon: jurusan.highlight_2_icon, label: jurusan.highlight_2_label },
                            { icon: jurusan.highlight_3_icon, label: jurusan.highlight_3_label },
                        ].map((hl, idx) => hl.label ? (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="snap-start flex-shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10"
                            >
                                {resolveIcon(hl.icon, 20, "text-white")}
                                <span className="text-white font-semibold text-sm whitespace-nowrap">{hl.label}</span>
                            </motion.div>
                        ) : null)}
                    </div>
                </div>
            </div>
        </section>
    );
}
