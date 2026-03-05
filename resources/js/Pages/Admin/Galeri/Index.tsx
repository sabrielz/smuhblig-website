import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Plus, Image as ImageIcon, Calendar, MoreVertical, Edit, Trash, FolderOpen } from 'lucide-react';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';

interface Galeri {
    id: number;
    judul: string;
    event_date: string | null;
    is_active: boolean;
    is_featured: boolean;
    foto_count: number;
    thumbnail: string | null;
}

interface Props {
    galeris: Galeri[];
}

export default function Index({ galeris }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.galeri.destroy', { galeri: deleteId } as any), {
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <AdminLayout title="Galeri">
            <Head title="Galeri" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Album Galeri</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola album foto kegiatan sekolah</p>
                </div>
                <Link href={route('admin.galeri.create')}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Album
                    </Button>
                </Link>
            </div>

            {galeris.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <FolderOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Belum ada album</h3>
                    <p className="text-neutral-500 mb-6 max-w-sm">
                        Anda belum membuat album galeri apapun. Silakan buat album pertama Anda untuk mulai mengunggah foto.
                    </p>
                    <Link href={route('admin.galeri.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Album Baru
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galeris.map((album) => (
                        <div key={album.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <Link href={route('admin.galeri.show', { galeri: album.id } as any)} className="block relative aspect-video bg-neutral-100 overflow-hidden">
                                {album.thumbnail ? (
                                    <img
                                        src={album.thumbnail}
                                        alt={album.judul}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                        <span className="text-xs font-medium">Kosong</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-3 right-3 flex gap-2">
                                    {!album.is_active && <Badge variant="danger">Draft</Badge>}
                                    {album.is_featured && <Badge variant="warning">Featured</Badge>}
                                </div>
                            </Link>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2" title={album.judul}>
                                        <Link href={route('admin.galeri.show', { galeri: album.id } as any)} className="hover:text-amber-600 transition-colors">
                                            {album.judul}
                                        </Link>
                                    </h3>

                                    <div className="flex gap-1">
                                        <Link
                                            href={route('admin.galeri.edit', { galeri: album.id } as any)}
                                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md transition-colors"
                                            title="Edit Album"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(album.id)}
                                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-md transition-colors"
                                            title="Hapus Album"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center text-xs text-neutral-500 gap-4 mt-3">
                                    <div className="flex items-center">
                                        <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                                        {album.foto_count} Foto
                                    </div>
                                    {album.event_date && (
                                        <div className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(album.event_date))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Album"
                message="Apakah Anda yakin ingin menghapus album ini beserta seluruh fotonya? Tindakan ini tidak dapat dibatalkan."
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
