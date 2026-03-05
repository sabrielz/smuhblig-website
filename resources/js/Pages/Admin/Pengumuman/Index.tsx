import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Table, Column } from '@/Components/UI/Table';
import { Pagination } from '@/Components/UI/Pagination';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Plus, Edit, Trash, Bell } from 'lucide-react';

interface Pengumuman {
    id: number;
    judul: string;
    tipe: 'info' | 'penting' | 'urgent';
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    is_active: boolean;
    status_label: string;
}

interface PaginatedData {
    data: Pengumuman[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    pengumumans: PaginatedData;
    filters: {
        status?: string;
    };
}

export default function Index({ pengumumans, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.pengumuman.destroy', { pengumuman: deleteId } as any), {
            onSuccess: () => setDeleteId(null),
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(route('admin.pengumuman.index'), {
            ...filters,
            status: e.target.value,
        }, { preserveState: true });
    };

    const getTipeBadge = (tipe: string) => {
        switch (tipe) {
            case 'urgent': return <Badge variant="danger">Urgent</Badge>;
            case 'penting': return <Badge variant="warning">Penting</Badge>;
            case 'info':
            default: return <Badge variant="info">Info</Badge>;
        }
    };

    const getStatusBadge = (statusLabel: string) => {
        switch (statusLabel) {
            case 'Aktif': return <Badge variant="success">Aktif</Badge>;
            case 'Kadaluarsa': return <Badge variant="neutral">Kadaluarsa</Badge>;
            case 'Tidak Aktif':
            default: return <Badge variant="neutral">Draft</Badge>;
        }
    };

    const columns: Column<Pengumuman>[] = [
        {
            key: 'judul',
            label: 'Judul Pengumuman',
            render: (p) => <span className="font-semibold text-gray-900">{p.judul}</span>,
        },
        {
            key: 'tipe',
            label: 'Tipe',
            render: (p) => getTipeBadge(p.tipe),
        },
        {
            key: 'tanggal_mulai',
            label: 'Tanggal Berlaku',
            render: (p) => (
                <div className="text-sm">
                    {p.tanggal_mulai ? p.tanggal_mulai : 'Sekarang'}
                    {' - '}
                    {p.tanggal_selesai ? p.tanggal_selesai : 'Selamanya'}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (p) => getStatusBadge(p.status_label),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '120px',
            render: (p) => (
                <div className="flex gap-2">
                    <Link href={route('admin.pengumuman.edit', { pengumuman: p.id } as any)}>
                        <Button variant="outline" size="sm" className="px-3">
                            <Edit className="w-4 h-4 text-neutral-600" />
                        </Button>
                    </Link>
                    <Button variant="danger" size="sm" className="px-3" onClick={() => setDeleteId(p.id)}>
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Pengumuman">
            <Head title="Pengumuman" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pengumuman Papan Informasi</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola pengumuman untuk seluruh pendaftar atau publik.</p>
                </div>
                <Link href={route('admin.pengumuman.create')}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Pengumuman
                    </Button>
                </Link>
            </div>

            <div className="mb-6 flex gap-4">
                <select
                    className="border-neutral-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={filters.status || ''}
                    onChange={handleFilterChange}
                >
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="kadaluarsa">Kadaluarsa</option>
                </select>
            </div>

            {pengumumans.data.length === 0 && !filters.status ? (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Belum ada pengumuman</h3>
                    <p className="text-neutral-500 mb-6 max-w-sm">
                        Anda belum membuat satu pun pengumuman.
                    </p>
                    <Link href={route('admin.pengumuman.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Pengumuman
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <Table columns={columns} data={pengumumans.data} />
                    <Pagination
                        currentPage={pengumumans.current_page}
                        totalPages={pengumumans.last_page}
                        onPageChange={(page) => router.get(route('admin.pengumuman.index', { page, status: filters.status }))}
                    />
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Pengumuman"
                message="Hapus pengumuman ini secara permanen?"
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
