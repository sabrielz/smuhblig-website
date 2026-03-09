import { usePage, useForm } from '@inertiajs/react';
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
    Send,
    CheckCircle,
    AlertCircle,
    User,
    MessageSquare,
    FileText,
    PhoneCall,
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
import { cn } from '@/lib/utils';

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
// Section Form Kontak
// ---------------------------------------------------------------------------

interface FormData {
    nama: string;
    email: string;
    nomor_telepon: string;
    subjek: string;
    pesan: string;
    website: string; // honeypot
}

const inputClass = cn(
    'w-full px-4 py-3 text-sm rounded-xl border border-[#e5e5ea]',
    'bg-white text-[#111111] placeholder-[#aeaeb2]',
    'outline-none focus:border-[#003f87] focus:ring-2 focus:ring-[#003f87]/15',
    'transition-all duration-200',
);

const labelClass = 'block text-xs font-bold uppercase tracking-wide text-[#636366] mb-2';

const FieldError = ({ message }: { message?: string }) =>
    message ? (
        <p className="flex items-center gap-1.5 mt-2 text-xs text-red-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {message}
        </p>
    ) : null;

const FormKontak = () => {
    const { props } = usePage<SharedProps>();
    const flash = props.flash;
    const isSuccess = !!flash?.success;

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        nama: '',
        email: '',
        nomor_telepon: '',
        subjek: '',
        pesan: '',
        website: '', // honeypot — must stay empty
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kontak/kirim', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const pesanLength = data.pesan.length;
    const rateLimitError = (errors as Record<string, string>).rate_limit;

    return (
        <section className="py-20 lg:py-28 bg-white border-t border-[#e5e5ea]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                    {/* Left — Intro text */}
                    <motion.div
                        variants={slideFromLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                            FORMULIR KONTAK
                        </p>
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#003f87] mb-6 leading-tight">
                            Kirim{' '}
                            <span className="text-[#c9a84c]">Pesan</span>
                        </h2>
                        <p className="text-[#636366] text-base leading-relaxed mb-8">
                            Punya pertanyaan seputar PPDB, jurusan, fasilitas, atau kerjasama?
                            Tim kami siap membantu. Isi formulir ini dan kami akan merespons
                            secepatnya.
                        </p>

                        {/* Info Tips */}
                        <div className="space-y-3">
                            {[
                                { icon: <MessageSquare size={16} strokeWidth={1.5} />, text: 'Pesan akan dibalas dalam 1×24 jam kerja.' },
                                { icon: <Mail size={16} strokeWidth={1.5} />, text: 'Pastikan alamat email Anda aktif untuk menerima balasan.' },
                                { icon: <PhoneCall size={16} strokeWidth={1.5} />, text: 'Untuk urusan mendesak, hubungi langsung via telepon.' },
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-[#636366]">
                                    <div className="w-7 h-7 rounded-lg bg-[#003f87]/8 flex items-center justify-center shrink-0 text-[#003f87] mt-0.5">
                                        {tip.icon}
                                    </div>
                                    {tip.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Success state */}
                        {isSuccess ? (
                            <motion.div
                                variants={scaleIn}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col items-center justify-center text-center py-16 px-8 bg-[#f8f9fa] rounded-3xl border border-[#e5e5ea]"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                                    <CheckCircle size={32} strokeWidth={1.5} className="text-green-600" />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-[#003f87] mb-3">
                                    Pesan Terkirim!
                                </h3>
                                <p className="text-[#636366] text-sm leading-relaxed max-w-sm">
                                    {flash.success}
                                    {' '}Tim kami akan segera menghubungi Anda melalui email yang terdaftar.
                                </p>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="bg-[#f8f9fa] rounded-3xl border border-[#e5e5ea] p-6 sm:p-8 space-y-5"
                            >
                                {/* Rate limit error global */}
                                {rateLimitError && (
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <p className="font-medium">{rateLimitError}</p>
                                    </div>
                                )}

                                {/* Row 1: Nama + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="kontak-nama" className={labelClass}>
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aeaeb2]"
                                            />
                                            <input
                                                id="kontak-nama"
                                                name="nama"
                                                type="text"
                                                value={data.nama}
                                                onChange={e => setData('nama', e.target.value)}
                                                placeholder="Nama Anda"
                                                autoComplete="name"
                                                className={cn(inputClass, 'pl-10', errors.nama && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.nama} />
                                    </div>

                                    <div>
                                        <label htmlFor="kontak-email" className={labelClass}>
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aeaeb2]"
                                            />
                                            <input
                                                id="kontak-email"
                                                name="email"
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                placeholder="email@domain.com"
                                                autoComplete="email"
                                                className={cn(inputClass, 'pl-10', errors.email && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.email} />
                                    </div>
                                </div>

                                {/* Row 2: Telepon + Subjek */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="kontak-telepon" className={labelClass}>
                                            Nomor Telepon
                                            <span className="normal-case font-normal tracking-normal ml-1 text-[#aeaeb2]">(opsional)</span>
                                        </label>
                                        <div className="relative">
                                            <PhoneCall
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aeaeb2]"
                                            />
                                            <input
                                                id="kontak-telepon"
                                                name="nomor_telepon"
                                                type="tel"
                                                value={data.nomor_telepon}
                                                onChange={e => setData('nomor_telepon', e.target.value)}
                                                placeholder="08xx-xxxx-xxxx"
                                                autoComplete="tel"
                                                className={cn(inputClass, 'pl-10', errors.nomor_telepon && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.nomor_telepon} />
                                    </div>

                                    <div>
                                        <label htmlFor="kontak-subjek" className={labelClass}>
                                            Subjek <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <FileText
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aeaeb2]"
                                            />
                                            <input
                                                id="kontak-subjek"
                                                name="subjek"
                                                type="text"
                                                value={data.subjek}
                                                onChange={e => setData('subjek', e.target.value)}
                                                placeholder="Topik pesan Anda"
                                                className={cn(inputClass, 'pl-10', errors.subjek && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.subjek} />
                                    </div>
                                </div>

                                {/* Pesan */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="kontak-pesan" className={cn(labelClass, 'mb-0')}>
                                            Pesan <span className="text-red-500">*</span>
                                        </label>
                                        <span className={cn(
                                            'text-xs font-medium',
                                            pesanLength > 4500 ? 'text-red-500' : 'text-[#aeaeb2]'
                                        )}>
                                            {pesanLength.toLocaleString('id-ID')}/5.000
                                        </span>
                                    </div>
                                    <textarea
                                        id="kontak-pesan"
                                        name="pesan"
                                        rows={6}
                                        value={data.pesan}
                                        onChange={e => setData('pesan', e.target.value)}
                                        placeholder="Tulis pesan Anda di sini..."
                                        maxLength={5000}
                                        className={cn(
                                            inputClass,
                                            'resize-none',
                                            errors.pesan && 'border-red-400 focus:ring-red-400/20'
                                        )}
                                    />
                                    <FieldError message={errors.pesan} />
                                </div>

                                {/* Honeypot — hidden dari user, tapi bot akan mengisinya */}
                                <input
                                    name="website"
                                    type="text"
                                    value={data.website}
                                    onChange={e => setData('website', e.target.value)}
                                    className="hidden"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                />

                                {/* Submit */}
                                <button
                                    id="kontak-submit"
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        'w-full sm:w-auto flex items-center justify-center gap-2.5',
                                        'px-8 py-4 rounded-xl',
                                        'bg-[#c9a84c] text-white text-sm font-bold',
                                        'hover:bg-[#a8821f] transition-all duration-200',
                                        'focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50',
                                        'disabled:opacity-60 disabled:cursor-not-allowed',
                                        'shadow-md hover:shadow-lg',
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} strokeWidth={1.5} />
                                            Kirim Pesan
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function Kontak({ pengaturan, tautan, kontenInfo }: KontakProps) {
    const displayTautan = tautan && tautan.length > 0 ? tautan : FallbackTautan;

    return (
        <PublicLayout>
            <PageHero />
            <InfoDanPeta pengaturan={pengaturan} kontenInfo={kontenInfo} />
            <FormKontak />
            <TautanSection tautan={displayTautan} />
        </PublicLayout>
    );
}
