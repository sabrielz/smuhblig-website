import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
    ArrowRight,
    Briefcase,
    Check,
    ChevronRight,
    Monitor,
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { fadeInUp, staggerContainer, slideFromLeft, slideFromRight, scaleIn } from '@/lib/motion';
import type { SharedProps, Jurusan } from '@/types';

interface Props {
    jurusan: Jurusan;
    seo: {
        title: string;
        description: string;
    };
}

// ─── Helper: Resolve Lucide Icon ─────────────────────────────────────────────
function resolveIcon(name: string | null, size = 24): React.ReactElement {
    const IconComponent = (
        name ? (Icons[name as keyof typeof Icons] as React.ElementType) : null
    ) ?? Icons.GraduationCap;

    return <IconComponent size={size} strokeWidth={1.5} />;
}

// ─── Geometric Pattern ────────────────────────────────────────────────────────
function GeometricPattern({ opacity = '0.04' }: { opacity?: string }) {
    return (
        <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="geo-detail"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                >
                    <polygon
                        points="30,2 35,22 55,22 40,34 46,54 30,42 14,54 20,34 5,22 25,22"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.8"
                    />
                    <rect
                        x="20"
                        y="20"
                        width="20"
                        height="20"
                        transform="rotate(45 30 30)"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.6"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo-detail)" />
        </svg>
    );
}

// ─── Section 1 — Hero ─────────────────────────────────────────────────────────
interface HeroProps {
    jurusan: Jurusan;
}

