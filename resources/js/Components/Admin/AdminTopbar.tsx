import { Bell, Menu, FileText, Mail, AlertCircle, Check, Inbox } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import { SharedProps, NotifikasiAdmin } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

interface AdminTopbarProps {
    title: string;
    onMenuClick: () => void;
}

// ─── Icon per notification type ──────────────────────────────────────────────
function NotifIcon({ tipe }: { tipe: string }) {
    const cls = 'w-4 h-4 flex-shrink-0';
    if (tipe === 'artikel_pending') return <FileText className={cls} strokeWidth={1.5} />;
    if (tipe === 'pesan_kontak') return <Mail className={cls} strokeWidth={1.5} />;
    return <AlertCircle className={cls} strokeWidth={1.5} />;
}

// ─── Notification item ────────────────────────────────────────────────────────
function NotifItem({
    notif,
    onRead,
}: {
    notif: NotifikasiAdmin;
    onRead: (id: number) => void;
}) {
    const handleClick = async () => {
        if (!notif.dibaca) {
            onRead(notif.id);
        }
    };

    const inner = (
        <div
            className={cn(
                'flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
                notif.dibaca
                    ? 'hover:bg-neutral-50'
                    : 'bg-[#eef5fc] hover:bg-[#dbeafb]',
            )}
        >
            <div
                className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                    notif.tipe === 'artikel_pending' && 'bg-[#003f87]/10 text-[#003f87]',
                    notif.tipe === 'pesan_kontak' && 'bg-[#c9a84c]/10 text-[#a8821f]',
                    !['artikel_pending', 'pesan_kontak'].includes(notif.tipe) &&
                        'bg-neutral-100 text-neutral-500',
                )}
            >
                <NotifIcon tipe={notif.tipe} />
            </div>
            <div className="flex-1 min-w-0">
                <p
                    className={cn(
                        'text-sm leading-snug truncate',
                        notif.dibaca ? 'text-neutral-600 font-normal' : 'text-neutral-900 font-semibold',
                    )}
                >
                    {notif.judul}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{notif.created_at}</p>
            </div>
            {!notif.dibaca && (
                <span className="w-2 h-2 rounded-full bg-[#003f87] mt-1.5 flex-shrink-0" />
            )}
        </div>
    );

    if (notif.url) {
        return (
            <Link href={notif.url} onClick={handleClick} className="block">
                {inner}
            </Link>
        );
    }

    return <div onClick={handleClick}>{inner}</div>;
}

