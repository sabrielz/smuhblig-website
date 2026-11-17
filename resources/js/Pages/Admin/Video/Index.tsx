import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Pagination } from '@/Components/UI/Pagination';
import { Plus, Pen, Trash2, Search, ExternalLink, Video as VideoIcon, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import type { VideoItem, PaginatedData } from '@/types';

interface Props {
    videos: PaginatedData<VideoItem>;
    filters: {
        search?: string;
    };
}

export default function Index({ videos, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (newSearch = search) => {
        router.get(
            route('admin.video.index'),
            { search: newSearch || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.video.destroy', { video: deleteId }), {
            onSuccess: () => {
                toast.success('Video berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus video');
                setDeleteId(null);
            },
        });
    };

    const columns: Column<VideoItem>[] = [
        {
            key: 'thumbnail',
            label: 'Video',
            width: '160px',
            render: (item) => (
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-200 group">
                    <img
                        src={item.thumbnail_url}
                        alt={item.translations?.id?.judul || item.judul || 'Video'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <a
                        href={item.watch_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors"
                        title="Tonton di YouTube"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                    </a>
                </div>
            ),
        },
        {
            key: 'judul',
            label: 'Judul & Album',
            render: (item) => (
                <div className="flex flex-col gap-1 max-w-md">
                    <span className="font-semibold text-neutral-900 line-clamp-2">
                        {item.translations?.id?.judul || item.judul || '-'}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded">
                            ID: {item.youtube_id}
                        </span>
                        {item.galeri && (
                            <>
                                <span>•</span>
                                <span className="text-primary-600">Album: {item.galeri.judul}</span>
                            </>
                        )}
                    </div>
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
                    <Link href={route('admin.video.edit', { video: item.id })}>
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
        <AdminLayout title="Kelola Galeri Video">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Galeri Video</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola koleksi video YouTube resmi kegiatan sekolah, profil, dan dokumentasi acara.
                        </p>
                    </div>
                    <Link href={route('admin.video.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Video
                        </Button>
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <Input
                            placeholder="Cari judul video atau ID YouTube..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" onClick={() => handleSearch(search)}>
                        Cari
                    </Button>
                    {search && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSearch('');
                                handleSearch('');
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
                    <Table
                        columns={columns}
                        data={videos.data}
                    />
                    {videos.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada video YouTube yang ditambahkan.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {videos.meta.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <Pagination
                            currentPage={videos.meta.current_page}
                            totalPages={videos.meta.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.video.index'),
                                    { page, search: search || undefined },
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
                    title="Hapus Video"
                    message="Apakah Anda yakin ingin menghapus video ini dari galeri sekolah? Tindakan ini tidak dapat dibatalkan."
                    confirmLabel="Hapus"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
