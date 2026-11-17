import type { Variants, Easing } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, ChevronRight, ChevronDown, Search, Loader2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { SharedProps } from '@/types';
import { NavDropdown } from '@/Components/Layout/NavDropdown';

// ---------------------------------------------------------------------------
// Nav links definition
// ---------------------------------------------------------------------------
export interface NavItem {
    labelKey: string;
    href?: string;
    children?: Array<{
        labelKey: string;
        href: string;
    }>;
}

const NAV_LINKS: NavItem[] = [
    { labelKey: 'nav.home', href: '/' },
    {
        labelKey: 'nav.profile',
        children: [
            { labelKey: 'nav.about', href: '/tentang' },
            { labelKey: 'nav.teachers', href: '/guru' },
            { labelKey: 'nav.facilities', href: '/fasilitas' },
            { labelKey: 'nav.extracurricular', href: '/ekstrakurikuler' },
            { labelKey: 'nav.achievements', href: '/prestasi' },
        ],
    },
    { labelKey: 'nav.programs', href: '/jurusan' },
    {
        labelKey: 'nav.information',
        children: [
            { labelKey: 'nav.news', href: '/berita' },
            { labelKey: 'nav.announcements', href: '/pengumuman' },
            { labelKey: 'nav.events', href: '/agenda' },
            { labelKey: 'nav.downloads', href: '/unduhan' },
            { labelKey: 'nav.faq', href: '/faq' },
        ],
    },
    { labelKey: 'nav.gallery', href: '/galeri' },
    { labelKey: 'nav.contact', href: '/kontak' },
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
            isDark || !isScrolled ? 'border-white/20' : 'border-neutral-100',
        )}>
            {(['id', 'en'] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => handleLocaleChange(lang)}
                    aria-label={`Ganti bahasa ke ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}`}
                    className={cn(
                        'px-2 py-0.5 text-xs font-semibold rounded-md transition-all duration-200',
                        locale === lang
                            ? 'bg-gold-500 text-white shadow-xs'
                            : isDark || !isScrolled
                                ? 'text-white/70 hover:text-white'
                                : 'text-neutral-500 hover:text-neutral-900',
                    )}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Desktop Nav Link item
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
                'group relative py-1 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-md px-1',
                isActive
                    ? isScrolled
                        ? 'text-primary-600 font-semibold'
                        : 'text-white font-semibold'
                    : isScrolled
                        ? 'text-neutral-700 hover:text-primary-600'
                        : 'text-white/80 hover:text-white',
            )}
        >
            <span>{label}</span>
            {isActive && (
                <span
                    className={cn(
                        'absolute bottom-0 left-1 right-1 h-0.5 rounded-full',
                        isScrolled ? 'bg-primary-600' : 'bg-gold-500',
                    )}
                    aria-hidden="true"
                />
            )}
        </Link>
    );
}

// ---------------------------------------------------------------------------
// Mobile Nav Menu (full-screen drawer)
// ---------------------------------------------------------------------------
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
    navLinks: NavItem[];
    currentPath: string;
    pengaturanName: string;
    spmbUrl?: string | null;
    multibahasaEnabled: boolean;
}

interface MobileGroupProps {
    link: NavItem;
    index: number;
    currentPath: string;
    onClose: () => void;
    linkVariants: Variants;
}

