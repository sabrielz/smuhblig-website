import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
    kontenHero?: Record<string, string>;
    kontenProfil?: Record<string, string>;
    kontenVisiMisi?: Record<string, string>;
    kontenNilai?: Record<string, string>;
    strukturOrganisasi?: any;
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
const PageHero = ({ kontenHero }: { kontenHero?: Record<string, string> }) => {
    const { t } = useTranslation();
    return (
    <section className="relative bg-primary-900 overflow-hidden min-h-[360px] flex items-center">
        <GeometricPattern />

        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 via-transparent to-primary-900" />

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
                    className="text-xs font-bold tracking-[0.25em] uppercase text-gold-500 mb-4"
                >
                    {t('tentang.eyebrow')}
                </motion.p>

                {/* Headline */}
                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                    dangerouslySetInnerHTML={{ __html: kontenHero?.headline || 'Sejarah, Visi, <span className="text-gold-500">dan Misi</span> Kami' }}
                />

                {/* Breadcrumb */}
                <motion.nav
                    variants={fadeInUp}
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-white/60"
                >
                    <a href="/" className="hover:text-white transition-colors duration-200">
                        {t('nav.home')}
                    </a>
                    <ChevronRight size={14} className="text-white/40" />
                    <span className="text-white/90">{t('tentang.breadcrumb')}</span>
                </motion.nav>
            </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
    );
};

// ---------------------------------------------------------------------------
// Section 2 — Profil Singkat
// ---------------------------------------------------------------------------
const highlights = [
    'Berdiri sejak 2003, kami telah mendidik ribuan generasi muda berdedikasi.',
    'Terakreditasi A oleh BAN-SM dengan standar mutu pendidikan nasional.',
    'Didukung 5 jurusan keahlian yang relevan dengan kebutuhan industri modern.',
];

