import type { Variants, Easing } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, GraduationCap, ChevronRight, Search, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SharedProps } from '@/types';

// ---------------------------------------------------------------------------
// Nav links definition
// ---------------------------------------------------------------------------
interface NavLink {
    label: { id: string; en: string };
    href: string;
}

const NAV_LINKS: NavLink[] = [
    { label: { id: 'Beranda', en: 'Home' }, href: '/' },
    { label: { id: 'Tentang', en: 'About' }, href: '/tentang' },
    { label: { id: 'Jurusan', en: 'Programs' }, href: '/jurusan' },
    { label: { id: 'Berita', en: 'News' }, href: '/berita' },
    { label: { id: 'Galeri', en: 'Gallery' }, href: '/galeri' },
    { label: { id: 'Agenda', en: 'Events' }, href: '/agenda' },
    { label: { id: 'Kontak', en: 'Contact' }, href: '/kontak' },
];

// ---------------------------------------------------------------------------
// Language Toggle
// ---------------------------------------------------------------------------
interface LanguageToggleProps {
    locale: string;
    isScrolled: boolean;
    isDark?: boolean;
}

function LanguageToggle({ locale, isScrolled, isDark = false }: LanguageToggleProps) {
    const handleLocaleChange = (newLocale: string) => {
        if (newLocale === locale) return;
        router.post(
            '/locale',
            { locale: newLocale },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(window.location.pathname + window.location.search);
                },
            },
        );
    };

    return (
        <div className={cn(
            'flex items-center gap-0.5 rounded-lg border p-0.5',
            isDark || !isScrolled ? 'border-white/20' : 'border-[#e5e5ea]',
        )}>
            {(['id', 'en'] as const).map((lang) => (
                <button
                    key={lang}
                    id={`lang-toggle-${lang}`}
                    onClick={() => handleLocaleChange(lang)}
                    className={cn(
                        'rounded-md px-2.5 py-1 text-xs font-semibold tracking-widest uppercase transition-all duration-200',
                        locale === lang
                            ? isDark || !isScrolled
                                ? 'bg-white text-[#003f87]'
                                : 'bg-[#003f87] text-white'
                            : isDark || !isScrolled
                              ? 'text-white/60 hover:text-white'
                              : 'text-[#636366] hover:text-[#111111]',
                    )}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Desktop Nav Link
// ---------------------------------------------------------------------------
interface DesktopNavLinkProps {
    href: string;
    label: string;
    isScrolled: boolean;
    isActive: boolean;
}

function DesktopNavLink({ href, label, isScrolled, isActive }: DesktopNavLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group relative px-1 py-2 text-sm font-medium transition-colors duration-200',
                isScrolled
                    ? isActive
                        ? 'text-[#003f87]'
                        : 'text-[#111111] hover:text-[#003f87]'
                    : isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white',
            )}
        >
            {label}
            {/* Underline slide from left */}
            <span
                className={cn(
                    'absolute bottom-0 left-0 h-0.5 bg-[#c9a84c] transition-all duration-300 ease-out',
                    isActive ? 'w-full' : 'w-0 group-hover:w-full',
                )}
            />
        </Link>
    );
}

// ---------------------------------------------------------------------------
// Mobile Menu Overlay
// ---------------------------------------------------------------------------
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
    navLinks: NavLink[];
    currentPath: string;
    pengaturanName: string;
}

