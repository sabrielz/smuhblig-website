import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Star, Lightbulb, RefreshCw, ChevronRight, User, BookOpen, Users, Briefcase } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedProps, Pengaturan } from '@/types';
import {
    fadeInUp,
    fadeIn,
    staggerContainer,
    scaleIn,
    slideFromLeft,
    slideFromRight,
} from '@/lib/motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TentangProps {
    pengaturan: Pengaturan;
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

// ---------------------------------------------------------------------------
// Section 1 — Page Hero
// ---------------------------------------------------------------------------
const PageHero = () => (
    <section className="relative bg-[#001f4d] overflow-hidden min-h-[360px] flex items-center">
        <GeometricPattern />

        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003f87]/60 via-transparent to-[#001f4d]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-3xl"
            >
                {/* Eyebrow */}
                <motion.p
                    variants={fadeInUp}
                    className="text-xs font-bold tracking-[0.25em] uppercase text-[#c9a84c] mb-4"
                >
                    TENTANG KAMI
                </motion.p>

                {/* Headline */}
                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                >
                    Sejarah, Visi,{' '}
                    <span className="text-[#c9a84c]">dan Misi</span> Kami
                </motion.h1>

                {/* Breadcrumb */}
                <motion.nav
                    variants={fadeInUp}
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-white/60"
                >
                    <a href="/" className="hover:text-white transition-colors duration-200">
                        Beranda
                    </a>
                    <ChevronRight size={14} className="text-white/40" />
                    <span className="text-white/90">Tentang</span>
                </motion.nav>
            </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
);

// ---------------------------------------------------------------------------
// Section 2 — Profil Singkat
// ---------------------------------------------------------------------------
const highlights = [
    'Berdiri sejak 2003, kami telah mendidik ribuan generasi muda berdedikasi.',
    'Terakreditasi A oleh BAN-SM dengan standar mutu pendidikan nasional.',
    'Didukung 5 jurusan keahlian yang relevan dengan kebutuhan industri modern.',
];

