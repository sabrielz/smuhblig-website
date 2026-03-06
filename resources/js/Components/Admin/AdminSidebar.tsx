import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, Image as ImageIcon, Bell, BookOpen, Link as LinkIcon, Users, Settings, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SharedProps } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { url, props } = usePage<SharedProps>();
    const user = props.auth.user;
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isDesktop) {
            setIsOpen(false);
        }
    }, [url, isDesktop, setIsOpen]);

    const navGroups = [
        {
            label: null,
            items: [
                { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            ]
        },
        {
            label: 'Konten',
            items: [
                { label: 'Artikel', href: '/admin/artikel', icon: FileText },
                { label: 'Galeri', href: '/admin/galeri', icon: ImageIcon },
                { label: 'Pengumuman', href: '/admin/pengumuman', icon: Bell },
            ]
        },
        {
            label: 'Sekolah',
            items: [
                { label: 'Jurusan', href: '/admin/jurusan', icon: BookOpen },
                { label: 'Tautan', href: '/admin/tautan', icon: LinkIcon },
            ]
        },
        ...(user?.is_admin ? [{
            label: 'Sistem',
            items: [
                { label: 'Pengguna', href: '/admin/pengguna', icon: Users },
                { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
            ]
        }] : []),
    ];

    const isActive = (href: string) => {
        if (href === '/admin/dashboard' && (url === '/admin' || url === '/admin/dashboard')) return true;
        return url.startsWith(href);
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && !isDesktop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className="w-[240px] fixed inset-y-0 left-0 bg-primary-900 flex flex-col pt-6 pb-4 z-50 lg:!transform-none"
                initial={false}
                animate={{ x: isDesktop || isOpen ? 0 : -240 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            >
                <div className="px-6 mb-6 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-lg leading-none">M</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm leading-tight tracking-wide">CMS Admin</span>
                            <span className="text-white/60 text-xs">SMK Muh Bligo</span>
                        </div>
                    </Link>

                    {/* Tombol Close hanya di mobile */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-white/50 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-px bg-white/10 mx-6 mb-6" />

                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                    {navGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="mb-6">
                            {group.label && (
                                <h3 className="px-4 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                    {group.label}
                                </h3>
                            )}
                            <nav className="flex flex-col gap-1">
                                {group.items.map((item, itemIdx) => {
                                    const active = isActive(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={itemIdx}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors min-h-[44px]",
                                                "text-sm font-medium",
                                                active
                                                    ? "text-white bg-white/20 border-l-[3px] border-gold-500"
                                                    : "text-white/70 hover:text-white hover:bg-white/10 border-l-[3px] border-transparent"
                                            )}
                                        >
                                            <Icon className={cn("w-4 h-4", active ? "text-gold-500" : "opacity-70")} strokeWidth={1.5} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                <div className="px-4 mt-auto">
                    <div className="h-px bg-white/10 mb-4 mx-2" />
                    <div className="flex items-center justify-between px-2 py-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-medium">
                                        {user?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-white text-sm font-medium truncate max-w-[120px]">{user?.name || 'Administrator'}</span>
                                <span className="text-white/50 text-xs truncate max-w-[120px]">{user?.role || 'Admin'}</span>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-white/50 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/10 transition-colors shrink-0"
                            title="Keluar"
                        >
                            <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