function MobileMenu({ isOpen, onClose, locale, navLinks, currentPath, pengaturanName }: MobileMenuProps) {
    const easeOut: Easing = 'easeOut';
    const cubicBezierOpen: Easing = [0.25, 0.46, 0.45, 0.94];
    const cubicBezierClose: Easing = [0.55, 0, 1, 0.45];

    const overlayVariants: Variants = {
        hidden: { opacity: 0, x: '100%' },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.35, ease: cubicBezierOpen },
        },
        exit: {
            opacity: 0,
            x: '100%',
            transition: { duration: 0.28, ease: cubicBezierClose },
        },
    };

    // linkVariants using 'custom' prop for per-item delay
    const linkVariants: Variants = {
        hidden: { opacity: 0, x: 30 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.1 + i * 0.06, duration: 0.35, ease: easeOut },
        }),
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    />

                    {/* Overlay panel */}
                    <motion.div
                        key="panel"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[#001f4d] shadow-2xl lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c9a84c]">
                                    <GraduationCap className="h-5 w-5 text-white" strokeWidth={1.5} />
                                </div>
                                <span className="text-sm font-semibold text-white/90">{pengaturanName}</span>
                            </div>
                            <button
                                id="mobile-menu-close"
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Nav links */}
                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
                            {navLinks.map((link, i) => {
                                const isActive =
                                    link.href === '/'
                                        ? currentPath === '/'
                                        : currentPath.startsWith(link.href);
                                return (
                                    <motion.div
                                        key={link.href}
                                        custom={i}
                                        variants={linkVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={cn(
                                                'group flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition-all duration-200',
                                                isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                                            )}
                                        >
                                            <span>
                                                {locale === 'id' ? link.label.id : link.label.en}
                                            </span>
                                            {isActive && (
                                                <ChevronRight
                                                    className="h-4 w-4 text-[#c9a84c]"
                                                    strokeWidth={1.5}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Bottom: Language toggle + CTA */}
                        <div className="border-t border-white/10 px-6 py-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-white/50">Bahasa:</span>
                                <LanguageToggle locale={locale} isScrolled={false} isDark />
                            </div>
                            <Link
                                href="/daftar"
                                onClick={onClose}
                                id="mobile-cta-daftar"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#a8821f] active:scale-[0.98]"
                            >
                                {locale === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ---------------------------------------------------------------------------
// Search Overlay
// ---------------------------------------------------------------------------
interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

function SearchOverlay({ isOpen, onClose, locale }: SearchOverlayProps) {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ artikel: any[]; jurusan: any[] }>({ artikel: [], jurusan: [] });
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Focus on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setKeyword('');
            setResults({ artikel: [], jurusan: [] });
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Perform quick search
    const performSearch = async (val: string) => {
        if (val.length < 2) {
            setResults({ artikel: [], jurusan: [] });
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/pencarian/cepat?q=${encodeURIComponent(val)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error('Search error', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setKeyword(val);
        setLoading(true);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        
        debounceTimeout.current = setTimeout(() => {
            performSearch(val);
        }, 400);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (keyword.length >= 2) {
            onClose();
            router.get('/pencarian', { q: keyword });
        }
    };

    const hasResults = results.artikel.length > 0 || results.jurusan.length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-0 md:pt-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-[#001f4d]/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative z-10 w-full max-w-2xl bg-white shadow-2xl md:rounded-2xl"
                    >
                        {/* Header & Input */}
                        <div className="flex items-center border-b p-4">
                            <Search className="h-5 w-5 text-gray-400 mr-3" />
                            <form onSubmit={handleSubmit} className="flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={locale === 'id' ? "Cari informasi, artikel, atau jurusan..." : "Search info, articles, or programs..."}
                                    className="w-full bg-transparent border-none text-lg text-gray-800 focus:outline-none focus:ring-0 p-0 placeholder-gray-400"
                                    value={keyword}
                                    onChange={handleInput}
                                />
                            </form>
                            {loading ? (
                                <Loader2 className="h-5 w-5 text-[#003f87] animate-spin ml-3" />
                            ) : (
                                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors ml-1">
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Results Body */}
                        {keyword.length >= 2 && (
                            <div className="max-h-[60vh] overflow-y-auto p-4">
                                {!loading && !hasResults && (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100 mb-3">
                                            <Search className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p>{locale === 'id' ? 'Tidak ada hasil yang ditemukan untuk' : 'No results found for'} "{keyword}"</p>
                                    </div>
                                )}

                                {results.jurusan.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Jurusan</h3>
                                        <div className="space-y-1">
                                            {results.jurusan.map((j) => (
                                                <Link
                                                    key={j.id}
                                                    href={j.url}
                                                    onClick={onClose}
                                                    className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span dangerouslySetInnerHTML={{ __html: j.title }} className="text-[#003f87] font-semibold text-sm" />
                                                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#c9a84c] transition-colors" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.artikel.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Artikel</h3>
                                        <div className="space-y-1">
                                            {results.artikel.map((a) => (
                                                <Link
                                                    key={a.id}
                                                    href={a.url}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: a.title }} className="text-gray-700 text-sm line-clamp-1 group-hover:text-[#003f87] transition-colors" />
                                                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#c9a84c] transition-colors ml-4 flex-shrink-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hasResults && (
                                    <div className="mt-4 pt-4 border-t text-center">
                                        <button
                                            onClick={handleSubmit}
                                            className="text-sm font-medium text-[#003f87] hover:text-[#001f4d] inline-flex items-center gap-1"
                                        >
                                            {locale === 'id' ? 'Lihat semua hasil pencarian' : 'See all search results'}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ---------------------------------------------------------------------------
// Navbar (main export)
// ---------------------------------------------------------------------------
export default function Navbar() {
    const { locale, pengaturan } = usePage<SharedProps>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { scrollY } = useScroll();

    // Detect scroll position
    useEffect(() => {
        return scrollY.on('change', (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '/';

    return (
        <>
            <motion.header
                id="main-navbar"
                initial={false}
                animate={{
                    backgroundColor: isScrolled
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'rgba(0, 0, 0, 0)',
                    backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
                    boxShadow: isScrolled
                        ? '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)'
                        : 'none',
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                    'fixed top-0 left-0 z-50 w-full',
                    isScrolled && 'border-b border-neutral-100',
                )}
            >
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* ── Logo Image Placeholder ── */}
                    <Link
                        href="/"
                        id="navbar-logo"
                        className="flex items-center flex-shrink-0 group"
                    >
                        {/*
                          Container gambar logo responsif
                          - h-9 (36px) s/d md:h-12 (48px)
                          - width dijaga proporsional melalui 'w-auto' atau 'object-contain'
                          Ganti value src di bawah dengan path gambar asli: misal '/images/logo-smk.png'
                        */}
                        <img
                            src="/smuhblig/logo-smk.png"
                            alt="Logo SMK Muhammadiyah Bligo"
                            className={cn(
                                'h-9 w-auto md:h-11 object-contain transition-all duration-300',
                                // Jika butuh efek cerah di navigasi gelap vs terang:
                                // !isScrolled ? 'brightness-0 invert' : ''
                            )}
                        />
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <nav
                        aria-label="Navigasi utama"
                        className="hidden lg:flex items-center gap-6"
                    >
                        {NAV_LINKS.map((link) => {
                            const isActive =
                                link.href === '/'
                                    ? currentPath === '/'
                                    : currentPath.startsWith(link.href);
                            return (
                                <DesktopNavLink
                                    key={link.href}
                                    href={link.href}
                                    label={locale === 'id' ? link.label.id : link.label.en}
                                    isScrolled={isScrolled}
                                    isActive={isActive}
                                />
                            );
                        })}
                    </nav>

                    {/* ── Right Actions ── */}
                    <div className="flex items-center gap-3">
                        {/* Language Toggle — desktop */}
                        <div className={cn(
                            'hidden lg:flex transition-colors duration-300',
                            isScrolled ? 'text-[#636366]' : 'text-white',
                        )}>
                            <LanguageToggle locale={locale} isScrolled={isScrolled} />
                        </div>

                        {/* Search Action */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Pencarian"
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 border bg-transparent hover:scale-105 active:scale-95',
                                isScrolled
                                    ? 'border-gray-200 text-[#111111] hover:bg-neutral-50 hover:border-gray-300'
                                    : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                            )}
                        >
                            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
                        </button>

                        {/* CTA Button */}
                        <Link
                            href="/daftar"
                            id="navbar-cta-daftar"
                            className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#a8821f] hover:shadow-md active:scale-[0.97]"
                        >
                            {locale === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                        </Link>

                        {/* Hamburger — mobile */}
                        <button
                            id="mobile-menu-toggle"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Buka menu"
                            aria-expanded={mobileOpen}
                            className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 lg:hidden',
                                isScrolled
                                    ? 'text-[#111111] hover:bg-neutral-100'
                                    : 'text-white hover:bg-white/10',
                            )}
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Content Overlays */}
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />

            {/* Mobile overlay */}
            <MobileMenu
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                locale={locale}
                navLinks={NAV_LINKS}
                currentPath={currentPath}
                pengaturanName={pengaturan?.site_name ?? 'SMK Muhammadiyah Bligo'}
            />
        </>
    );
}
