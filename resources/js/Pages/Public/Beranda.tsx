import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronDown, ArrowRight, Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { JurusanCard } from '@/Components/UI/JurusanCard';
import { ArticleCard } from '@/Components/UI/ArticleCard';
import { Button } from '@/Components/UI/Button';
import { fadeInUp, staggerContainer, heroStagger, scaleIn, fadeIn } from '@/lib/motion';
import { SharedProps } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface JurusanItem {
    kode: string;
    slug: string;
    nama: string;
    tagline: string;
    deskripsi: string;
    color_start: string;
    color_end: string;
    icon_name: string;
}

interface ArticleItem {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    thumbnail: string;
    published_at: string;
    category: { name: string; color: string };
    author: { name: string; avatar: string };
}

interface Statistik {
    totalSiswa: number;
    totalLulusan: number;
    pengajar: number;
    tahunBerdiri: number;
}

interface Pengaturan {
    site_name: string;
    tagline: string;
    spmb_url: string;
}

interface BerandaProps {
    jurusan?: JurusanItem[];
    beritaTerbaru?: ArticleItem[];
    statistik?: Statistik;
    pengaturan?: Pengaturan;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    useEffect(() => {
        if (!inView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), value);
            setCount(current);
            if (current >= value) clearInterval(timer);
        }, duration / steps);

        return () => clearInterval(timer);
    }, [inView, value]);

    return (
        <span ref={ref}>
            {count.toLocaleString('id-ID')}{suffix}
        </span>
    );
}

// ─── Islamic Geometric Pattern SVG ───────────────────────────────────────────

function IslamicPattern({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <pattern id="islamic-star" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    {/* 8-pointed star */}
                    <polygon
                        points="25,5 30,18 43,13 38,26 51,31 38,36 43,49 30,44 25,57 20,44 7,49 12,36 -1,31 12,26 7,13 20,18"
                        fill="currentColor"
                        transform="translate(0,-6)"
                    />
                    <polygon
                        points="25,5 30,18 43,13 38,26 51,31 38,36 43,49 30,44 25,57 20,44 7,49 12,36 -1,31 12,26 7,13 20,18"
                        fill="currentColor"
                        transform="translate(50,0) rotate(22.5, 25, 25)"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-star)" />
        </svg>
    );
}

// ─── Geometric Pattern SVG (Islamic-inspired, very subtle) ───────────────────

const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-beranda" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-beranda)" />
    </svg>
);

// ─── Stat Item ────────────────────────────────────────────────────────────────

interface StatItemProps {
    value: number;
    suffix?: string;
    label: string;
    icon: React.ReactNode;
}

function StatItem({ value, suffix = '+', label, icon }: StatItemProps) {
    return (
        <motion.div
            variants={scaleIn}
            className="flex flex-col items-center text-center px-6 py-8"
        >
            <div className="mb-4 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                {icon}
            </div>
            <div className="font-serif text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                <AnimatedCounter value={value} suffix={suffix} />
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                {label}
            </p>
        </motion.div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label, title, subtitle, light = false }: {
    label: string;
    title: string;
    subtitle?: string;
    light?: boolean;
}) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
        >
            <motion.span
                variants={fadeInUp}
                className={`inline-block font-mono text-xs tracking-[0.3em] uppercase mb-4 ${light ? 'text-[#c9a84c]' : 'text-[#003f87]'}`}
            >
                {label}
            </motion.span>
            <motion.h2
                variants={fadeInUp}
                className={`font-serif text-4xl lg:text-5xl font-bold tracking-tight ${light ? 'text-white' : 'text-[#111111]'}`}
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    variants={fadeInUp}
                    className={`mt-4 text-lg max-w-2xl mx-auto ${light ? 'text-white/70' : 'text-[#636366]'}`}
                >
                    {subtitle}
                </motion.p>
            )}
        </motion.div>
    );
}

// ─── Section Divider ──────────────────────────────────────────────────────────