const ProfilSection = ({ kontenProfil }: { kontenProfil?: Record<string, string> }) => (
    <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Teks */}
                <motion.div
                    variants={slideFromLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="order-2 lg:order-1"
                >
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                        PROFIL SEKOLAH
                    </p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600 mb-6 leading-tight">
                        {kontenProfil?.headline || 'Mendidik Generasi Kompeten dan Berakhlak Mulia'}
                    </h2>
                    <div
                        className="prose prose-lg prose-p:text-neutral-500 prose-p:leading-relaxed max-w-none mb-8"
                        dangerouslySetInnerHTML={{ __html: kontenProfil?.konten || '' }}
                    />

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
                                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gold-500/10 flex items-center justify-center">
                                    <Check size={12} strokeWidth={2.5} className="text-gold-500" />
                                </span>
                                <span className="text-neutral-600 text-sm leading-relaxed">{point}</span>
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
                    className="relative order-1 lg:order-2"
                >
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center shadow-2xl">
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
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Berdiri Sejak</p>
                            <p className="text-2xl font-bold text-primary-600 font-sans">1982</p>
                        </div>
                    </div>

                    {/* Gold accent border */}
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-3xl border-2 border-gold-500/30 -z-10" />
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

const VisiMisiSection = ({ kontenVisiMisi }: { kontenVisiMisi?: Record<string, string> }) => (
    <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                    ARAH DAN TUJUAN
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600">
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
                    className="relative bg-primary-900 rounded-3xl p-8 lg:p-10 overflow-hidden"
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
                        <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
                            <Star size={14} strokeWidth={1.5} className="text-gold-500" />
                            <span className="text-xs font-bold tracking-widest uppercase text-gold-500">VISI</span>
                        </div>
                        <blockquote
                            className="font-serif text-xl lg:text-2xl font-bold text-white leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: kontenVisiMisi?.visi || '"Menjadi SMK unggulan yang menghasilkan lulusan berakhlak mulia, kompeten, dan berdaya saing."' }}
                        />

                        {/* Decorative gold line */}
                        <div className="mt-8 w-16 h-0.5 bg-gold-500" />
                    </div>
                </motion.div>

                {/* Misi — list dengan icon gold */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 lg:p-10 border border-neutral-100"
                >
                    <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-600/20 rounded-full px-4 py-1.5 mb-6">
                        <BookOpen size={14} strokeWidth={1.5} className="text-primary-600" />
                        <span className="text-xs font-bold tracking-widest uppercase text-primary-600">MISI</span>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="prose prose-p:text-neutral-600 prose-li:text-neutral-600 prose-ul:list-disc prose-ul:pl-5 space-y-2 max-w-none"
                        dangerouslySetInnerHTML={{ __html: kontenVisiMisi?.misi || '' }}
                    />
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
        icon: <Briefcase size={28} strokeWidth={1.5} className="text-gold-500" />,
        title: 'Amal Usaha',
        desc: 'Berkontribusi nyata untuk kemajuan umat dan bangsa melalui pendidikan vokasional yang berkualitas dan berdampak.',
    },
    {
        icon: <Star size={28} strokeWidth={1.5} className="text-gold-500" />,
        title: 'Fastabiqul Khairat',
        desc: 'Berlomba-lomba dalam kebaikan dan prestasi, mendorong seluruh warga sekolah untuk terus unggul dan berkompetisi secara sehat.',
    },
    {
        icon: <RefreshCw size={28} strokeWidth={1.5} className="text-gold-500" />,
        title: 'Tajdid',
        desc: 'Terus berinovasi dalam pendidikan berkualitas, mengadopsi metode pembelajaran modern tanpa kehilangan akar nilai-nilai Islam.',
    },
];

const NilaiSection = ({ kontenNilai }: { kontenNilai?: Record<string, string> }) => (
    <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                    LANDASAN GERAK
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600 mb-4">
                    {kontenNilai?.headline || 'Nilai-Nilai Muhammadiyah'}
                </h2>
                <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
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
                        className="relative bg-white rounded-3xl p-8 border border-gold-500/30 hover:border-gold-500/60 hover:shadow-xl transition-all duration-300 group"
                    >
                        {/* Gold accent top bar */}
                        <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent rounded-full" />

                        <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors duration-300">
                            {item.icon}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-primary-600 mb-3">{item.title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

const OrgNodeDesktop = ({ node, isRoot = false }: { node: any; isRoot?: boolean }) => {
    if (!node) return null;

    // Untuk tablet (md-lg), sembunyikan level >= 2
    // Class names diatur dengan tailwind: block di lg, hidden di md jika level >= 2
    const isLevel2Plus = parseInt(node.level) >= 2;
    const hideOnTabletClass = isLevel2Plus ? 'md:hidden lg:flex' : 'md:flex';

    return (
        <div className={`flex flex-col items-center ${!isRoot ? 'pt-6 relative' : ''} ${hideOnTabletClass}`}>
            {!isRoot && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-gold-500/40 hidden md:block" />
            )}

            <div className={`rounded-2xl px-5 py-4 w-60 xl:w-64 text-center border transition-all duration-200 relative z-10 ${
                node.level === 0 || node.level === '0'
                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-white border-neutral-100 text-neutral-900 hover:border-gold-500/50 hover:shadow-md'
            }`}>
                {node.foto_url && (
                    <img src={node.foto_url} alt={node.nama} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-white/20 shadow-sm" />
                )}
                <p className={`text-[11px] font-semibold tracking-wide uppercase mb-1 ${node.level === 0 || node.level === '0' ? 'text-gold-500' : 'text-gold-500'}`}>
                    {node.jabatan}
                </p>
                <p className={`text-sm font-medium leading-snug ${node.level === 0 || node.level === '0' ? 'text-white' : 'text-neutral-600'}`}>
                    {node.nama}
                </p>
            </div>

            {node.children && node.children.length > 0 && (
                <div className={`hidden justify-center flex-wrap gap-4 relative pt-2 ${hideOnTabletClass}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-gold-500/40 hidden md:block" />
                    <div className="flex gap-4 lg:gap-6 w-full justify-center relative pt-6">
                        {node.children.length > 1 && (
                            <div className="absolute top-6 h-px bg-gold-500/30 z-0 hidden md:block" style={{ left: '10%', right: '10%' }} />
                        )}
                        {node.children.map((child: any) => (
                            <OrgNodeDesktop key={child.id || child.jabatan} node={child} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const OrgNodeMobile = ({ node }: { node: any }) => {
    if (!node) return null;
    const levelInt = parseInt(node.level || 0);
    return (
        <div className={`flex flex-col text-left py-2 ${levelInt > 0 ? 'border-l-2 border-gold-500/30 pl-4 mt-2' : ''} w-full`}>
            {node.foto_url && (
                <img src={node.foto_url} alt={node.nama} className="w-10 h-10 rounded-full mb-2 object-cover" />
            )}
            <p className="text-[10px] font-semibold tracking-wider uppercase text-gold-500 mb-0.5">{node.jabatan}</p>
            <p className="text-sm font-medium leading-snug text-neutral-600">{node.nama}</p>

            {node.children && node.children.length > 0 && (
                <div className="mt-1 flex flex-col gap-1 w-full pl-2">
                    {node.children.map((child: any) => (
                        <OrgNodeMobile key={child.id || child.jabatan} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

const StrukturSection = ({ strukturOrganisasi }: { strukturOrganisasi?: any }) => (
    <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                    ORGANISASI
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600">
                    Struktur Organisasi
                </h2>
            </motion.div>

            <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full overflow-x-auto pb-8"
            >
                {strukturOrganisasi ? (
                    <>
                        <div className="hidden md:flex flex-col items-center min-w-max mx-auto px-4">
                            <OrgNodeDesktop node={strukturOrganisasi} isRoot />
                        </div>
                        <div className="flex md:hidden flex-col items-start w-full bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                            <OrgNodeMobile node={strukturOrganisasi} />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 text-neutral-500">
                        <p>Struktur organisasi belum dikonfigurasi.</p>
                    </div>
                )}
            </motion.div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function Tentang({
    pengaturan,
    kontenHero,
    kontenProfil,
    kontenVisiMisi,
    kontenNilai,
    strukturOrganisasi
}: TentangProps) {
    const { locale } = usePage<SharedProps>().props;

    return (
        <PublicLayout>
            <PageHero kontenHero={kontenHero} />
            <ProfilSection kontenProfil={kontenProfil} />
            <VisiMisiSection kontenVisiMisi={kontenVisiMisi} />
            <NilaiSection kontenNilai={kontenNilai} />
            <StrukturSection strukturOrganisasi={strukturOrganisasi} />
        </PublicLayout>
    );
}
