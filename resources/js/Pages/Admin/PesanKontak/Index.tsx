import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Pagination } from '@/Components/UI/Pagination';
import { cn } from '@/lib/utils';
import {
    Mail,
    Eye,
    Trash2,
    Archive,
    Inbox,
    RefreshCw,
    Filter,
} from 'lucide-react';
import type { PesanKontak, PaginatedData, SharedProps } from '@/types';

interface Props {
    pesans: PaginatedData<PesanKontak>;
    filters: { status?: string };
    totalBaru: number;
}

type StatusFilter = 'semua' | 'baru' | 'dibaca' | 'dibalas' | 'diarsip';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'semua', label: 'Semua' },
    { value: 'baru', label: 'Baru' },
    { value: 'dibaca', label: 'Dibaca' },
    { value: 'dibalas', label: 'Dibalas' },
    { value: 'diarsip', label: 'Diarsip' },
];

function StatusBadge({ status }: { status: PesanKontak['status'] }) {
    const variants: Record<PesanKontak['status'], { label: string; className: string }> = {
        baru:     { label: 'Baru',    className: 'bg-blue-100 text-blue-700 border border-blue-200' },
        dibaca:   { label: 'Dibaca',  className: 'bg-neutral-100 text-neutral-600 border border-neutral-200' },
        dibalas:  { label: 'Dibalas', className: 'bg-green-100 text-green-700 border border-green-200' },
        diarsip:  { label: 'Diarsip', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
    };
    const v = variants[status] ?? variants.dibaca;
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', v.className)}>
            {v.label}
        </span>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function Index({ pesans, filters, totalBaru }: Props) {
    const { props } = usePage<SharedProps>();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkArchiving, setBulkArchiving] = useState(false);

    const activeFilter = (filters.status ?? 'semua') as StatusFilter;

    const handleFilterChange = (value: StatusFilter) => {
        router.get('/admin/pesan', { status: value === 'semua' ? '' : value }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/admin/pesan/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === pesans.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pesans.data.map(p => p.id));
        }
    };

    const handleBulkArchive = () => {
        if (selectedIds.length === 0) return;
        setBulkArchiving(true);
        router.post('/admin/pesan/bulk-arsip', { ids: selectedIds }, {
            onSuccess: () => {
                setSelectedIds([]);
                setBulkArchiving(false);
            },
            onError: () => setBulkArchiving(false),
        });
    };

    return (
        <AdminLayout title="Pesan Masuk">
            <Head title="Pesan Masuk" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Mail className="w-6 h-6 text-[#003f87]" strokeWidth={1.5} />
                        Pesan Masuk
                        {totalBaru > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                                {totalBaru} baru
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola pesan dari form kontak publik website.
                    </p>
                </div>

                {selectedIds.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={handleBulkArchive}
                        className="flex items-center gap-2"
                    >
                        {bulkArchiving
                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                            : <Archive className="w-4 h-4" />
                        }
                        Arsipkan ({selectedIds.length})
                    </Button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-white rounded-xl border border-neutral-200 p-1 w-fit overflow-x-auto">
                {STATUS_OPTIONS.map(opt => (
                    <button
                        id={`filter-${opt.value}`}
                        key={opt.value}
                        onClick={() => handleFilterChange(opt.value)}
                        className={cn(
                            'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap',
                            activeFilter === opt.value
                                ? 'bg-[#003f87] text-white'
                                : 'text-neutral-600 hover:bg-neutral-100'
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Empty state */}
            {pesans.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-[#003f87]/10 rounded-2xl flex items-center justify-center mb-4">
                        <Inbox className="w-8 h-8 text-[#003f87]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">
                        {activeFilter === 'semua' ? 'Belum ada pesan masuk' : `Tidak ada pesan dengan status "${activeFilter}"`}
                    </h3>
                    <p className="text-neutral-500 text-sm max-w-xs">
                        Pesan dari form kontak publik akan muncul di sini.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50">
                                    <th className="w-10 px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            className="rounded border-neutral-300 text-[#003f87] focus:ring-[#003f87]"
                                            checked={selectedIds.length === pesans.data.length && pesans.data.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-neutral-600">Pengirim</th>
                                    <th className="px-4 py-3 text-left font-semibold text-neutral-600">Subjek</th>
                                    <th className="px-4 py-3 text-left font-semibold text-neutral-600">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-neutral-600">Tanggal</th>
                                    <th className="px-4 py-3 text-right font-semibold text-neutral-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pesans.data.map((pesan) => (
                                    <tr
                                        key={pesan.id}
                                        className={cn(
                                            'border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors',
                                            pesan.status === 'baru' && 'bg-blue-50/40 hover:bg-blue-50/60',
                                        )}
                                    >
                                        <td className="w-10 px-4 py-3.5">
                                            <input
                                                type="checkbox"
                                                className="rounded border-neutral-300 text-[#003f87] focus:ring-[#003f87]"
                                                checked={selectedIds.includes(pesan.id)}
                                                onChange={() => toggleSelect(pesan.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className={cn(
                                                'text-neutral-900',
                                                pesan.status === 'baru' && 'font-bold'
                                            )}>
                                                {pesan.nama}
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-0.5">{pesan.email}</p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className={cn(
                                                'text-neutral-700 max-w-xs truncate',
                                                pesan.status === 'baru' && 'font-semibold text-neutral-900'
                                            )}>
                                                {pesan.subjek}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <StatusBadge status={pesan.status} />
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-neutral-500 whitespace-nowrap">
                                            {formatDate(pesan.created_at)}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/pesan/${pesan.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1.5 px-3"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                        Lihat
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="px-3"
                                                    onClick={() => setDeleteId(pesan.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden space-y-3">
                        {pesans.data.map((pesan) => (
                            <div
                                key={pesan.id}
                                className={cn(
                                    'bg-white rounded-2xl border shadow-sm p-4',
                                    pesan.status === 'baru'
                                        ? 'border-blue-200 bg-blue-50/30'
                                        : 'border-neutral-100'
                                )}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            'text-sm text-neutral-900 truncate',
                                            pesan.status === 'baru' && 'font-bold'
                                        )}>
                                            {pesan.nama}
                                        </p>
                                        <p className="text-xs text-neutral-400 truncate">{pesan.email}</p>
                                    </div>
                                    <StatusBadge status={pesan.status} />
                                </div>
                                <p className={cn(
                                    'text-sm text-neutral-700 mb-3 line-clamp-1',
                                    pesan.status === 'baru' && 'font-semibold text-neutral-900'
                                )}>
                                    {pesan.subjek}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-400">{formatDate(pesan.created_at)}</span>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/pesan/${pesan.id}`}>
                                            <Button variant="outline" size="sm" className="flex items-center gap-1.5 px-3">
                                                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                Lihat
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="px-3"
                                            onClick={() => setDeleteId(pesan.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pesans.meta.last_page > 1 && (
                        <Pagination
                            currentPage={pesans.meta.current_page}
                            totalPages={pesans.meta.last_page}
                            onPageChange={(page) =>
                                router.get('/admin/pesan', { page, status: filters.status ?? '' })
                            }
                        />
                    )}
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Pesan"
                message="Hapus pesan ini secara permanen? Tindakan ini tidak dapat dibatalkan."
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