function SectionDivider() {
    return (
        <div className="relative flex items-center justify-center py-0">
            <div className="absolute inset-x-0 top-1/2 border-t border-[#c9a84c]/20" />
            <div className="relative z-10 bg-inherit px-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#c9a84c]/40">
                    <path d="M8 0L9.5 5.5H16L10.8 8.9L12.7 14.5L8 11.1L3.3 14.5L5.2 8.9L0 5.5H6.5L8 0Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Beranda({
    jurusan = [],
    beritaTerbaru = [],
    statistik = { totalSiswa: 0, totalLulusan: 0, pengajar: 0, tahunBerdiri: 2003 },
}: BerandaProps) {
    const { pengaturan } = usePage<SharedProps>().props;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const heroImageY = useTransform(scrollY, [0, 600], [0, -120]);
    const tahunPengabdian = new Date().getFullYear() - statistik.tahunBerdiri;

    return (
        <PublicLayout>
            <Head title="Beranda — SMK Muhammadiyah Bligo" />

            {/* ══════════════════════════════════════════════════════════════
                SECTION 1 — HERO
            ══════════════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                id="beranda-hero"
                className="relative min-h-screen flex items-center overflow-hidden"
                aria-label="Hero section"
            >
                {/* Background Image with Parallax */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ y: heroImageY }}
                >
                    <img
                        src="https://picsum.photos/seed/smkmuhbligo/1920/1080"
                        alt="SMK Muhammadiyah Bligo"
                        className="w-full h-full object-cover scale-110"
                        loading="eager"
                    />
                </motion.div>

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(to right, rgba(0,31,77,0.92) 0%, rgba(0,63,135,0.72) 55%, transparent 100%)'
                    }}
                />

                {/* Islamic Geometric Pattern - Right Side */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 z-10 pointer-events-none overflow-hidden">
                    <IslamicPattern className="w-full h-full text-white opacity-[0.04]" />
                </div>

                {/* Hero Content */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                    <motion.div
                        variants={heroStagger}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl"
                    >
                        {/* Eyebrow */}
                        <motion.div variants={fadeInUp} className="mb-6">
                            <span
                                className="font-mono text-xs tracking-[0.3em] uppercase"
                                style={{ color: '#c9a84c' }}
                            >
                                SMK MUHAMMADIYAH BLIGO
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-serif font-bold text-white leading-tight mb-6"
                            style={{
                                fontFamily: 'Playfair Display, Georgia, serif',
                                fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                                lineHeight: '1.1',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Mencetak Generasi<br />
                            <span style={{ color: '#c9a84c' }}>Unggul</span> dan<br />
                            Berakhlak Mulia
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg max-w-lg mb-10 leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.80)' }}
                        >
                            Sekolah Menengah Kejuruan berbasis nilai Islam, menyiapkan lulusan siap
                            kerja, berkarakter, dan berdaya saing global.
                        </motion.p>

                        {/* CTA Row */}
                        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                            <a
                                href={pengaturan.spmb_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="hero-cta-daftar"
                                className="inline-flex items-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-8 py-4 text-lg rounded-xl text-white hover:opacity-90 focus:ring-[#c9a84c]/50 shadow-lg hover:shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #a8821f 100%)' }}
                            >
                                Daftar Sekarang
                                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                            </a>

                            <Link
                                href="/jurusan"
                                id="hero-cta-jurusan"
                                className="inline-flex items-center gap-2 font-semibold transition-all duration-200 px-8 py-4 text-lg rounded-xl text-white border-2 border-white/60 hover:bg-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                Lihat Jurusan
                            </Link>
                        </motion.div>

                        {/* Gold Divider Line */}
                        <motion.div
                            variants={fadeIn}
                            className="mt-12 flex items-center gap-4"
                        >
                            <div className="h-px w-12 bg-[#c9a84c]/60" />
                            <span className="text-xs text-white/40 tracking-widest uppercase">Berdiri sejak {statistik.tahunBerdiri}</span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                    aria-hidden="true"
                >
                    <span className="text-white/40 text-xs tracking-widest uppercase font-mono">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-6 h-6 text-white/50" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 2 — STATISTIK
            ══════════════════════════════════════════════════════════════ */}
            <section id="beranda-statistik" aria-label="Statistik sekolah" className="relative" style={{ background: '#003f87' }}>
                {/* Fullsize Subtle pattern overlay */}
                <GeometricPattern />
                {/* Top separator */}
                <div className="relative h-16 overflow-hidden">
                    <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full" style={{ fill: '#003f87' }}>
                        <path d="M0,64 L0,32 Q360,0 720,32 Q1080,64 1440,32 L1440,64 Z" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pb-20">
                    <div className="relative">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            className="relative grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10"
                        >
                            <StatItem
                                value={statistik.totalSiswa}
                                suffix="+"
                                label="Siswa Aktif"
                                icon={<Users className="w-6 h-6 text-[#c9a84c]" strokeWidth={1.5} />}
                            />
                            <StatItem
                                value={statistik.totalLulusan}
                                suffix="+"
                                label="Alumni Berprestasi"
                                icon={<GraduationCap className="w-6 h-6 text-[#c9a84c]" strokeWidth={1.5} />}
                            />
                            <StatItem
                                value={statistik.pengajar}
                                suffix="+"
                                label="Tenaga Pengajar"
                                icon={<BookOpen className="w-6 h-6 text-[#c9a84c]" strokeWidth={1.5} />}
                            />
                            <StatItem
                                value={tahunPengabdian}
                                suffix=""
                                label="Tahun Pengabdian"
                                icon={<Calendar className="w-6 h-6 text-[#c9a84c]" strokeWidth={1.5} />}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Bottom separator */}
                <div className="relative h-16 overflow-hidden" style={{ background: '#f8f9fa' }}>
                    <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="absolute top-0 w-full h-full" style={{ fill: '#003f87' }}>
                        <path d="M0,0 L0,32 Q360,64 720,32 Q1080,0 1440,32 L1440,0 Z" />
                    </svg>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 3 — JURUSAN
            ══════════════════════════════════════════════════════════════ */}
            <section
                id="beranda-jurusan"
                className="py-20 lg:py-28"
                style={{ background: '#f8f9fa' }}
                aria-label="Program keahlian"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                    <SectionHeader
                        label="PROGRAM KEAHLIAN"
                        title="Lima Jurusan, Satu Visi"
                        subtitle="Temukan program keahlian yang sesuai dengan bakat dan passion Anda. Setiap jurusan dirancang untuk menghasilkan lulusan yang kompeten dan siap bersaing."
                    />

                    {/* Grid 3+2 layout */}
                    {jurusan.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            {/* Row 1: max 3 cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {jurusan.slice(0, 3).map((j) => (
                                    <motion.div key={j.kode} variants={fadeInUp}>
                                        <JurusanCard jurusan={j} className="h-64 lg:h-72" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Row 2: remaining cards centered */}
                            {jurusan.length > 3 && (
                                <div className="flex justify-center">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-2/3">
                                        {jurusan.slice(3).map((j) => (
                                            <motion.div key={j.kode} variants={fadeInUp}>
                                                <JurusanCard jurusan={j} className="h-64 lg:h-72" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 text-[#636366]">
                            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>Jurusan belum tersedia.</p>
                        </div>
                    )}

                    {/* CTA link Semua Jurusan */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/jurusan"
                            id="jurusan-lihat-semua"
                            className="inline-flex items-center gap-2 font-semibold text-[#003f87] hover:text-[#001f4d] transition-colors group"
                        >
                            Lihat Semua Program Keahlian
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <SectionDivider />

            {/* ══════════════════════════════════════════════════════════════
                SECTION 4 — BERITA TERBARU
            ══════════════════════════════════════════════════════════════ */}
            <section
                id="beranda-berita"
                className="py-20 lg:py-28 bg-white"
                aria-label="Berita terkini"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                    <SectionHeader
                        label="BERITA & INFORMASI"
                        title="Kabar Terkini dari SMK Muhammadiyah Bligo"
                        subtitle="Ikuti perkembangan terbaru, prestasi, dan kegiatan sekolah kami."
                    />

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
                        <div className="text-center py-16 text-[#636366]">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>Belum ada berita yang dipublikasikan.</p>
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
                            <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-5 h-5" strokeWidth={1.5} />}>
                                Lihat Semua Berita
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 5 — CTA AKHIR
            ══════════════════════════════════════════════════════════════ */}
            <section
                id="beranda-cta"
                className="relative overflow-hidden py-28 lg:py-36"
                aria-label="Call to action pendaftaran"
            >
                {/* Gradient background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: 'linear-gradient(135deg, #001f4d 0%, #003f87 50%, #002d6b 100%)'
                    }}
                />

                {/* Geometric pattern overlay */}
                <GeometricPattern />

                {/* Decorative orbs */}
                <div
                    className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl z-10 pointer-events-none"
                    style={{ background: 'rgba(201,168,76,0.12)' }}
                />
                <div
                    className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl z-10 pointer-events-none"
                    style={{ background: 'rgba(0,80,168,0.25)' }}
                />

                {/* Gold top line */}
                <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

                <div className="relative z-20 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {/* Label */}
                        <motion.span
                            variants={fadeInUp}
                            className="inline-block font-mono text-xs tracking-[0.3em] uppercase mb-6"
                            style={{ color: '#c9a84c' }}
                        >
                            PENERIMAAN PESERTA DIDIK BARU
                        </motion.span>

                        {/* Headline */}
                        <motion.h2
                            variants={fadeInUp}
                            className="font-serif font-bold text-white mb-6"
                            style={{
                                fontFamily: 'Playfair Display, Georgia, serif',
                                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                                lineHeight: '1.15',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Siap Bergabung<br />
                            <span style={{ color: '#c9a84c' }}>Bersama Kami?</span>
                        </motion.h2>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                            Daftarkan putra-putri Anda sekarang dan jadilah bagian dari keluarga besar
                            SMK Muhammadiyah Bligo. Masa depan gemilang dimulai dari sini.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={pengaturan.spmb_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="cta-mulai-pendaftaran"
                                className="inline-flex items-center gap-3 font-semibold transition-all duration-200 px-10 py-5 text-xl rounded-2xl text-white shadow-2xl hover:shadow-[#c9a84c]/30 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50 focus:ring-offset-2 focus:ring-offset-transparent"
                                style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #a8821f 100%)' }}
                            >
                                Mulai Pendaftaran
                                <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                            </a>

                            <Link
                                href="/tentang"
                                id="cta-pelajari-lebih"
                                className="inline-flex items-center gap-2 font-semibold transition-all duration-200 px-10 py-5 text-xl rounded-2xl text-white border-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                                style={{ borderColor: 'rgba(255,255,255,0.45)' }}
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            variants={fadeInUp}
                            className="mt-14 flex flex-wrap items-center justify-center gap-8"
                        >
                            {[
                                { value: 'Terakreditasi', label: 'Nasional' },
                                { value: 'ISO', label: 'Bersertifikat' },
                                { value: '100%', label: 'Lulusan Terserap' },
                            ].map(({ value, label }) => (
                                <div key={value} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />
                                    <span className="text-white font-semibold">{value}</span>
                                    <span className="text-white/50 text-sm">{label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Gold bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 z-20" style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
            </section>
        </PublicLayout>
    );
}
