import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Pagination } from '@/Components/UI/Pagination';
import { Plus, Pen, Trash2, Search, Quote, CheckCircle2, XCircle, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Testimoni, PaginatedData } from '@/types';

interface Props {
    testimoni: PaginatedData<Testimoni>;
    filters: {
        peran?: string;
        search?: string;
    };
}

const PERAN_OPTIONS = [
    { value: '', label: 'Semua Peran' },
    { value: 'alumni', label: 'Alumni' },
    { value: 'orang_tua', label: 'Orang Tua' },
    { value: 'mitra', label: 'Mitra Industri' },
];

const PERAN_LABELS: Record<string, string> = {
    alumni: 'Alumni',
    orang_tua: 'Orang Tua Siswa',
    mitra: 'Mitra Industri',
};

const PERAN_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    alumni: 'primary',
    orang_tua: 'gold',
    mitra: 'success',
};

export default function Index({ testimoni, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [peran, setPeran] = useState(filters.peran || '');

    const handleFilterChange = (newPeran = peran, newSearch = search) => {
        router.get(
            route('admin.testimoni.index'),
            {
                peran: newPeran || undefined,
                search: newSearch || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.testimoni.destroy', { testimoni: deleteId }), {
            onSuccess: () => {
                toast.success('Testimoni berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus testimoni');
                setDeleteId(null);
            },
        });
    };

    const columns: Column<Testimoni>[] = [
        {
            key: 'nama',
            label: 'Narasumber & Kutipan',
            render: (item) => (
                <div className="flex items-start gap-3 max-w-md">
                    {item.foto_url ? (
                        <img
                            src={item.foto_url}
                            alt={item.nama}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 font-bold text-xs">
                            {item.nama.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-neutral-900 line-clamp-1">{item.nama}</span>
                        <span className="text-xs text-neutral-500 line-clamp-1">{item.keterangan}</span>
                        <span className="text-xs text-neutral-600 italic line-clamp-2 mt-1">
                            "{item.translations?.id?.kutipan || item.kutipan || '-'}"
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'peran',
            label: 'Peran',
            render: (item) => (
                <Badge variant={PERAN_BADGE_VARIANTS[item.peran] || 'neutral'}>
                    {PERAN_LABELS[item.peran] || item.peran}
                </Badge>
            ),
        },
        {
            key: 'persetujuan_tampil',
            label: 'Izin Tampil',
            render: (item) => (
                <div className="flex items-center gap-1.5 text-xs font-medium">
                    {item.persetujuan_tampil ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Disetujui
                        </span>
                    ) : (
                        <span className="text-amber-700 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-amber-600" /> Belum Izin
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'urutan',
            label: 'No. Urut',
            render: (item) => (
                <span className="text-sm text-neutral-600 font-medium">{item.urutan}</span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item) => (
                <Badge variant={item.is_active && item.persetujuan_tampil ? 'success' : 'neutral'}>
                    {item.is_active && item.persetujuan_tampil ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '120px',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link href={route('admin.testimoni.edit', { testimoni: item.id })}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit">
                            <Pen className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => setDeleteId(item.id)}
                        title="Hapus"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola Testimoni">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Kelola Testimoni</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Manajemen testimoni alumni, orang tua, dan mitra industri sebagai bukti sosial sekolah.
                        </p>
                    </div>
                    <Link href={route('admin.testimoni.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Testimoni
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Cari nama, keterangan, atau kutipan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(peran, search)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            options={PERAN_OPTIONS}
                            value={peran}
                            onChange={(e) => {
                                setPeran(e.target.value);
                                handleFilterChange(e.target.value, search);
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleFilterChange(peran, search)}
                            >
                                Terapkan Filter
                            </Button>
                            {(peran || search) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setPeran('');
                                        setSearch('');
                                        handleFilterChange('', '');
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
                    <Table
                        columns={columns}
                        data={testimoni.data}
                    />
                    {testimoni.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada testimoni yang terdaftar.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {testimoni.meta.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <Pagination
                            currentPage={testimoni.meta.current_page}
                            totalPages={testimoni.meta.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.testimoni.index'),
                                    {
                                        page,
                                        peran: peran || undefined,
                                        search: search || undefined,
                                    },
                                    { preserveState: true }
                                );
                            }}
                        />
                    </div>
                )}

                {/* Dialog Hapus */}
                <ConfirmDialog
                    isOpen={deleteId !== null}
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Hapus Testimoni"
                    message="Apakah Anda yakin ingin menghapus data testimoni ini? Tindakan ini tidak dapat dibatalkan."
                    confirmLabel="Hapus"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
