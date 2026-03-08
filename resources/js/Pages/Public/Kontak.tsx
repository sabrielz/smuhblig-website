import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Instagram,
    Youtube,
    Facebook,
    Music2,
    ChevronRight,
    ArrowUpRight,
    ExternalLink,
    Globe,
    Link as LinkIcon,
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedProps, Pengaturan, Tautan } from '@/types';
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
interface KontakProps {
    pengaturan: Pengaturan;
    tautan: Tautan[];
    kontenInfo?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Geometric Pattern (reuse dari Tentang)
// ---------------------------------------------------------------------------
const GeometricPattern = () => (
    <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <pattern id="geo-pattern-kontak" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="white" strokeWidth="1" />
                <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="white" strokeWidth="0.3" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="white" strokeWidth="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern-kontak)" />
    </svg>
);

// ---------------------------------------------------------------------------
// Section 1 — Page Hero
// ---------------------------------------------------------------------------
const PageHero = () => (
    <section className="relative bg-[#001f4d] overflow-hidden min-h-[360px] flex items-center">
        <GeometricPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003f87]/60 via-transparent to-[#001f4d]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 lg:py-32">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-3xl"
            >
                <motion.p
                    variants={fadeInUp}
                    className="text-xs font-bold tracking-[0.25em] uppercase text-[#c9a84c] mb-4"
                >
                    HUBUNGI KAMI
                </motion.p>
                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                >
                    Kami Siap{' '}
                    <span className="text-[#c9a84c]">Membantu</span> Anda
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
                    <span className="text-white/90">Kontak</span>
                </motion.nav>
            </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </section>
);

// ---------------------------------------------------------------------------
// Section 2 — Kontak Info + Peta
// ---------------------------------------------------------------------------
interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#003f87]/10 border border-[#003f87]/15 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold tracking-wide uppercase text-[#c9a84c] mb-1">{label}</p>
            <div className="text-[#48484a] text-sm leading-relaxed">{value}</div>
        </div>
    </div>
);

interface SosmedLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const SosmedLink = ({ href, icon, label }: SosmedLinkProps) => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-xl bg-[#003f87]/10 border border-[#003f87]/15 flex items-center justify-center text-[#003f87] hover:bg-[#003f87] hover:text-white hover:border-[#003f87] transition-all duration-200"
        >
            {icon}
        </a>
    );
};

