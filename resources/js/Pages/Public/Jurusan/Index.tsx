import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { JurusanCard } from '@/Components/UI/JurusanCard';
import { fadeInUp, staggerContainer, fadeIn } from '@/lib/motion';
import type { SharedProps, Jurusan } from '@/types';

interface Props {
    jurusan: Jurusan[];
    seo: {
        title: string;
        description: string;
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

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
    const { t } = useTranslation();
    return (
        <section className="relative min-h-[52vh] flex items-center bg-primary-900 overflow-hidden">
            <GeometricPattern />

            {/* Ambient glow */}
            <div
                aria-hidden="true"
                className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-600/40 rounded-full blur-3xl pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative py-24 lg:py-32">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl"
                >
                    {/* Breadcrumb */}
                    <motion.nav
                        variants={fadeInUp}
                        className="flex items-center gap-2 text-white/50 text-sm mb-8"
                        aria-label="Breadcrumb"
                    >
                        <Link
                            href="/"
                            className="hover:text-white/80 transition-colors duration-200"
                        >
                            {t('nav.home')}
                        </Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-white/80">{t('jurusan.index_breadcrumb')}</span>
                    </motion.nav>

                    {/* Eyebrow */}
                    <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-gold-500" />
                        <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase font-sans">
                            {t('jurusan.index_school')}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif text-display-lg lg:text-display-xl font-bold text-white leading-tight mb-6"
                    >
                        {t('jurusan.index_title')}
                    </motion.h1>

                    {/* Sub */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg lg:text-xl text-white/70 font-sans leading-relaxed max-w-xl"
                    >
                        {t('jurusan.index_subtitle')}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Grid Jurusan Section ─────────────────────────────────────────────────────
interface GridSectionProps {
    jurusan: Jurusan[];
}

function GridJurusanSection({ jurusan }: GridSectionProps) {
    const { t } = useTranslation();
    return (
        <section className="py-20 lg:py-28 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Section header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-block text-gold-500 text-sm font-semibold tracking-widest uppercase mb-4">
                        {t('jurusan.index_programs_badge')}
                    </span>
                    <h2 className="font-serif text-display-md lg:text-display-lg font-bold text-primary-900 mb-4">
                        {t('jurusan.index_programs_heading')}
                    </h2>
                    <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
                        {t('jurusan.index_programs_desc')}
                    </p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {jurusan.map((item) => (
                        <motion.div key={item.id} variants={fadeInUp}>
                            <JurusanCard
                                jurusan={{
                                    kode:        item.kode,
                                    slug:        item.slug,
                                    nama:        item.nama,
                                    tagline:     item.tagline ?? '',
                                    color_start: item.color_start,
                                    color_end:   item.color_end,
                                    icon_name:   item.icon_name ?? 'GraduationCap',
                                }}
                                className="h-full min-h-[280px]"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty state */}
                {jurusan.length === 0 && (
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="text-center py-20"
                    >
                        <BookOpen
                            className="mx-auto mb-4 text-neutral-300"
                            size={48}
                            strokeWidth={1.5}
                        />
                        <p className="text-neutral-500 text-lg">
                            {t('jurusan.index_empty')}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection() {
    const { t } = useTranslation();
    return (
        <section className="py-20 lg:py-28 bg-primary-900 relative overflow-hidden">
            <GeometricPattern />

            {/* Glow accents */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]
                           bg-gradient-to-r from-transparent via-gold-500/40 to-transparent"
            />
            <div
                aria-hidden="true"
                className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64
                           bg-primary-600/50 rounded-full blur-3xl pointer-events-none"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-8 h-px bg-gold-500" />
                        <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
                            {t('jurusan.index_need_help')}
                        </span>
                        <div className="w-8 h-px bg-gold-500" />
                    </motion.div>

                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-display-md lg:text-display-lg font-bold text-white mb-4 leading-tight"
                    >
                        {t('jurusan.index_cta_heading')}
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-white/70 text-lg leading-relaxed mb-10"
                    >
                        {t('jurusan.index_cta_desc')}
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/kontak"
                            id="cta-hubungi-kami"
                            className="inline-flex justify-center items-center w-full sm:w-auto gap-2 px-8 py-4 bg-gold-500 text-white
                                       font-semibold rounded-xl hover:bg-gold-600 transition-all duration-200
                                       shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 hover:-translate-y-0.5 min-h-11"
                        >
                            {t('jurusan.index_cta_button')}
                            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function JurusanIndex({ jurusan, seo }: Props) {
    const { pengaturan } = usePage<SharedProps>().props;

    return (
        <PublicLayout>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:site_name" content={pengaturan.site_name} />
            </Head>

            <HeroSection />
            <GridJurusanSection jurusan={jurusan} />
            <CTASection />
        </PublicLayout>
    );
}
