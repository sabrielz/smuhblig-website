import React, { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Plus, Pen, Trash2, GripVertical, Search, Activity, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Ekstrakurikuler, PaginatedData } from '@/types';

interface Props {
    ekskulList: PaginatedData<Ekstrakurikuler>;
    filters: {
        search?: string;
    };
}

export default function Index({ ekskulList, filters }: Props) {
    const [list, setList] = useState<Ekstrakurikuler[]>(ekskulList.data);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSearch = (query = search) => {
        router.get(
            route('admin.ekstrakurikuler.index'),
            { search: query || undefined },
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
            route('admin.ekstrakurikuler.reorder'),
            { items },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Urutan ekstrakurikuler berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui urutan ekstrakurikuler.'),
            }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.ekstrakurikuler.destroy', { ekstrakurikuler: deleteId }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Ekstrakurikuler berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus ekstrakurikuler.');
            },
        });
    };

    const columns: Column<Ekstrakurikuler>[] = [
        {
            key: 'urutan',
            label: '',
            width: '48px',
            render: (_item: Ekstrakurikuler) => {
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
            label: 'Foto & Nama Ekstrakurikuler',
            render: (item: Ekstrakurikuler) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200">
                        {item.foto_url ? (
                            <img
                                src={item.foto_url}
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
                        {item.translations.id.jadwal && (
                            <div className="text-xs text-neutral-400 mt-0.5">
                                Jadwal: {item.translations.id.jadwal}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'pembina',
            label: 'Pembina',
            render: (item: Ekstrakurikuler) => (
                <span className="text-sm text-neutral-700">
                    {item.pembina?.nama_lengkap || <span className="text-neutral-400 italic">Belum ditentukan</span>}
                </span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item: Ekstrakurikuler) => (
                <Badge variant={item.is_active ? 'success' : 'neutral'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            width: '120px',
            render: (item: Ekstrakurikuler) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Link href={route('admin.ekstrakurikuler.edit', { ekstrakurikuler: item.id })}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Ekstrakurikuler">
                            <Pen className="w-4 h-4 text-neutral-600" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Hapus Ekstrakurikuler"
                        onClick={() => setDeleteId(item.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola Ekstrakurikuler">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                            <Activity className="w-7 h-7 text-primary-600" />
                            Kelola Ekstrakurikuler
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Manajemen kegiatan ekstrakurikuler siswa untuk pengembangan minat dan bakat.
                        </p>
                    </div>
                    <Link href={route('admin.ekstrakurikuler.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Ekstrakurikuler
                        </Button>
                    </Link>
                </div>

                {/* Filter & Pencarian */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <Input
                            placeholder="Cari nama kegiatan ekstrakurikuler..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                            className="pl-9"
                        />
                    </div>
                    {search && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                handleSearch('');
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
                            Tidak ada data ekstrakurikuler yang ditemukan.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Ekstrakurikuler"
                message="Apakah Anda yakin ingin menghapus data ekstrakurikuler ini?"
                confirmLabel="Hapus"
                variant="danger"
            />
        </AdminLayout>
    );
}
