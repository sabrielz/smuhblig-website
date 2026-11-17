import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Plus, Pen, Trash2, GripVertical, Search, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Guru, PaginatedData } from '@/types';

interface Props {
    guruList: PaginatedData<Guru>;
    jurusans: Array<{ id: number; nama: string }>;
    filters: {
        kelompok?: string;
        jurusan_id?: string;
        search?: string;
    };
}

export default function Index({ guruList, jurusans, filters }: Props) {
    const [list, setList] = useState<Guru[]>(guruList.data);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [kelompok, setKelompok] = useState(filters.kelompok || '');
    const [jurusanId, setJurusanId] = useState(filters.jurusan_id || '');

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleFilterChange = (newKelompok = kelompok, newJurusanId = jurusanId, newSearch = search) => {
        router.get(
            route('admin.guru.index'),
            {
                kelompok: newKelompok || undefined,
                jurusan_id: newJurusanId || undefined,
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

        const withNewUrutan = updated.map((item, index) => ({
            ...item,
            urutan: index + 1,
        }));

        setList(withNewUrutan);

        router.post(
            route('admin.guru.reorder'),
            {
                items: withNewUrutan.map((item) => ({ id: item.id, urutan: item.urutan })),
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Urutan diperbarui.'),
                onError: () => toast.error('Gagal memperbarui urutan.'),
            }
        );

        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.guru.destroy', { guru: deleteId }), {
            onSuccess: () => {
                toast.success('Data berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => toast.error('Gagal menghapus data.'),
        });
    };

    const columns: Column[] = [
        {
            key: 'drag',
            label: '',
            render: (item: Guru) => {
                const index = list.findIndex((i) => i.id === item.id);
                return (
                    <div
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="cursor-move p-2 text-neutral-400 hover:text-neutral-600 inline-block"
                        title="Geser untuk mengatur urutan"
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                );
            },
        },
        {
            key: 'foto',
            label: 'Foto',
            render: (item: Guru) => (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                    {item.foto_url ? (
                        <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'nama',
            label: 'Nama Lengkap',
            render: (item: Guru) => (
                <div>
                    <div className="font-semibold text-neutral-900">{item.nama_lengkap}</div>
                    <div className="text-xs text-neutral-500">{item.nama}</div>
                </div>
            ),
        },
        {
            key: 'kelompok',
            label: 'Kelompok',
            render: (item: Guru) => (
                <Badge variant={item.kelompok === 'guru' ? 'info' : 'neutral'} size="sm">
                    {item.kelompok === 'guru' ? 'Guru' : 'Tenaga Kependidikan'}
                </Badge>
            ),
        },
        {
            key: 'jabatan_mapel',
            label: 'Jabatan / Mapel',
            render: (item: Guru) => (
                <div>
                    <div className="text-sm text-neutral-900 font-medium">{item.translations?.id?.jabatan || '-'}</div>
                    {item.translations?.id?.mapel && (
                        <div className="text-xs text-neutral-500">{item.translations.id.mapel}</div>
                    )}
                    {item.jurusan && (
                        <div className="text-xs text-primary-600 font-medium mt-0.5">{item.jurusan.nama}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: Guru) => (
                <Badge variant={item.is_active ? 'success' : 'neutral'} size="sm">
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (item: Guru) => (
                <div className="flex items-center gap-2">
                    <Link href={route('admin.guru.edit', { guru: item.id })}>
                        <Button variant="outline" size="sm">
                            <Pen className="w-3.5 h-3.5 mr-1" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(item.id)}
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola Guru & Tenaga Kependidikan">
            <Head title="Guru & Tendik - Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Guru & Tenaga Kependidikan</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola data pengajar dan staf untuk profil sekolah publik.
                        </p>
                    </div>

                    <Link href={route('admin.guru.create')}>
                        <Button variant="primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Guru/Tendik
                        </Button>
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Cari nama, jabatan, atau mapel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFilterChange(kelompok, jurusanId, search);
                                }
                            }}
                            className="pl-9"
                        />
                    </div>

                    <div className="w-full md:w-48">
                        <Select
                            value={kelompok}
                            onChange={(e) => {
                                const val = e.target.value;
                                setKelompok(val);
                                handleFilterChange(val, jurusanId, search);
                            }}
                            options={[
                                { value: '', label: 'Semua Kelompok' },
                                { value: 'guru', label: 'Guru' },
                                { value: 'tendik', label: 'Tenaga Kependidikan' },
                            ]}
                        />
                    </div>

                    <div className="w-full md:w-56">
                        <Select
                            value={jurusanId}
                            onChange={(e) => {
                                const val = e.target.value;
                                setJurusanId(val);
                                handleFilterChange(kelompok, val, search);
                            }}
                            options={[
                                { value: '', label: 'Semua Jurusan' },
                                ...jurusans.map((j) => ({ value: String(j.id), label: j.nama })),
                            ]}
                        />
                    </div>

                    {(search || kelompok || jurusanId) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSearch('');
                                setKelompok('');
                                setJurusanId('');
                                handleFilterChange('', '', '');
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        data={list}
                    />
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Hapus Data Guru/Tendik"
                message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
                confirmLabel="Hapus"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeleteId(null)}
            />
        </AdminLayout>
    );
}
