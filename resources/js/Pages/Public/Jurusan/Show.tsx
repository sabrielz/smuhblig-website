import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
    ArrowRight, Briefcase, CheckCircle2, ChevronRight,
    Award, Users, Clock, X, ChevronLeft, Image as ImageIcon
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { fadeInUp, staggerContainer, slideFromLeft, slideFromRight, scaleIn } from '@/lib/motion';
import { JurusanCard } from '@/Components/UI/JurusanCard';
import { cn } from '@/lib/utils';
import type { SharedProps } from '@/types';

// Definition of the Jurusan type locally if not fully typed in types.d.ts
interface JurusanData {
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
}

interface Props {
    jurusan: { data: JurusanData };
    jurusanLain: JurusanData[];
    pengaturan: {
        spmb_url: string;
    };
}

function resolveIcon(name: string | null, size = 20, className = ''): React.ReactElement {
    const IconComponent = (
        name && Icons[name as keyof typeof Icons] ? Icons[name as keyof typeof Icons] : Icons.GraduationCap
    ) as React.ElementType;

    return <IconComponent size={size} strokeWidth={1.5} className={className} />;
}

// EmptryState
function EmptyState({ title, className = '' }: { title: string, className?: string }) {
    return (
        <div className={cn("p-8 rounded-xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-[150px]", className)}>
            <p className="text-gray-400 font-medium">{title}</p>
        </div>
    );
}