// ─── Main Topbar ──────────────────────────────────────────────────────────────
export default function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;
    const initialCount = props.notifikasi_count ?? 0;

    // Local state for the dropdown
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<NotifikasiAdmin[]>([]);
    const [count, setCount] = useState<number>(initialCount);
    const [loading, setLoading] = useState(false);
    const bellRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Fetch recent notifications
    const fetchNotifs = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await fetch('/admin/notifikasi/recent', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!res.ok) return;
            const json = await res.json();
            setNotifs(json.items ?? []);
            setCount(json.count ?? 0);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Open dropdown + fetch
    const handleBellClick = () => {
        if (!open) {
            fetchNotifs();
        }
        setOpen((v) => !v);
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                bellRef.current &&
                !bellRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    // Mark single as read via AJAX
    const handleRead = async (id: number) => {
        try {
            await fetch(`/admin/notifikasi/ajax/${id}/baca`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
            });
            setNotifs((prev) =>
                prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)),
            );
            setCount((c) => Math.max(0, c - 1));
        } catch {
            // noop
        }
    };

    // Mark all read via AJAX
    const handleReadAll = async () => {
        try {
            await fetch('/admin/notifikasi/ajax/baca-semua', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
            });
            setNotifs((prev) => prev.map((n) => ({ ...n, dibaca: true })));
            setCount(0);
        } catch {
            // noop
        }
    };

    // Sync count from Inertia shared props on navigation
    useEffect(() => {
        setCount(initialCount);
    }, [initialCount]);

    return (
        <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-10 w-full">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-7xl mx-auto w-full gap-4">
                {/* Left: hamburger + title */}
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg md:text-xl font-semibold text-neutral-800 tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                        {title}
                    </h1>
                </div>

                {/* Right: bell + profile */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    {/* ── Notification Bell ── */}
                    <div className="relative">
                        <button
                            ref={bellRef}
                            type="button"
                            id="notif-bell"
                            aria-label="Notifikasi"
                            aria-expanded={open}
                            onClick={handleBellClick}
                            className={cn(
                                'relative p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
                                open
                                    ? 'bg-[#eef5fc] text-[#003f87]'
                                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100',
                            )}
                        >
                            <Bell className="w-5 h-5" strokeWidth={1.5} />
                            {count > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white leading-none">
                                    {count > 99 ? '99+' : count}
                                </span>
                            )}
                        </button>

                        {/* ── Desktop dropdown ── */}
                        {open && (
                            <div
                                ref={panelRef}
                                className="hidden sm:block absolute right-0 top-full mt-2 w-[380px] bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50"
                                style={{ maxHeight: 420 }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                                    <span className="text-sm font-semibold text-neutral-900">
                                        Notifikasi
                                        {count > 0 && (
                                            <span className="ml-2 text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-semibold">
                                                {count} baru
                                            </span>
                                        )}
                                    </span>
                                    {count > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleReadAll}
                                            className="flex items-center gap-1.5 text-xs font-medium text-[#003f87] hover:text-[#002d6b] transition-colors"
                                        >
                                            <Check className="w-3.5 h-3.5" strokeWidth={2} />
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                </div>

                                {/* List */}
                                <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-10">
                                            <div className="w-5 h-5 rounded-full border-2 border-[#003f87] border-t-transparent animate-spin" />
                                        </div>
                                    ) : notifs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-neutral-400">
                                            <Inbox className="w-8 h-8" strokeWidth={1} />
                                            <p className="text-sm">Tidak ada notifikasi</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-neutral-100">
                                            {notifs.map((n) => (
                                                <NotifItem key={n.id} notif={n} onRead={handleRead} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="border-t border-neutral-100 px-4 py-3">
                                    <Link
                                        href="/admin/notifikasi"
                                        onClick={() => setOpen(false)}
                                        className="block text-center text-xs font-semibold text-[#003f87] hover:text-[#002d6b] transition-colors"
                                    >
                                        Lihat Semua Notifikasi →
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ── Mobile drawer (right full-height) ── */}
                        {open && (
                            <>
                                <div
                                    className="sm:hidden fixed inset-0 bg-black/40 z-40"
                                    onClick={() => setOpen(false)}
                                />
                                <div
                                    ref={panelRef}
                                    className="sm:hidden fixed inset-y-0 right-0 w-80 max-w-full bg-white z-50 flex flex-col shadow-2xl"
                                >
                                    <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
                                        <span className="text-base font-semibold text-neutral-900">Notifikasi</span>
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {count > 0 && (
                                        <div className="px-4 py-2 border-b border-neutral-100">
                                            <button
                                                type="button"
                                                onClick={handleReadAll}
                                                className="flex items-center gap-1.5 text-xs font-medium text-[#003f87]"
                                            >
                                                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                                                Tandai semua dibaca
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-10">
                                                <div className="w-5 h-5 rounded-full border-2 border-[#003f87] border-t-transparent animate-spin" />
                                            </div>
                                        ) : notifs.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center gap-2 py-10 text-neutral-400">
                                                <Inbox className="w-8 h-8" strokeWidth={1} />
                                                <p className="text-sm">Tidak ada notifikasi</p>
                                            </div>
                                        ) : (
                                            notifs.map((n) => (
                                                <NotifItem key={n.id} notif={n} onRead={handleRead} />
                                            ))
                                        )}
                                    </div>
                                    <div className="border-t border-neutral-100 px-4 py-3">
                                        <Link
                                            href="/admin/notifikasi"
                                            onClick={() => setOpen(false)}
                                            className="block text-center text-sm font-semibold text-[#003f87]"
                                        >
                                            Lihat Semua Notifikasi →
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Profile ── */}
                    <div className="flex items-center gap-3 sm:border-l sm:border-neutral-200 sm:pl-6 cursor-pointer hover:bg-neutral-50 p-2 sm:-mr-2 rounded-lg transition-colors">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-medium text-neutral-800">{user?.name || 'Admin'}</span>
                            <span className="text-xs text-neutral-500 capitalize">{user?.role || 'Admin'}</span>
                        </div>
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-neutral-100 shrink-0"
                            />
                        ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#eef5fc] flex items-center justify-center ring-2 ring-neutral-100 shrink-0">
                                <span className="text-[#003f87] font-medium">{user?.name?.charAt(0) || 'A'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