function MobileNavGroup({ link, index, currentPath, onClose, linkVariants }: MobileGroupProps) {
    const { t } = useTranslation();
    const isChildActive = (link.children || []).some((c) =>
        c.href === '/' ? currentPath === '/' : currentPath.startsWith(c.href)
    );
    const [accordionOpen, setAccordionOpen] = useState(isChildActive);

    return (
        <motion.div
            custom={index}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
        >
            <button
                type="button"
                onClick={() => setAccordionOpen(!accordionOpen)}
                className={cn(
                    'w-full flex items-center justify-between px-4 py-4 text-lg font-medium transition-all duration-200 rounded-xl',
                    isChildActive || accordionOpen
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
            >
                <span>{t(link.labelKey)}</span>
                <ChevronDown
                    className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        accordionOpen ? 'rotate-180 text-gold-500' : 'text-white/60'
                    )}
                />
            </button>

            {accordionOpen && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-white/5 rounded-b-xl">
                    {(link.children || []).map((child) => {
                        const isItemActive =
                            child.href === '/'
                                ? currentPath === '/'
                                : currentPath.startsWith(child.href);
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                                    isItemActive
                                        ? 'text-gold-400 font-semibold'
                                        : 'text-white/70 hover:text-white'
                                )}
                            >
                                <span>{t(child.labelKey)}</span>
                                {isItemActive && (
                                    <ChevronRight className="h-4 w-4 text-gold-500" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

function MobileMenu({
    isOpen,
    onClose,
    locale,
    navLinks,
    currentPath,
    pengaturanName,
    spmbUrl,
    multibahasaEnabled,
}: MobileMenuProps) {
    const { t } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);

    // Trap focus inside mobile menu
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;

            const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled])',
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        firstFocusableRef.current?.focus();

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' as Easing } },
        exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' as Easing } },
    };

    const drawerVariants: Variants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: { type: 'spring', damping: 28, stiffness: 280 },
        },
        exit: {
            x: '100%',
            transition: { duration: 0.22, ease: 'easeInOut' as Easing },
        },
    };

    const linkVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05 + 0.1, duration: 0.25, ease: 'easeOut' as Easing },
        }),
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        key="drawer"
                        ref={menuRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu navigasi"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-primary-900 text-white shadow-2xl lg:hidden"
                    >
                        {/* Header: Logo & Close */}
                        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-3 group"
                            >
                                <img
                                    src="/smuhblig/logo-smk.png"
                                    alt="Logo SMK Muhammadiyah Bligo"
                                    className="h-9 w-auto object-contain"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold leading-tight text-white">
                                        {pengaturanName}
                                    </span>
                                    <span className="text-[11px] text-gold-500 font-medium">
                                        Pekalongan
                                    </span>
                                </div>
                            </Link>

                            <button
                                ref={firstFocusableRef}
                                onClick={onClose}
                                aria-label="Tutup menu"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Nav Links */}
                        <nav
                            aria-label="Navigasi mobile"
                            className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
                        >
                            {navLinks.map((link, i) => {
                                if (link.children) {
                                    return (
                                        <MobileNavGroup
                                            key={`mobile-group-${i}`}
                                            link={link}
                                            index={i}
                                            currentPath={currentPath}
                                            onClose={onClose}
                                            linkVariants={linkVariants}
                                        />
                                    );
                                }

                                const isActive =
                                    link.href === '/'
                                        ? currentPath === '/'
                                        : currentPath.startsWith(link.href || '');
                                return (
                                    <motion.div
                                        key={link.href}
                                        custom={i}
                                        variants={linkVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Link
                                            href={link.href || '/'}
                                            onClick={onClose}
                                            className={cn(
                                                'group flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition-all duration-200',
                                                isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                                            )}
                                        >
                                            <span>
                                                {t(link.labelKey)}
                                            </span>
                                            {isActive && (
                                                <ChevronRight
                                                    className="h-4 w-4 text-gold-500"
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
                            {multibahasaEnabled && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-white/50">{t('nav.language')}</span>
                                    <LanguageToggle locale={locale} isScrolled={false} isDark />
                                </div>
                            )}
                            {spmbUrl && (
                                <a
                                    href={spmbUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    id="mobile-cta-daftar"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-gold-600 active:scale-[0.98]"
                                >
                                    {t('nav.register_now')}
                                </a>
                            )}
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
}

function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const { t } = useTranslation();
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ artikel: any[]; jurusan: any[] }>({ artikel: [], jurusan: [] });
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                        className="absolute inset-0 bg-primary-900/80 backdrop-blur-md"
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
                                    placeholder={t('nav.search_placeholder')}
                                    className="w-full bg-transparent border-none text-lg text-gray-800 focus:outline-none focus:ring-0 p-0 placeholder-gray-400"
                                    value={keyword}
                                    onChange={handleInput}
                                />
                            </form>
                            {loading ? (
                                <Loader2 className="h-5 w-5 text-primary-600 animate-spin ml-3" />
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
                                        <p>{t('nav.search_no_results')} "{keyword}"</p>
                                    </div>
                                )}

                                {results.jurusan.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                                            {t('nav.search_categories.programs')}
                                        </h3>
                                        <div className="space-y-1">
                                            {results.jurusan.map((j) => (
                                                <Link
                                                    key={j.id}
                                                    href={j.url}
                                                    onClick={onClose}
                                                    className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span dangerouslySetInnerHTML={{ __html: j.title }} className="text-primary-600 font-semibold text-sm" />
                                                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gold-500 transition-colors" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.artikel.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                                            {t('nav.search_categories.articles')}
                                        </h3>
                                        <div className="space-y-1">
                                            {results.artikel.map((a) => (
                                                <Link
                                                    key={a.id}
                                                    href={a.url}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: a.title }} className="text-gray-700 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors" />
                                                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gold-500 transition-colors ml-4 flex-shrink-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hasResults && (
                                    <div className="mt-4 pt-4 border-t text-center">
                                        <button
                                            onClick={handleSubmit}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
                                        >
                                            {t('nav.search_view_all')}
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
    const { t } = useTranslation();
    const { locale, pengaturan } = usePage<SharedProps>().props;
    const multibahasaEnabled = pengaturan?.multibahasa_enabled ?? true;
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
                        <img
                            src="/smuhblig/logo-smk.png"
                            alt="Logo SMK Muhammadiyah Bligo"
                            className={cn(
                                'h-9 w-auto md:h-11 object-contain transition-all duration-300',
                            )}
                        />
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <nav
                        aria-label="Navigasi utama"
                        className="hidden lg:flex items-center gap-6"
                    >
                        {NAV_LINKS.map((link, idx) => {
                            if (link.children) {
                                return (
                                    <NavDropdown
                                        key={`dropdown-${idx}`}
                                        labelKey={link.labelKey}
                                        items={link.children}
                                        currentPath={currentPath}
                                        isScrolled={isScrolled}
                                    />
                                );
                            }

                            const isActive =
                                link.href === '/'
                                    ? currentPath === '/'
                                    : currentPath.startsWith(link.href || '');
                            return (
                                <DesktopNavLink
                                    key={link.href}
                                    href={link.href || '/'}
                                    label={t(link.labelKey)}
                                    isScrolled={isScrolled}
                                    isActive={isActive}
                                />
                            );
                        })}
                    </nav>

                    {/* ── Right Actions ── */}
                    <div className="flex items-center gap-3">
                        {/* Language Toggle — desktop */}
                        {multibahasaEnabled && (
                            <div className={cn(
                                'hidden lg:flex transition-colors duration-300',
                                isScrolled ? 'text-neutral-500' : 'text-white',
                            )}>
                                <LanguageToggle locale={locale} isScrolled={isScrolled} />
                            </div>
                        )}

                        {/* Search Action */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Pencarian"
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 border bg-transparent hover:scale-105 active:scale-95',
                                isScrolled
                                    ? 'border-gray-200 text-neutral-900 hover:bg-neutral-50 hover:border-gray-300'
                                    : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                            )}
                        >
                            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
                        </button>

                        {/* CTA Button */}
                        <Link
                            href="https://portal.smkmuhbligo.sch.id/"
                            id="navbar-cta-daftar"
                            className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-all duration-200 hover:bg-neutral-200 hover:shadow-md active:scale-[0.97]"
                        >
                            {t('nav.portal')}
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
                                    ? 'text-neutral-900 hover:bg-neutral-100'
                                    : 'text-white hover:bg-white/10',
                            )}
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Content Overlays */}
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Mobile overlay */}
            <MobileMenu
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                locale={locale}
                navLinks={NAV_LINKS}
                currentPath={currentPath}
                pengaturanName={pengaturan?.site_name ?? 'SMK Muhammadiyah Bligo'}
                spmbUrl={pengaturan?.spmb_url}
                multibahasaEnabled={pengaturan?.multibahasa_enabled ?? true}
            />
        </>
    );
}
