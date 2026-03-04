import type { Variants, Easing } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, GraduationCap, ChevronRight } from 'lucide-react';
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
// Navbar (main export)
// ---------------------------------------------------------------------------
export default function Navbar() {
    const { locale, pengaturan } = usePage<SharedProps>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
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

                    {/* ── Logo ── */}
                    <Link
                        href="/"
                        id="navbar-logo"
                        className="flex items-center gap-3 flex-shrink-0 group"
                    >
                        <div
                            className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                                isScrolled
                                    ? 'bg-[#003f87]'
                                    : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30',
                            )}
                        >
                            <GraduationCap
                                className="h-5 w-5 text-white transition-colors duration-300"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <p
                                className={cn(
                                    'text-sm font-bold leading-none transition-colors duration-300',
                                    isScrolled ? 'text-[#003f87]' : 'text-white',
                                )}
                            >
                                SMK Muhammadiyah
                            </p>
                            <p className="text-xs font-medium leading-none mt-0.5 text-[#c9a84c] transition-colors duration-300">
                                Bligo
                            </p>
                        </div>
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