function HeroJurusan({ jurusan }: HeroProps) {
    return (
        <section
            className="relative min-h-[70vh] flex items-center overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${jurusan.color_start} 0%, ${jurusan.color_end} 100%)`,
            }}
        >
            <GeometricPattern opacity="0.05" />

            {/* Ambient glows */}
            <div
                aria-hidden="true"
                className="absolute -top-40 right-0 w-[700px] h-[700px] bg-white/5 rounded-full blur-3xl pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative py-28 lg:py-36">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Breadcrumb */}
                    <motion.nav
                        variants={fadeInUp}
                        className="flex items-center gap-2 text-white/50 text-sm mb-10"
                        aria-label="Breadcrumb"
                    >
                        <Link href="/" className="hover:text-white/80 transition-colors duration-200">
                            Beranda
                        </Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                        <Link href="/jurusan" className="hover:text-white/80 transition-colors duration-200">
                            Jurusan
                        </Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-white/80">{jurusan.nama}</span>
                    </motion.nav>

                    {/* Icon besar */}
                    <motion.div
                        variants={scaleIn}
                        className="mb-8 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm
                                   border border-white/20 flex items-center justify-center"
                    >
                        <span className="text-white/40">
                            {resolveIcon(jurusan.icon_name, 40)}
                        </span>
                    </motion.div>

                    {/* Kode jurusan */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-white/50 text-sm font-mono tracking-widest uppercase mb-4"
                    >
                        {jurusan.kode}
                    </motion.p>

                    {/* Nama jurusan */}
                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif text-display-md lg:text-display-xl font-bold
                                   text-white leading-tight max-w-3xl mb-5"
                    >
                        {jurusan.nama}
                    </motion.h1>

                    {/* Tagline */}
                    {jurusan.tagline && (
                        <motion.p
                            variants={fadeInUp}
                            className="text-white/80 text-lg lg:text-xl italic leading-relaxed max-w-2xl"
                        >
                            {jurusan.tagline}
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Section 2 — Deskripsi ────────────────────────────────────────────────────
interface DeskripsiProps {
    jurusan: Jurusan;
}

function DeskripsiSection({ jurusan }: DeskripsiProps) {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                    {/* Teks: 60% */}
                    <motion.div
                        variants={slideFromLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-3"
                    >
                        <span className="inline-block text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-5">
                            Tentang Program
                        </span>
                        <h2 className="font-serif text-display-md font-bold text-[#001f4d] mb-6 leading-tight">
                            Mengenal Lebih Dalam
                        </h2>
                        {jurusan.deskripsi_lengkap ? (
                            <div
                                className="prose prose-lg prose-neutral max-w-none
                                           text-[#636366] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: jurusan.deskripsi_lengkap }}
                            />
                        ) : (
                            <p className="text-[#636366] text-lg leading-relaxed">
                                {jurusan.deskripsi_singkat ??
                                    'Informasi program keahlian akan segera diperbarui.'}
                            </p>
                        )}
                    </motion.div>

                    {/* Foto/Placeholder: 40% */}
                    <motion.div
                        variants={slideFromRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        {jurusan.cover_image ? (
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                                <img
                                    src={jurusan.cover_image}
                                    alt={`Cover ${jurusan.nama}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient overlay bawah */}
                                <div
                                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
                                />
                            </div>
                        ) : (
                            /* Placeholder dengan warna jurusan */
                            <div
                                className="relative rounded-2xl aspect-[4/3] flex flex-col items-center
                                           justify-center shadow-2xl overflow-hidden"
                                style={{
                                    background: `linear-gradient(135deg, ${jurusan.color_start} 0%, ${jurusan.color_end} 100%)`,
                                }}
                            >
                                <GeometricPattern opacity="0.06" />
                                <span className="text-white/20 relative z-10">
                                    {resolveIcon(jurusan.icon_name, 80)}
                                </span>
                                <p className="text-white/40 text-sm font-mono tracking-widest mt-4 relative z-10">
                                    {jurusan.kode}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ─── Section 3 — Kompetensi ───────────────────────────────────────────────────
interface KompetensiProps {
    kompetensi: string[];
}

function KompetensiSection({ kompetensi }: KompetensiProps) {
    if (!kompetensi.length) return null;

    return (
        <section className="py-20 lg:py-28 bg-[#f8f9fa]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
                        Kurikulum
                    </span>
                    <h2 className="font-serif text-display-md font-bold text-[#001f4d]">
                        Kompetensi yang Dipelajari
                    </h2>
                </motion.div>

                {/* Grid kompetensi */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {kompetensi.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeInUp}
                            className="flex items-start gap-4 bg-white border-l-4 border-[#c9a84c]
                                       rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div
                                className="flex-shrink-0 w-7 h-7 rounded-full bg-[#c9a84c]/10
                                           flex items-center justify-center mt-0.5"
                            >
                                <Check className="w-4 h-4 text-[#c9a84c]" strokeWidth={2} />
                            </div>
                            <p className="text-[#111111] text-sm font-medium leading-relaxed">
                                {item}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Section 4 — Prospek Karir ────────────────────────────────────────────────
interface ProspekProps {
    prospek_karir: string[];
}

function ProspekSection({ prospek_karir }: ProspekProps) {
    if (!prospek_karir.length) return null;

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
                        Peluang Kerja
                    </span>
                    <h2 className="font-serif text-display-md font-bold text-[#001f4d]">
                        Prospek Karir Lulusan
                    </h2>
                </motion.div>

                {/* Pills */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    {prospek_karir.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={scaleIn}
                            className="flex items-center gap-3 px-6 py-3 rounded-full
                                       border-2 border-[#003f87] text-[#003f87] bg-white
                                       hover:bg-[#eef5fc] transition-colors duration-200
                                       shadow-sm hover:shadow-md"
                        >
                            <Briefcase className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                            <span className="text-sm font-semibold whitespace-nowrap">{item}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Section 5 — Fasilitas ────────────────────────────────────────────────────
interface FasilitasProps {
    fasilitas: string[];
    colorStart: string;
    colorEnd: string;
}

function FasilitasSection({ fasilitas, colorStart, colorEnd }: FasilitasProps) {
    if (!fasilitas.length) return null;

    return (
        <section className="py-20 lg:py-28 bg-[#f8f9fa]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
                        Sarana & Prasarana
                    </span>
                    <h2 className="font-serif text-display-md font-bold text-[#001f4d]">
                        Fasilitas Pembelajaran
                    </h2>
                </motion.div>

                {/* Grid fasilitas */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {fasilitas.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={scaleIn}
                            className="flex flex-col items-center text-center gap-4 p-6
                                       bg-white rounded-2xl border border-[#e5e5ea]
                                       shadow-sm hover:shadow-md transition-all duration-300
                                       hover:-translate-y-1 group"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center
                                           transition-colors duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colorStart}20 0%, ${colorEnd}30 100%)`,
                                }}
                            >
                                <Monitor
                                    className="w-6 h-6 transition-colors duration-300"
                                    strokeWidth={1.5}
                                    style={{ color: colorStart }}
                                />
                            </div>
                            <p className="text-[#111111] text-sm font-semibold leading-tight">
                                {item}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Section 6 — CTA ─────────────────────────────────────────────────────────
interface CTAProps {
    nama: string;
    spmbUrl: string;
}

function CTASection({ nama, spmbUrl }: CTAProps) {
    return (
        <section className="py-20 lg:py-28 bg-[#001f4d] relative overflow-hidden">
            <GeometricPattern opacity="0.04" />

            {/* Top line accent */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]
                           bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent"
            />

            {/* Side glow */}
            <div
                aria-hidden="true"
                className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64
                           bg-[#003f87]/50 rounded-full blur-3xl pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64
                           bg-[#003f87]/40 rounded-full blur-3xl pointer-events-none"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="w-8 h-px bg-[#c9a84c]" />
                        <span className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase">
                            Gabung Sekarang
                        </span>
                        <div className="w-8 h-px bg-[#c9a84c]" />
                    </motion.div>

                    <motion.h2
                        variants={fadeInUp}
                        className="font-serif text-display-md lg:text-display-lg font-bold
                                   text-white leading-tight mb-4"
                    >
                        Tertarik Bergabung di{' '}
                        <span className="text-[#c9a84c]">Jurusan {nama}</span>?
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-white/70 text-lg leading-relaxed mb-10"
                    >
                        Daftarkan diri Anda sekarang dan wujudkan impian bersama kami.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {/* Gold CTA */}
                        <a
                            href={spmbUrl}
                            id="cta-daftar-sekarang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-white
                                       font-semibold rounded-xl hover:bg-[#a8821f] transition-all duration-200
                                       shadow-lg shadow-[#c9a84c]/20 hover:shadow-[#c9a84c]/30 hover:-translate-y-0.5"
                        >
                            Daftar Sekarang
                            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                        </a>

                        {/* Outline CTA */}
                        <Link
                            href="/jurusan"
                            id="cta-lihat-jurusan-lain"
                            className="inline-flex items-center gap-2 px-8 py-4 text-white
                                       font-semibold rounded-xl border-2 border-white/30
                                       hover:bg-white/10 hover:border-white/50 transition-all duration-200"
                        >
                            Lihat Jurusan Lain
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function JurusanShow({ jurusan, seo }: Props) {
    const { pengaturan } = usePage<SharedProps>().props;

    // Ambil spmb_url dari pengaturan, fallback ke /kontak
    const spmbUrl =
        (pengaturan as unknown as Record<string, string>)['spmb_url'] ?? '/kontak';

    return (
        <PublicLayout>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:site_name" content={pengaturan.site_name} />
                {jurusan.cover_image && (
                    <meta property="og:image" content={jurusan.cover_image} />
                )}
            </Head>

            {/* S1 — Hero */}
            <HeroJurusan jurusan={jurusan} />

            {/* S2 — Deskripsi */}
            <DeskripsiSection jurusan={jurusan} />

            {/* S3 — Kompetensi */}
            {jurusan.kompetensi && jurusan.kompetensi.length > 0 && (
                <KompetensiSection kompetensi={jurusan.kompetensi} />
            )}

            {/* S4 — Prospek Karir */}
            {jurusan.prospek_karir && jurusan.prospek_karir.length > 0 && (
                <ProspekSection prospek_karir={jurusan.prospek_karir} />
            )}

            {/* S5 — Fasilitas */}
            {jurusan.fasilitas && jurusan.fasilitas.length > 0 && (
                <FasilitasSection
                    fasilitas={jurusan.fasilitas}
                    colorStart={jurusan.color_start}
                    colorEnd={jurusan.color_end}
                />
            )}

            {/* S6 — CTA */}
            <CTASection nama={jurusan.nama} spmbUrl={spmbUrl} />
        </PublicLayout>
    );
}