const InfoDanPeta = ({ pengaturan, kontenInfo }: { pengaturan: Pengaturan; kontenInfo?: Record<string, string> }) => (
    <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
                {/* Left — Info kontak */}
                <motion.div
                    variants={slideFromLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                        INFORMASI KONTAK
                    </p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87] mb-8 leading-tight">
                        Temukan &amp; Hubungi Kami
                    </h2>

                    <div className="space-y-6 mb-10">
                        <InfoItem
                            icon={<MapPin size={18} strokeWidth={1.5} className="text-[#003f87]" />}
                            label="Alamat"
                            value={
                                <p>
                                    {pengaturan.site_address || 'Jl. Raya Bligo, Kec. Bligo, Kab. Batang, Jawa Tengah 51261'}
                                </p>
                            }
                        />
                        <InfoItem
                            icon={<Phone size={18} strokeWidth={1.5} className="text-[#003f87]" />}
                            label="Telepon"
                            value={
                                <a
                                    href={`tel:${pengaturan.site_phone}`}
                                    className="hover:text-[#003f87] transition-colors"
                                >
                                    {pengaturan.site_phone || '+62 285 xxxxxxx'}
                                </a>
                            }
                        />
                        <InfoItem
                            icon={<Mail size={18} strokeWidth={1.5} className="text-[#003f87]" />}
                            label="Email"
                            value={
                                <a
                                    href={`mailto:${pengaturan.site_email}`}
                                    className="hover:text-[#003f87] transition-colors"
                                >
                                    {pengaturan.site_email || 'info@smkmuhbligo.sch.id'}
                                </a>
                            }
                        />
                        <InfoItem
                            icon={<Clock size={18} strokeWidth={1.5} className="text-[#003f87]" />}
                            label="Jam Operasional"
                            value={
                                kontenInfo?.jam_operasional ? (
                                    <div className="whitespace-pre-line text-[#48484a] text-sm leading-relaxed">
                                        {kontenInfo.jam_operasional}
                                    </div>
                                ) : (
                                    <div className="space-y-0.5">
                                        <p>Senin – Jumat: 07.00 – 15.30 WIB</p>
                                        <p>Sabtu: 07.00 – 12.00 WIB</p>
                                        <p className="text-[#8e8e93]">Minggu & Hari Libur: Tutup</p>
                                    </div>
                                )
                            }
                        />
                    </div>

                    {/* Sosmed Links */}
                    <div>
                        <p className="text-xs font-bold tracking-wide uppercase text-[#636366] mb-3">
                            Media Sosial
                        </p>
                        <div className="flex items-center gap-3">
                            <SosmedLink
                                href={pengaturan.sosial_instagram}
                                icon={<Instagram size={18} strokeWidth={1.5} />}
                                label="Instagram"
                            />
                            <SosmedLink
                                href={pengaturan.sosial_youtube}
                                icon={<Youtube size={18} strokeWidth={1.5} />}
                                label="YouTube"
                            />
                            <SosmedLink
                                href={pengaturan.sosial_facebook}
                                icon={<Facebook size={18} strokeWidth={1.5} />}
                                label="Facebook"
                            />
                            <SosmedLink
                                href={pengaturan.sosial_tiktok}
                                icon={<Music2 size={18} strokeWidth={1.5} />}
                                label="TikTok"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Right — Google Maps embed */}
                <motion.div
                    variants={slideFromRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-[#f8f9fa] border border-[#e5e5ea]"
                >
                    {kontenInfo?.maps_embed_url ? (
                        <iframe
                            id="google-maps-embed"
                            title="Lokasi SMK Muhammadiyah Bligo"
                            src={kontenInfo.maps_embed_url}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8f9fa] border border-[#e5e5ea] min-h-[300px]">
                            <MapPin size={48} strokeWidth={1.5} className="text-[#003f87] mb-4 opacity-50" />
                            <p className="text-[#636366] text-center px-4 mb-4">Peta belum dikonfigurasi</p>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(pengaturan?.site_address || 'SMK Muhammadiyah Bligo')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#003f87] hover:underline"
                            >
                                Buka di Google Maps
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                    {/* Overlay badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md flex items-center gap-2">
                        <MapPin size={14} strokeWidth={1.5} className="text-[#003f87]" />
                        <span className="text-xs font-semibold text-[#003f87]">Bligo, Batang, Jawa Tengah</span>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Section 3 — Tautan Penting
// ---------------------------------------------------------------------------

// Map icon_name string → Lucide component
const iconMap: Record<string, React.ReactNode> = {
    Globe:      <Globe size={20} strokeWidth={1.5} />,
    ExternalLink: <ExternalLink size={20} strokeWidth={1.5} />,
    Link:       <LinkIcon size={20} strokeWidth={1.5} />,
    Youtube:    <Youtube size={20} strokeWidth={1.5} />,
    Instagram:  <Instagram size={20} strokeWidth={1.5} />,
    Facebook:   <Facebook size={20} strokeWidth={1.5} />,
};

const TautanCard = ({ tautan }: { tautan: Tautan }) => {
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
            className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#e5e5ea] hover:border-[#003f87]/30 hover:shadow-lg transition-all duration-300"
        >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#003f87]/10 border border-[#003f87]/15 flex items-center justify-center text-[#003f87] group-hover:bg-[#003f87] group-hover:text-white group-hover:border-[#003f87] transition-all duration-200">
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#111111] text-sm mb-0.5 truncate group-hover:text-[#003f87] transition-colors">
                    {tautan.label}
                </p>
                {tautan.deskripsi && (
                    <p className="text-[#8e8e93] text-xs leading-relaxed line-clamp-2">{tautan.deskripsi}</p>
                )}
            </div>

            {/* Arrow */}
            <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="flex-shrink-0 mt-0.5 text-[#aeaeb2] group-hover:text-[#003f87] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
        </motion.a>
    );
};

const TautanSection = ({ tautan }: { tautan: Tautan[] }) => {
    if (!tautan || tautan.length === 0) return null;

    return (
        <section className="py-20 lg:py-28 bg-[#f8f9fa]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                        NAVIGASI CEPAT
                    </p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87] mb-4">
                        Tautan Penting
                    </h2>
                    <p className="text-[#636366] text-lg max-w-xl mx-auto">
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
};

// ---------------------------------------------------------------------------
// Fallback Tautan (jika DB kosong)
// ---------------------------------------------------------------------------
const FallbackTautan: Tautan[] = [
    { id: 1, label: 'PPDB Online', url: '#', deskripsi: 'Penerimaan Peserta Didik Baru', icon_name: 'Globe', kategori: null, is_active: true, buka_tab_baru: true },
    { id: 2, label: 'E-Learning', url: '#', deskripsi: 'Platform pembelajaran digital sekolah', icon_name: 'ExternalLink', kategori: null, is_active: true, buka_tab_baru: true },
    { id: 3, label: 'Portal Siswa', url: '#', deskripsi: 'Akses nilai, absensi, dan informasi akademik', icon_name: 'Link', kategori: null, is_active: true, buka_tab_baru: true },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function Kontak({ pengaturan, tautan, kontenInfo }: KontakProps) {
    const displayTautan = tautan && tautan.length > 0 ? tautan : FallbackTautan;

    return (
        <PublicLayout>
            <PageHero />
            <InfoDanPeta pengaturan={pengaturan} kontenInfo={kontenInfo} />
            <TautanSection tautan={displayTautan} />
        </PublicLayout>
    );
}
