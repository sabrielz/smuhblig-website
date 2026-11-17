import React, { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Plus, Pen, Trash2, GripVertical, Search, Building2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Fasilitas, PaginatedData } from '@/types';

interface Props {
    fasilitas: PaginatedData<Fasilitas>;
    filters: {
        kategori?: string;
        search?: string;
    };
}

const KATEGORI_LABELS: Record<string, string> = {
    ruang_praktik: 'Ruang Praktik',
    umum: 'Umum',
    olahraga: 'Olahraga',
    ibadah: 'Ibadah',
};

const KATEGORI_BADGE_VARIANTS: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
    ruang_praktik: 'primary',
    umum: 'neutral',
    olahraga: 'warning',
    ibadah: 'success',
};

const KATEGORI_OPTIONS = [
    { value: '', label: 'Semua Kategori' },
    { value: 'ruang_praktik', label: 'Ruang Praktik' },
    { value: 'umum', label: 'Umum' },
    { value: 'olahraga', label: 'Olahraga' },
    { value: 'ibadah', label: 'Ibadah' },
];

export default function Index({ fasilitas, filters }: Props) {
    const [list, setList] = useState<Fasilitas[]>(fasilitas.data);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleFilterChange = (newKategori = kategori, newSearch = search) => {
        router.get(
            route('admin.fasilitas.index'),
            {
                kategori: newKategori || undefined,
                search: newSearch || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;

        const updated = [...list];
        const draggedItem = updated.splice(dragItem.current, 1)[0];
        updated.splice(dragOverItem.current, 0, draggedItem);

        dragItem.current = null;
        dragOverItem.current = null;
        setList(updated);

        const items = updated.map((item, index) => ({
            id: item.id,
            urutan: index + 1,
        }));

        router.post(
            route('admin.fasilitas.reorder'),
            { items },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Urutan fasilitas berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui urutan fasilitas.'),
            }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.fasilitas.destroy', { fasilita: deleteId }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Fasilitas berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus fasilitas.');
            },
        });
    };

    const columns: Column<Fasilitas>[] = [
        {
            key: 'urutan',
            label: '',
            width: '48px',
            render: (_item: Fasilitas) => {
                const index = list.findIndex((i) => i.id === _item.id);
                return (
                    <div
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 flex justify-center items-center py-2"
                        title="Geser untuk mengubah urutan"
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                );
            },
        },
        {
            key: 'nama',
            label: 'Foto & Nama Fasilitas',
            render: (item: Fasilitas) => (
                <div className="flex items-center gap-3">
                    <div className="w-14 h-10 rounded-md bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200">
                        {item.cover_url ? (
                            <img
                                src={item.cover_url}
                                alt={item.translations.id.nama}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-neutral-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-neutral-900">{item.translations.id.nama}</div>
                        {item.translations.en?.nama && (
                            <div className="text-xs text-neutral-500 italic">{item.translations.en.nama}</div>
                        )}
                        <div className="text-xs text-neutral-400 mt-0.5">
                            {item.media.length} foto terunggah
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item: Fasilitas) => (
                <Badge variant={KATEGORI_BADGE_VARIANTS[item.kategori] || 'neutral'}>
                    {KATEGORI_LABELS[item.kategori] || item.kategori}
                </Badge>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item: Fasilitas) => (
                <Badge variant={item.is_active ? 'success' : 'neutral'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            width: '120px',
            render: (item: Fasilitas) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Link href={route('admin.fasilitas.edit', { fasilita: item.id })}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Fasilitas">
                            <Pen className="w-4 h-4 text-neutral-600" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Hapus Fasilitas"
                        onClick={() => setDeleteId(item.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola Fasilitas">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                            <Building2 className="w-7 h-7 text-primary-600" />
                            Kelola Fasilitas
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Manajemen sarana dan prasarana sekolah untuk publik.
                        </p>
                    </div>
                    <Link href={route('admin.fasilitas.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Fasilitas
                        </Button>
                    </Link>
                </div>

                {/* Filter & Pencarian */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <Input
                            placeholder="Cari nama fasilitas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(kategori, search)}
                            className="pl-9"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={kategori}
                            options={KATEGORI_OPTIONS}
                            onChange={(e) => {
                                setKategori(e.target.value);
                                handleFilterChange(e.target.value, search);
                            }}
                        />
                    </div>
                    {(search || kategori) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                setKategori('');
                                handleFilterChange('', '');
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
                    <Table
                        columns={columns}
                        data={list}
                    />
                    {list.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Tidak ada data fasilitas yang ditemukan.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Fasilitas"
                message="Apakah Anda yakin ingin menghapus data fasilitas ini? Foto-foto terkait juga akan dihapus permanen."
                confirmLabel="Hapus"
                variant="danger"
            />
        </AdminLayout>
    );
}