const ProfilSection = () => (
    <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Teks */}
                <motion.div
                    variants={slideFromLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                        PROFIL SEKOLAH
                    </p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87] mb-6 leading-tight">
                        Mendidik Generasi Kompeten dan Berakhlak Mulia
                    </h2>
                    <p className="text-[#636366] text-lg leading-relaxed mb-6">
                        SMK Muhammadiyah Bligo adalah sekolah menengah kejuruan yang berada di bawah naungan
                        Pimpinan Daerah Muhammadiyah Kabupaten Batang, Jawa Tengah. Didirikan dengan semangat
                        amal usaha Muhammadiyah, kami berkomitmen menghadirkan pendidikan vokasional berkualitas
                        yang memadukan kecakapan teknis dengan pembentukan karakter Islami.
                    </p>
                    <p className="text-[#636366] text-base leading-relaxed mb-8">
                        Selama lebih dari empat dekade, SMK Muhammadiyah Bligo terus berkembang menjadi lembaga
                        pendidikan yang dipercaya oleh masyarakat. Lulusan kami tersebar di berbagai perusahaan
                        nasional dan mandiri dalam berwirausaha, membuktikan diri sebagai tenaga kerja yang
                        adaptif, produktif, dan berintegritas tinggi.
                    </p>

                    {/* Highlight 3 poin */}
                    <ul className="space-y-4">
                        {highlights.map((point, i) => (
                            <motion.li
                                key={i}
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="flex items-start gap-3"
                            >
                                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                                    <Check size={12} strokeWidth={2.5} className="text-[#c9a84c]" />
                                </span>
                                <span className="text-[#48484a] text-sm leading-relaxed">{point}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Right — Foto placeholder */}
                <motion.div
                    variants={slideFromRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#003f87] to-[#001f4d] flex items-center justify-center shadow-2xl">
                        {/* Placeholder ilustrasi */}
                        <div className="text-center text-white/30 p-8">
                            <svg
                                viewBox="0 0 120 100"
                                className="w-40 h-auto mx-auto mb-4 opacity-40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Foto gedung sekolah placeholder"
                            >
                                <rect x="10" y="40" width="100" height="55" rx="2" fill="white" fillOpacity="0.2" />
                                <rect x="18" y="50" width="18" height="20" rx="1" fill="white" fillOpacity="0.3" />
                                <rect x="42" y="50" width="18" height="20" rx="1" fill="white" fillOpacity="0.3" />
                                <rect x="66" y="50" width="18" height="20" rx="1" fill="white" fillOpacity="0.3" />
                                <rect x="90" y="50" width="13" height="20" rx="1" fill="white" fillOpacity="0.3" />
                                <rect x="44" y="70" width="14" height="25" rx="1" fill="white" fillOpacity="0.4" />
                                <polygon points="10,40 60,10 110,40" fill="white" fillOpacity="0.15" />
                                <polygon points="20,40 60,18 100,40" fill="white" fillOpacity="0.1" />
                            </svg>
                            <p className="text-sm font-medium text-white/50">Foto Gedung Sekolah</p>
                        </div>

                        {/* Decorative badge */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                            <p className="text-[10px] uppercase tracking-widest text-[#636366] mb-1">Berdiri Sejak</p>
                            <p className="text-2xl font-bold text-[#003f87] font-sans">1982</p>
                        </div>
                    </div>

                    {/* Gold accent border */}
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-3xl border-2 border-[#c9a84c]/30 -z-10" />
                </motion.div>
            </div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Section 3 — Visi & Misi
// ---------------------------------------------------------------------------
const misiList = [
    'Menyelenggarakan pendidikan berbasis nilai-nilai Islam',
    'Mengembangkan kompetensi kejuruan sesuai kebutuhan industri',
    'Membentuk karakter Islami yang tangguh dan berintegritas',
    'Menjalin kemitraan dengan dunia usaha dan industri',
    'Menciptakan lingkungan belajar yang kondusif dan inovatif',
];

const VisiMisiSection = () => (
    <section className="py-20 lg:py-28 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                    ARAH DAN TUJUAN
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87]">
                    Visi &amp; Misi Sekolah
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visi — kotak navy */}
                <motion.div
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative bg-[#001f4d] rounded-3xl p-8 lg:p-10 overflow-hidden"
                >
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 opacity-[0.035]">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <defs>
                                <pattern id="visi-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="0.5" />
                                    <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#visi-pattern)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 border border-[#c9a84c]/30 rounded-full px-4 py-1.5 mb-6">
                            <Star size={14} strokeWidth={1.5} className="text-[#c9a84c]" />
                            <span className="text-xs font-bold tracking-widest uppercase text-[#c9a84c]">VISI</span>
                        </div>
                        <blockquote className="font-serif text-xl lg:text-2xl font-bold text-white leading-relaxed">
                            "Menjadi SMK unggulan yang menghasilkan lulusan berakhlak mulia, kompeten, dan berdaya saing."
                        </blockquote>

                        {/* Decorative gold line */}
                        <div className="mt-8 w-16 h-0.5 bg-[#c9a84c]" />
                    </div>
                </motion.div>

                {/* Misi — list dengan icon gold */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 lg:p-10 border border-[#e5e5ea]"
                >
                    <div className="inline-flex items-center gap-2 bg-[#003f87]/10 border border-[#003f87]/20 rounded-full px-4 py-1.5 mb-6">
                        <BookOpen size={14} strokeWidth={1.5} className="text-[#003f87]" />
                        <span className="text-xs font-bold tracking-widest uppercase text-[#003f87]">MISI</span>
                    </div>

                    <motion.ul
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        {misiList.map((misi, i) => (
                            <motion.li
                                key={i}
                                variants={fadeInUp}
                                className="flex items-start gap-3"
                            >
                                <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 border-[#c9a84c] bg-[#c9a84c]/10 flex items-center justify-center">
                                    <Check size={12} strokeWidth={2.5} className="text-[#c9a84c]" />
                                </span>
                                <span className="text-[#48484a] text-base leading-relaxed">{misi}</span>
                            </motion.li>
                        ))}
                    </motion.ul>
                </motion.div>
            </div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Section 4 — Nilai Muhammadiyah
// ---------------------------------------------------------------------------
const nilaiList = [
    {
        icon: <Briefcase size={28} strokeWidth={1.5} className="text-[#c9a84c]" />,
        title: 'Amal Usaha',
        desc: 'Berkontribusi nyata untuk kemajuan umat dan bangsa melalui pendidikan vokasional yang berkualitas dan berdampak.',
    },
    {
        icon: <Star size={28} strokeWidth={1.5} className="text-[#c9a84c]" />,
        title: 'Fastabiqul Khairat',
        desc: 'Berlomba-lomba dalam kebaikan dan prestasi, mendorong seluruh warga sekolah untuk terus unggul dan berkompetisi secara sehat.',
    },
    {
        icon: <RefreshCw size={28} strokeWidth={1.5} className="text-[#c9a84c]" />,
        title: 'Tajdid',
        desc: 'Terus berinovasi dalam pendidikan berkualitas, mengadopsi metode pembelajaran modern tanpa kehilangan akar nilai-nilai Islam.',
    },
];

const NilaiSection = () => (
    <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                    LANDASAN GERAK
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87] mb-4">
                    Nilai-Nilai Muhammadiyah
                </h2>
                <p className="text-[#636366] text-lg max-w-2xl mx-auto">
                    Setiap langkah kami dilandasi oleh tiga pilar utama yang menjadi DNA gerakan Muhammadiyah.
                </p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {nilaiList.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={scaleIn}
                        whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                        className="relative bg-white rounded-3xl p-8 border border-[#c9a84c]/30 hover:border-[#c9a84c]/60 hover:shadow-xl transition-all duration-300 group"
                    >
                        {/* Gold accent top bar */}
                        <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent rounded-full" />

                        <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mb-6 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                            {item.icon}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#003f87] mb-3">{item.title}</h3>
                        <p className="text-[#636366] text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Section 5 — Struktur Organisasi
// ---------------------------------------------------------------------------
const strukturData = {
    kepalaSekolah: { nama: 'Nama Kepala Sekolah, S.Pd., M.M.', jabatan: 'Kepala Sekolah' },
    wakasek: [
        { nama: 'Nama Wakasek', jabatan: 'Wakasek Kurikulum' },
        { nama: 'Nama Wakasek', jabatan: 'Wakasek Kesiswaan' },
        { nama: 'Nama Wakasek', jabatan: 'Wakasek Sarana' },
        { nama: 'Nama Wakasek', jabatan: 'Wakasek Humas' },
    ],
    jurusan: [
        { kode: 'AKL', nama: 'Akuntansi & Keuangan Lembaga' },
        { kode: 'FKK', nama: 'Farmasetika & Klinis Komunitas' },
        { kode: 'TKJ', nama: 'Teknik Komputer & Jaringan' },
        { kode: 'TKR', nama: 'Teknik Kendaraan Ringan' },
        { kode: 'TSM', nama: 'Teknik Sepeda Motor' },
    ],
};

const OrgCard = ({ nama, jabatan, accent = false }: { nama: string; jabatan: string; accent?: boolean }) => (
    <div
        className={`rounded-2xl px-5 py-4 text-center border transition-all duration-200 ${
            accent
                ? 'bg-[#003f87] border-[#003f87] text-white shadow-lg shadow-[#003f87]/20'
                : 'bg-white border-[#e5e5ea] text-[#111111] hover:border-[#c9a84c]/50 hover:shadow-md'
        }`}
    >
        <p className={`text-xs font-semibold tracking-wide uppercase mb-1 ${accent ? 'text-[#c9a84c]' : 'text-[#c9a84c]'}`}>
            {jabatan}
        </p>
        <p className={`text-sm font-medium leading-snug ${accent ? 'text-white' : 'text-[#48484a]'}`}>{nama}</p>
    </div>
);

const StrukturSection = () => (
    <section className="py-20 lg:py-28 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                    ORGANISASI
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87]">
                    Struktur Organisasi
                </h2>
            </motion.div>

            <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center gap-0"
            >
                {/* Level 1 — Kepala Sekolah */}
                <div className="w-full max-w-xs">
                    <OrgCard
                        nama={strukturData.kepalaSekolah.nama}
                        jabatan={strukturData.kepalaSekolah.jabatan}
                        accent
                    />
                </div>

                {/* Connector */}
                <div className="w-px h-8 bg-[#c9a84c]/40" />

                {/* Level 2 — Wakasek */}
                <div className="relative w-full">
                    {/* Horizontal connector line */}
                    <div className="hidden md:block absolute top-[50%] left-[12.5%] right-[12.5%] h-px bg-[#c9a84c]/30 -translate-y-1/2" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                        {strukturData.wakasek.map((w, i) => (
                            <OrgCard key={i} nama={w.nama} jabatan={w.jabatan} />
                        ))}
                    </div>
                </div>

                {/* Connector */}
                <div className="w-px h-8 bg-[#c9a84c]/40" />

                {/* Level 3 — Ketua Jurusan */}
                <div className="relative w-full">
                    <div className="hidden md:block absolute top-[50%] left-[10%] right-[10%] h-px bg-[#c9a84c]/20 -translate-y-1/2" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
                        {strukturData.jurusan.map((j, i) => (
                            <OrgCard
                                key={i}
                                jabatan={`Ketua Jurusan ${j.kode}`}
                                nama={j.nama}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function Tentang({ pengaturan }: TentangProps) {
    const { locale } = usePage<SharedProps>().props;

    return (
        <PublicLayout>
            <PageHero />
            <ProfilSection />
            <VisiMisiSection />
            <NilaiSection />
            <StrukturSection />
        </PublicLayout>
    );
}
