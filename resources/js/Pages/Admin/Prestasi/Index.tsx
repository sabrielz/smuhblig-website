import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Plus, Pen, Trash2, Search, Trophy, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Prestasi, PaginatedData } from '@/types';

interface Props {
    prestasiList: PaginatedData<Prestasi>;
    jurusans: Array<{ id: number; nama: string }>;
    years: number[];
    filters: {
        tingkat?: string;
        kategori?: string;
        tahun?: string;
        jurusan_id?: string;
        search?: string;
    };
}

const TINGKAT_LABELS: Record<string, string> = {
    sekolah: 'Sekolah',
    kabupaten: 'Kabupaten/Kota',
    provinsi: 'Provinsi',
    nasional: 'Nasional',
    internasional: 'Internasional',
};

const TINGKAT_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    internasional: 'gold',
    nasional: 'primary',
    provinsi: 'warning',
    kabupaten: 'success',
    sekolah: 'neutral',
};

const TINGKAT_OPTIONS = [
    { value: '', label: 'Semua Tingkat' },
    { value: 'internasional', label: 'Internasional' },
    { value: 'nasional', label: 'Nasional' },
    { value: 'provinsi', label: 'Provinsi' },
    { value: 'kabupaten', label: 'Kabupaten/Kota' },
    { value: 'sekolah', label: 'Sekolah' },
];

const KATEGORI_OPTIONS = [
    { value: '', label: 'Semua Kategori' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'non_akademik', label: 'Non-Akademik' },
];

export default function Index({ prestasiList, jurusans, years, filters }: Props) {
    const [list] = useState<Prestasi[]>(prestasiList.data);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [tingkat, setTingkat] = useState(filters.tingkat || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [tahun, setTahun] = useState(filters.tahun || '');
    const [jurusanId, setJurusanId] = useState(filters.jurusan_id || '');

    const handleFilterChange = (
        newTingkat = tingkat,
        newKategori = kategori,
        newTahun = tahun,
        newJurusanId = jurusanId,
        newSearch = search
    ) => {
        router.get(
            route('admin.prestasi.index'),
            {
                tingkat: newTingkat || undefined,
                kategori: newKategori || undefined,
                tahun: newTahun || undefined,
                jurusan_id: newJurusanId || undefined,
                search: newSearch || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.prestasi.destroy', { prestasi: deleteId }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Prestasi berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus prestasi.');
            },
        });
    };

    const tahunOptions = [
        { value: '', label: 'Semua Tahun' },
        ...years.map((y) => ({ value: y.toString(), label: y.toString() })),
    ];

    const jurusanOptions = [
        { value: '', label: 'Semua Jurusan / Umum' },
        ...jurusans.map((j) => ({ value: j.id.toString(), label: j.nama })),
    ];

    const columns: Column<Prestasi>[] = [
        {
            key: 'judul',
            label: 'Foto & Judul Prestasi',
            render: (item: Prestasi) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200">
                        {item.foto_url ? (
                            <img
                                src={item.foto_url}
                                alt={item.translations.id.judul}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-neutral-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-neutral-900">{item.translations.id.judul}</div>
                        {item.translations.en?.judul && (
                            <div className="text-xs text-neutral-500 italic">{item.translations.en.judul}</div>
                        )}
                        <div className="text-xs text-neutral-400 mt-0.5">
                            Tahun {item.tahun} {item.jurusan?.nama && `• ${item.jurusan.nama}`}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'tingkat',
            label: 'Tingkat',
            render: (item: Prestasi) => (
                <Badge variant={TINGKAT_BADGE_VARIANTS[item.tingkat] || 'neutral'}>
                    {TINGKAT_LABELS[item.tingkat] || item.tingkat}
                </Badge>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item: Prestasi) => (
                <Badge variant={item.kategori === 'akademik' ? 'primary' : 'neutral'}>
                    {item.kategori === 'akademik' ? 'Akademik' : 'Non-Akademik'}
                </Badge>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item: Prestasi) => (
                <Badge variant={item.is_active ? 'success' : 'neutral'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            width: '120px',
            render: (item: Prestasi) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Link href={route('admin.prestasi.edit', { prestasi: item.id })}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Prestasi">
                            <Pen className="w-4 h-4 text-neutral-600" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Hapus Prestasi"
                        onClick={() => setDeleteId(item.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola Prestasi">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                            <Trophy className="w-7 h-7 text-gold-500" />
                            Kelola Prestasi
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Manajemen rekam jejak prestasi akademik dan non-akademik siswa serta sekolah.
                        </p>
                    </div>
                    <Link href={route('admin.prestasi.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Prestasi
                        </Button>
                    </Link>
                </div>

                {/* Filter & Pencarian */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative lg:col-span-2">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Cari judul prestasi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(tingkat, kategori, tahun, jurusanId, search)}
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={tingkat}
                            options={TINGKAT_OPTIONS}
                            onChange={(e) => {
                                setTingkat(e.target.value);
                                handleFilterChange(e.target.value, kategori, tahun, jurusanId, search);
                            }}
                        />

                        <Select
                            value={kategori}
                            options={KATEGORI_OPTIONS}
                            onChange={(e) => {
                                setKategori(e.target.value);
                                handleFilterChange(tingkat, e.target.value, tahun, jurusanId, search);
                            }}
                        />

                        <Select
                            value={tahun}
                            options={tahunOptions}
                            onChange={(e) => {
                                setTahun(e.target.value);
                                handleFilterChange(tingkat, kategori, e.target.value, jurusanId, search);
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-100">
                        <div className="w-full sm:w-64">
                            <Select
                                value={jurusanId}
                                options={jurusanOptions}
                                onChange={(e) => {
                                    setJurusanId(e.target.value);
                                    handleFilterChange(tingkat, kategori, tahun, e.target.value, search);
                                }}
                            />
                        </div>

                        {(search || tingkat || kategori || tahun || jurusanId) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearch('');
                                    setTingkat('');
                                    setKategori('');
                                    setTahun('');
                                    setJurusanId('');
                                    handleFilterChange('', '', '', '', '');
                                }}
                            >
                                Reset Filter
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
                    <Table
                        columns={columns}
                        data={list}
                    />
                    {list.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Tidak ada data prestasi yang ditemukan.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Prestasi"
                message="Apakah Anda yakin ingin menghapus data prestasi ini?"
                confirmLabel="Hapus"
                variant="danger"
            />
        </AdminLayout>
    );
}