export default function JurusanShow({ jurusan: response, jurusanLain, pengaturan }: Props) {
    const { pengaturan: globalSettings } = usePage<SharedProps>().props;
    const jurusan = response.data;

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % jurusan.gallery_images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + jurusan.gallery_images.length) % jurusan.gallery_images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);

    const hasCover = !!jurusan.cover_image;
    const heroGradient = hasCover
        ? `linear-gradient(to right, ${jurusan.color_start}E6 0%, ${jurusan.color_start}66 100%)`
        : `linear-gradient(to bottom right, ${jurusan.color_start}, ${jurusan.color_end})`;

    const spmbUrl = pengaturan.spmb_url && pengaturan.spmb_url !== '#' ? pengaturan.spmb_url : '/kontak';

    return (
        <PublicLayout>
            <Head>
                {/* Meta details are dynamically handled by controller SEOTools, but Inertia <Head> overrides if needed */}
                <title>{`${jurusan.nama} - SMK Muhammadiyah Bligo`}</title>
            </Head>

            {/* --- SECTION 1: HERO JURUSAN --- */}
            <section
                className="relative min-h-[70vh] lg:min-h-screen flex items-end overflow-hidden pb-16 pt-32 lg:pb-24 bg-[#002f5d]"
            >
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

                {/* Breadcrumb Sticky Navbar Offset */}
                <nav className="absolute top-24 left-4 lg:left-8 z-20 flex items-center text-xs lg:text-sm text-white/60">
                    <Link href="/" className="hover:text-white transition">Beranda</Link>
                    <span className="mx-2">/</span>
                    <Link href="/jurusan" className="hover:text-white transition">Jurusan</Link>
                    <span className="mx-2">/</span>
                    <span className="text-white/80">{jurusan.nama}</span>
                </nav>

                <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        {/* Main Hero Content */}
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
                                    style={{ backgroundColor: jurusan.color_start, color: '#ffffff' }}
                                >
                                    Daftar Sekarang
                                </a>
                                <button
                                    disabled
                                    className="px-6 py-3 rounded-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all opacity-50 cursor-not-allowed hidden sm:inline-flex"
                                >
                                    Unduh Brosur
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

            {/* --- SECTION 2: OVERVIEW --- */}
            <section className="py-20 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        <div className="lg:col-span-7 order-2 lg:order-1">
                            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                <motion.span variants={fadeInUp} className="text-sm font-semibold tracking-widest text-neutral-400 uppercase mb-4 block">
                                    Tentang Program
                                </motion.span>
                                <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold text-[#001f4d] mb-8">
                                    Apa itu {jurusan.nama}?
                                </motion.h2>

                                {jurusan.deskripsi_lengkap ? (
                                    <motion.div
                                        variants={fadeInUp}
                                        className="prose prose-lg prose-neutral max-w-none prose-headings:text-[#001f4d] prose-a:text-[#c9a84c] mb-10"
                                        dangerouslySetInnerHTML={{ __html: jurusan.deskripsi_lengkap }}
                                    />
                                ) : (
                                    <motion.p variants={fadeInUp} className="text-neutral-600 text-lg leading-relaxed mb-10">
                                        {jurusan.deskripsi_singkat}
                                    </motion.p>
                                )}

                                <motion.div variants={staggerContainer} className="flex flex-col sm:flex-row gap-6">
                                    {jurusan.akreditasi && (
                                        <motion.div variants={fadeInUp} className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: jurusan.color_start }}>
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Akreditasi</div>
                                                <div className="text-lg font-bold text-gray-900">{jurusan.akreditasi}</div>
                                            </div>
                                        </motion.div>
                                    )}
                                    {jurusan.lama_pendidikan && (
                                        <motion.div variants={fadeInUp} className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: jurusan.color_start }}>
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Lama Pendidikan</div>
                                                <div className="text-lg font-bold text-gray-900">{jurusan.lama_pendidikan}</div>
                                            </div>
                                        </motion.div>
                                    )}
                                    {jurusan.total_siswa > 0 && (
                                        <motion.div variants={fadeInUp} className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: jurusan.color_start }}>
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Siswa</div>
                                                <div className="text-lg font-bold text-gray-900">{jurusan.total_siswa} <span className="text-sm font-normal text-gray-500">Siswa Aktif</span></div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-5 order-1 lg:order-2">
                            <motion.div
                                variants={slideFromRight}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl"
                            >
                                {jurusan.cover_image ? (
                                    <img src={jurusan.cover_image} alt={jurusan.nama} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(-45deg, ${jurusan.color_start}, ${jurusan.color_end})` }}>
                                        {resolveIcon(jurusan.icon_name, 120, "text-white/20")}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: KOMPETENSI --- */}
            <section className="py-20 bg-[#f8f9fa]">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-[#c9a84c] uppercase mb-4 block">
                            Yang Akan Dipelajari
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#001f4d]">
                            Kompetensi Keahlian
                        </h2>
                    </motion.div>

                    {jurusan.kompetensi?.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {jurusan.kompetensi.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.3 }}
                                    className="bg-transparent hover:bg-white border-b border-gray-200 hover:border-transparent rounded-xl px-5 py-6 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                                >
                                    <span className="font-mono text-xs opacity-40 font-bold block pt-1" style={{ color: jurusan.color_start }}>
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <p className="font-medium text-neutral-800 text-base leading-relaxed">{item}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState title="Konten kompetensi sedang disiapkan." />
                    )}
                </div>
            </section>

            {/* --- SECTION 4: PROSPEK KARIR --- */}
            <section className="py-24 relative overflow-hidden" style={{ backgroundColor: jurusan.color_start || '#001f4d' }}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-white/50 uppercase mb-4 block">
                            Setelah Lulus
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">
                            Prospek Karir Lulusan
                        </h2>
                    </motion.div>

                    {jurusan.prospek_karir?.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {jurusan.prospek_karir.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={scaleIn}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-6 py-5 border border-white/5 transition-all duration-300 flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-white leading-tight">{item}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState title="Konten prospek karir sedang disiapkan." className="border-white/20 text-white/50" />
                    )}
                </div>
            </section>

            {/* --- SECTION 5: FASILITAS --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-[#c9a84c] uppercase mb-4 block">
                            Fasilitas
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#001f4d]">
                            Sarana & Prasarana Pembelajaran
                        </h2>
                    </motion.div>

                    {jurusan.fasilitas?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
                            {jurusan.fasilitas.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                                    <div className="shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-5 h-5" style={{ color: jurusan.color_start }} />
                                    </div>
                                    <p className="text-gray-800 font-medium leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Konten fasilitas sedang disiapkan." />
                    )}
                </div>
            </section>

            {/* --- SECTION 6: GALERI FOTO --- */}
            {jurusan.gallery_images && jurusan.gallery_images.length > 0 && (
                <section className="py-20 bg-[#f8f9fa] border-t border-gray-200">
                    <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                            <span className="text-sm font-semibold tracking-widest text-[#c9a84c] uppercase mb-4 block">
                                Galeri
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#001f4d]">
                                Suasana Pembelajaran
                            </h2>
                        </motion.div>

                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {jurusan.gallery_images.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-zoom-in"
                                    onClick={() => openLightbox(idx)}
                                >
                                    <img src={src} alt={`Galeri ${idx + 1}`} className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- SECTION 7: JURUSAN LAIN + CTA --- */}
            <section className="pt-20">
                {/* Jurusan Lain */}
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl mb-24">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#001f4d]">
                                Program Keahlian Lainnya
                            </h2>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory">
                        {jurusanLain.map(other => (
                            <div key={other.id} className="min-w-[280px] sm:min-w-[320px] max-w-[350px] snap-start shrink-0">
                                <JurusanCard jurusan={other as any} className="h-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA Banner */}
                <div
                    className="py-24 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${jurusan.color_start}, #001f4d)` }}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Siap Bergabung di <br className="hidden md:block"/>{jurusan.nama}?
                        </h2>
                        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Tentukan karir masa depanmu bersama kami dan jadilah generasi unggul yang siap kerja.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={spmbUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-[#c9a84c] hover:bg-[#b89639] text-white text-lg font-bold rounded-xl shadow-xl transition-all hover:-translate-y-1"
                            >
                                Daftar Sekarang
                            </a>
                            <Link
                                href="/kontak"
                                className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white text-lg font-bold rounded-xl transition-all"
                            >
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIGHTBOX PORTAL */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
                        onClick={closeLightbox}
                    >
                        <div className="flex justify-between items-center p-4 lg:p-6 select-none shrink-0 text-white/50">
                            <div className="font-mono text-sm tracking-widest">{currentImageIndex + 1} / {jurusan.gallery_images.length}</div>
                            <button onClick={closeLightbox} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 relative flex items-center justify-center">
                            <button
                                onClick={prevImage}
                                className="absolute left-2 lg:left-8 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors z-10 hidden sm:block"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>

                            <img
                                src={jurusan.gallery_images[currentImageIndex]}
                                alt="Gallery Preview"
                                className="max-w-[95%] max-h-full object-contain mx-auto"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                onClick={nextImage}
                                className="absolute right-2 lg:right-8 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors z-10 hidden sm:block"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="p-4 shrink-0 text-center text-white/30 text-xs sm:hidden">
                            Geser layar atau tap sisi layar untuk navigasi // Tekan X untuk tutup
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PublicLayout>
    );
}
