import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, Bell, Check, FileText, Inbox, Mail, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotifikasiAdmin, PaginatedData, SharedProps } from '@/types';
import toast from 'react-hot-toast';

interface Props {
    notifikasi: PaginatedData<NotifikasiAdmin>;
    activeFilter: 'semua' | 'belum' | 'sudah';
    belumDibacaCount: number;
}

function NotifIcon({ tipe }: { tipe: string }) {
    const cls = 'w-5 h-5 flex-shrink-0';
    if (tipe === 'artikel_pending') return <FileText className={cls} strokeWidth={1.5} />;
    if (tipe === 'pesan_kontak') return <Mail className={cls} strokeWidth={1.5} />;
    return <AlertCircle className={cls} strokeWidth={1.5} />;
}

function tipeLabel(tipe: string): string {
    const map: Record<string, string> = {
        artikel_pending: 'Artikel',
        pesan_kontak: 'Pesan',
        ai_selesai: 'AI',
    };
    return map[tipe] ?? 'Sistem';
}

export default function NotifikasiIndex({ notifikasi, activeFilter, belumDibacaCount }: Props) {
    const { props } = usePage<SharedProps>();

    const getCsrfToken = () =>
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';

    const filters = [
        { key: 'semua', label: 'Semua', href: '/admin/notifikasi?filter=semua' },
        { key: 'belum', label: 'Belum Dibaca', href: '/admin/notifikasi?filter=belum' },
        { key: 'sudah', label: 'Sudah Dibaca', href: '/admin/notifikasi?filter=sudah' },
    ];

    const handleMarkAll = () => {
        router.post('/admin/notifikasi/baca-semua', {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Semua notifikasi ditandai dibaca'),
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/notifikasi/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Notifikasi dihapus'),
        });
    };

    const handleRead = async (notif: NotifikasiAdmin) => {
        if (!notif.dibaca) {
            try {
                await fetch(`/admin/notifikasi/ajax/${notif.id}/baca`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                });
            } catch {
                // noop
            }
        }
        if (notif.url) {
            router.visit(notif.url);
        }
    };

    return (
        <AdminLayout title="Notifikasi">
            <Head title="Notifikasi - CMS Admin" />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-[#003f87]" strokeWidth={1.5} />
                        Notifikasi
                        {belumDibacaCount > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                {belumDibacaCount} baru
                            </span>
                        )}
                    </h1>
                    <p className="text-neutral-500 text-sm mt-1">
                        Semua notifikasi sistem untuk akun Anda.
                    </p>
                </div>
                {belumDibacaCount > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAll}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003f87] text-white text-sm font-semibold hover:bg-[#002d6b] transition-colors shadow-sm"
                    >
                        <Check className="w-4 h-4" strokeWidth={2} />
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-5 p-1 bg-neutral-100 rounded-xl w-fit">
                {filters.map((f) => (
                    <Link
                        key={f.key}
                        href={f.href}
                        className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            activeFilter === f.key
                                ? 'bg-white text-[#003f87] shadow-sm font-semibold'
                                : 'text-neutral-500 hover:text-neutral-800',
                        )}
                    >
                        {f.label}
                    </Link>
                ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                {notifikasi.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
                        <Inbox className="w-12 h-12" strokeWidth={0.8} />
                        <p className="text-base font-medium">Tidak ada notifikasi</p>
                        <p className="text-sm">
                            {activeFilter === 'belum'
                                ? 'Semua notifikasi sudah dibaca.'
                                : 'Belum ada notifikasi yang masuk.'}
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-neutral-100">
                        {notifikasi.data.map((notif) => (
                            <li
                                key={notif.id}
                                className={cn(
                                    'flex items-start gap-4 px-4 sm:px-6 py-4 transition-colors',
                                    !notif.dibaca && 'bg-[#eef5fc]/50',
                                )}
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                                        notif.tipe === 'artikel_pending' && 'bg-[#003f87]/10 text-[#003f87]',
                                        notif.tipe === 'pesan_kontak' && 'bg-[#c9a84c]/10 text-[#a8821f]',
                                        !['artikel_pending', 'pesan_kontak'].includes(notif.tipe) &&
                                            'bg-neutral-100 text-neutral-500',
                                    )}
                                >
                                    <NotifIcon tipe={notif.tipe} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                            {tipeLabel(notif.tipe)}
                                        </span>
                                        {!notif.dibaca && (
                                            <span className="w-2 h-2 rounded-full bg-[#003f87] flex-shrink-0" />
                                        )}
                                    </div>
                                    <p
                                        className={cn(
                                            'text-sm leading-snug',
                                            notif.dibaca ? 'text-neutral-600' : 'text-neutral-900 font-semibold',
                                        )}
                                    >
                                        {notif.judul}
                                    </p>
                                    {notif.pesan && (
                                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                                            {notif.pesan}
                                        </p>
                                    )}
                                    <p className="text-xs text-neutral-400 mt-1">{notif.created_at}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                                    {notif.url && (
                                        <button
                                            type="button"
                                            onClick={() => handleRead(notif)}
                                            className="text-xs font-medium text-[#003f87] hover:text-[#002d6b] px-3 py-1.5 rounded-lg hover:bg-[#eef5fc] transition-colors"
                                        >
                                            Lihat
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(notif.id)}
                                        className="p-1.5 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Hapus notifikasi"
                                    >
                                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pagination */}
            {notifikasi.meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    {notifikasi.links.prev && (
                        <Link
                            href={notifikasi.links.prev}
                            className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                            ← Sebelumnya
                        </Link>
                    )}
                    <span className="text-sm text-neutral-500">
                        Halaman {notifikasi.meta.current_page} dari {notifikasi.meta.last_page}
                    </span>
                    {notifikasi.links.next && (
                        <Link
                            href={notifikasi.links.next}
                            className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                            Berikutnya →
                        </Link>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
