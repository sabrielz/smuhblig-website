import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import type { SharedProps } from '@/types';

// ---------------------------------------------------------------------------
// Nav links (reuse same structure)
// ---------------------------------------------------------------------------
const NAV_LINKS = [
    { label: { id: 'Beranda', en: 'Home' }, href: '/' },
    { label: { id: 'Tentang', en: 'About' }, href: '/tentang' },
    { label: { id: 'Jurusan', en: 'Programs' }, href: '/jurusan' },
    { label: { id: 'Berita', en: 'News' }, href: '/berita' },
    { label: { id: 'Galeri', en: 'Gallery' }, href: '/galeri' },
    { label: { id: 'Agenda', en: 'Events' }, href: '/agenda' },
    { label: { id: 'Kontak', en: 'Contact' }, href: '/kontak' },
];

// ---------------------------------------------------------------------------
// TikTok Icon (not in Lucide — SVG manual)
// ---------------------------------------------------------------------------
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.28 8.28 0 004.84 1.55V6.84a4.85 4.85 0 01-1.07-.15z" />
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Islamic Divider — subtle geometric ornament
// ---------------------------------------------------------------------------
function IslamicDivider() {
    return (
        <div className="flex items-center gap-3 my-6" aria-hidden="true">
            <div className="flex-1 h-px bg-white/15" />
            {/* Diamond ornament */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#c9a84c]/50 flex-shrink-0">
                <rect x="6" y="0" width="4" height="4" transform="rotate(45 8 2)" fill="currentColor" />
                <rect x="6" y="10" width="4" height="4" transform="rotate(45 8 12)" fill="currentColor" opacity="0.5" />
            </svg>
            <div className="flex-1 h-px bg-white/15" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Social Icon Button
// ---------------------------------------------------------------------------
interface SocialButtonProps {
    href: string;
    label: string;
    id: string;
    children: React.ReactNode;
}

function SocialButton({ href, label, id, children }: SocialButtonProps) {
    if (!href) return null;
    return (
        <a
            href={href}
            id={id}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/70 transition-all duration-250 hover:border-transparent hover:bg-white hover:text-[#003f87] hover:scale-110"
        >
            {children}
        </a>
    );
}

// ---------------------------------------------------------------------------
// Footer (main export)
// ---------------------------------------------------------------------------
export default function Footer() {
    const { locale, pengaturan } = usePage<SharedProps>().props;

    const siteName = pengaturan?.site_name ?? 'SMK Muhammadiyah Bligo';
    const tagline = pengaturan?.site_tagline ?? 'Unggul, Islami, Berkarakter';
    const instagram = pengaturan?.sosial_instagram ?? '';
    const youtube = pengaturan?.sosial_youtube ?? '';
    const facebook = pengaturan?.sosial_facebook ?? '';
    const tiktok = pengaturan?.sosial_tiktok ?? '';

    const hasSocial = instagram || youtube || facebook || tiktok;

    return (
        <footer id="site-footer" className="bg-[#001f4d]" aria-label="Footer">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Main footer grid ── */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 py-16 lg:py-20"
                >
                    {/* ── Column 1: Brand (40%) ── */}
                    <motion.div
                        variants={fadeInUp}
                        className="col-span-1 md:col-span-2 lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-5"
                    >
                        {/* Logo mark */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                            {pengaturan?.site_logo ? (
                                <img
                                    src={`/${pengaturan.site_logo}`}
                                    alt={`Logo ${siteName}`}
                                    className="h-12 w-auto max-w-[48px] object-contain flex-shrink-0 bg-white rounded-lg p-1"
                                />
                            ) : (
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#c9a84c]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                    </svg>
                                </div>
                            )}
                            <div>
                                <p className="text-base font-bold text-white leading-tight">{siteName}</p>
                                <p className="text-xs text-[#c9a84c] font-medium mt-0.5">Sapugarut Gg. 7, Kab. Pekalongan, Jawa Tengah</p>
                            </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-lg font-semibold italic text-white/80">
                            "{tagline}"
                        </p>

                        {/* Geometric Islamic divider */}
                        <IslamicDivider />

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-white/55 max-w-xs">
                            {locale === 'id'
                                ? 'SMK Muhammadiyah Bligo adalah sekolah kejuruan berlandaskan nilai-nilai Islam yang berkomitmen mencetak generasi unggul, berkarakter mulia, dan siap berkarya di era global.'
                                : 'SMK Muhammadiyah Bligo is an Islamic vocational school committed to nurturing an excellent generation with noble character, ready to contribute in the global era.'}
                        </p>
                    </motion.div>

                    {/* ── Column 2: Navigation (30%) ── */}
                    <motion.div
                        variants={fadeInUp}
                        className="col-span-1 md:col-span-1 lg:col-span-3 space-y-5 flex flex-col items-center md:items-start text-center md:text-left"
                    >
                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#c9a84c]">
                            {locale === 'id' ? 'Navigasi' : 'Navigation'}
                        </h3>
                        <ul className="space-y-3">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                                    >
                                        <span
                                            className="inline-block h-px w-4 bg-white/25 transition-all duration-200 group-hover:w-6 group-hover:bg-[#c9a84c]"
                                            aria-hidden="true"
                                        />
                                        {locale === 'id' ? link.label.id : link.label.en}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* ── Column 3: Important Links + Social (30%) ── */}
                    <motion.div
                        variants={fadeInUp}
                        className="col-span-1 md:col-span-1 lg:col-span-4 space-y-5 flex flex-col items-center md:items-start text-center md:text-left"
                    >
                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#c9a84c]">
                            {locale === 'id' ? 'Tautan Penting' : 'Important Links'}
                        </h3>

                        {/* Links */}
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/daftar"
                                    id="footer-link-daftar"
                                    className="group inline-flex items-center gap-2 rounded-lg border border-[#c9a84c]/40 px-4 py-2.5 text-sm font-semibold text-[#c9a84c] transition-all duration-200 hover:border-[#c9a84c] hover:bg-[#c9a84c] hover:text-white"
                                >
                                    <span>
                                        {locale === 'id' ? '🎓 Daftar Sekarang' : '🎓 Register Now'}
                                    </span>
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/portal"
                                    id="footer-link-portal"
                                    className="group flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                                >
                                    <span
                                        className="inline-block h-px w-4 bg-white/25 transition-all duration-200 group-hover:w-6 group-hover:bg-[#c9a84c]"
                                        aria-hidden="true"
                                    />
                                    {locale === 'id' ? 'Portal Siswa' : 'Student Portal'}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/berita"
                                    id="footer-link-berita"
                                    className="group flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                                >
                                    <span
                                        className="inline-block h-px w-4 bg-white/25 transition-all duration-200 group-hover:w-6 group-hover:bg-[#c9a84c]"
                                        aria-hidden="true"
                                    />
                                    {locale === 'id' ? 'Berita Terbaru' : 'Latest News'}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kontak"
                                    id="footer-link-kontak"
                                    className="group flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                                >
                                    <span
                                        className="inline-block h-px w-4 bg-white/25 transition-all duration-200 group-hover:w-6 group-hover:bg-[#c9a84c]"
                                        aria-hidden="true"
                                    />
                                    {locale === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                                </Link>
                            </li>
                        </ul>

                        {/* Social media */}
                        {hasSocial && (
                            <div className="pt-2 space-y-3">
                                <p className="text-xs font-medium text-white/40 uppercase tracking-widest text-center md:text-left">
                                    {locale === 'id' ? 'Ikuti Kami' : 'Follow Us'}
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-2.5">
                                    {instagram && (
                                        <SocialButton
                                            href={instagram}
                                            label="Instagram"
                                            id="footer-social-instagram"
                                        >
                                            <Instagram className="h-4 w-4" strokeWidth={1.5} />
                                        </SocialButton>
                                    )}
                                    {youtube && (
                                        <SocialButton
                                            href={youtube}
                                            label="YouTube"
                                            id="footer-social-youtube"
                                        >
                                            <Youtube className="h-4 w-4" strokeWidth={1.5} />
                                        </SocialButton>
                                    )}
                                    {facebook && (
                                        <SocialButton
                                            href={facebook}
                                            label="Facebook"
                                            id="footer-social-facebook"
                                        >
                                            <Facebook className="h-4 w-4" strokeWidth={1.5} />
                                        </SocialButton>
                                    )}
                                    {tiktok && (
                                        <SocialButton
                                            href={tiktok}
                                            label="TikTok"
                                            id="footer-social-tiktok"
                                        >
                                            <TikTokIcon className="h-4 w-4" />
                                        </SocialButton>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* ── Copyright bar ── */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 sm:flex-row">
                    <p className="text-xs text-white/35 text-center sm:text-left">
                        © {new Date().getFullYear()} {siteName}.{' '}
                        {locale === 'id'
                            ? 'Bagian dari Persyarikatan Muhammadiyah.'
                            : 'Part of Persyarikatan Muhammadiyah.'}
                    </p>
                    <p className={cn(
                        'flex items-center gap-1.5 text-xs italic text-[#c9a84c]/60',
                    )}>
                        <Heart className="h-3 w-3 text-[#c9a84c]/40" strokeWidth={1.5} />
                        <span className="font-playfair font-medium">Fastabiqul Khairat</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
