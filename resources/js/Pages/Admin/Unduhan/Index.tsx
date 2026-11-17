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
import { Plus, Pen, Trash2, Search, FileDown, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Unduhan, PaginatedData } from '@/types';

interface Props {
    unduhan: PaginatedData<Unduhan>;
    filters: {
        kategori?: string;
        search?: string;
    };
}

const KATEGORI_OPTIONS = [
    { value: '', label: 'Semua Kategori' },
    { value: 'brosur', label: 'Brosur' },
    { value: 'kalender', label: 'Kalender Akademik' },
    { value: 'formulir', label: 'Formulir' },
    { value: 'sk', label: 'Surat Keputusan (SK)' },
    { value: 'lainnya', label: 'Lainnya' },
];

const KATEGORI_LABELS: Record<string, string> = {
    brosur: 'Brosur',
    kalender: 'Kalender Akademik',
    formulir: 'Formulir',
    sk: 'Surat Keputusan (SK)',
    lainnya: 'Lainnya',
};

const KATEGORI_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    brosur: 'primary',
    kalender: 'warning',
    formulir: 'success',
    sk: 'gold',
    lainnya: 'neutral',
};

export default function Index({ unduhan, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');

    const handleFilterChange = (newKategori = kategori, newSearch = search) => {
        router.get(
            route('admin.unduhan.index'),
            {
                kategori: newKategori || undefined,
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

        router.delete(route('admin.unduhan.destroy', { unduhan: deleteId }), {
            onSuccess: () => {
                toast.success('Dokumen unduhan berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus dokumen unduhan');
                setDeleteId(null);
            },
        });
    };

    const columns: Column<Unduhan>[] = [
        {
            key: 'judul',
            label: 'Judul & Berkas',
            render: (item) => (
                <div className="flex flex-col gap-1 max-w-md">
                    <span className="font-semibold text-neutral-900 line-clamp-2">
                        {item.translations?.id?.judul || item.judul || '-'}
                    </span>
                    {item.file ? (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <FileDown className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                            <span className="truncate">{item.file.file_name}</span>
                            <span className="text-neutral-400">({item.file.human_size})</span>
                        </div>
                    ) : (
                        <span className="text-xs text-neutral-400 italic">Belum ada berkas</span>
                    )}
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item) => (
                <Badge variant={KATEGORI_BADGE_VARIANTS[item.kategori] || 'neutral'}>
                    {KATEGORI_LABELS[item.kategori] || item.kategori}
                </Badge>
            ),
        },
        {
            key: 'tanggal_terbit',
            label: 'Tanggal Terbit',
            render: (item) => (
                <span className="text-sm text-neutral-600">
                    {item.tanggal_terbit ? new Date(item.tanggal_terbit).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : '-'}
                </span>
            ),
        },
        {
            key: 'jumlah_unduh',
            label: 'Diunduh',
            render: (item) => (
                <div className="flex items-center gap-1 text-sm text-neutral-600 font-medium">
                    <Download className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{item.jumlah_unduh.toLocaleString('id-ID')}x</span>
                </div>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item) => (
                <Badge variant={item.is_active ? 'success' : 'neutral'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '120px',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link href={route('admin.unduhan.edit', { unduhan: item.id })}>
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
        <AdminLayout title="Unduhan Dokumen">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Unduhan Dokumen</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola berkas resmi sekolah seperti brosur, formulir, SK, dan dokumen lainnya.
                        </p>
                    </div>
                    <Link href={route('admin.unduhan.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Dokumen
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Cari judul berkas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(kategori, search)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            options={KATEGORI_OPTIONS}
                            value={kategori}
                            onChange={(e) => {
                                setKategori(e.target.value);
                                handleFilterChange(e.target.value, search);
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleFilterChange(kategori, search)}
                            >
                                Terapkan Filter
                            </Button>
                            {(kategori || search) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setKategori('');
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
                        data={unduhan.data}
                    />
                    {unduhan.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada dokumen unduhan yang terdaftar.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {unduhan.meta.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <Pagination
                            currentPage={unduhan.meta.current_page}
                            totalPages={unduhan.meta.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.unduhan.index'),
                                    {
                                        page,
                                        kategori: kategori || undefined,
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
                    title="Hapus Dokumen Unduhan"
                    message="Apakah Anda yakin ingin menghapus dokumen ini beserta berkas fisiknya? Tindakan ini tidak dapat dibatalkan."
                    confirmLabel="Hapus"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
