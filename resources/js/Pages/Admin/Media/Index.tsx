import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { Modal } from '@/Components/UI/Modal';
import { Pagination } from '@/Components/UI/Pagination';
import {
    Image as ImageIcon,
    FileText,
    Search,
    Trash2,
    Edit3,
    ExternalLink,
    Lock,
    Check,
} from 'lucide-react';
import type { MediaLibraryItem, PaginatedData, SharedProps } from '@/types';

interface MediaIndexProps {
    media: PaginatedData<MediaLibraryItem>;
    filters: {
        type: string;
        model_type: string;
        search: string;
    };
}

export default function MediaIndex({ media, filters }: MediaIndexProps) {
    const { flash } = usePage<SharedProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [selectedMedia, setSelectedMedia] = useState<MediaLibraryItem | null>(null);

    // Edit Metadata Modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editAlt, setEditAlt] = useState('');
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);

    // Delete confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/media',
            {
                search: search || undefined,
                type: type || undefined,
            },
            { preserveState: true },
        );
    };

    const openEditModal = (item: MediaLibraryItem) => {
        setSelectedMedia(item);
        setEditAlt(item.alt || '');
        setEditName(item.name || '');
        setEditModalOpen(true);
    };

    const handleSaveMetadata = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedia) return;

        setSaving(true);
        router.put(
            `/admin/media/${selectedMedia.id}`,
            {
                alt: editAlt,
                name: editName,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditModalOpen(false);
                    setSelectedMedia((prev) => (prev ? { ...prev, alt: editAlt, name: editName } : null));
                },
                onFinish: () => setSaving(false),
            },
        );
    };

    const openDeleteModal = (item: MediaLibraryItem) => {
        setSelectedMedia(item);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedMedia) return;
        setDeleting(true);
        router.delete(`/admin/media/${selectedMedia.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedMedia(null);
            },
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="Pustaka Media">
            <Head title="Pustaka Media — Admin CMS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                            Pustaka Media
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola seluruh berkas gambar dan dokumen yang diunggah ke website.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
                    <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Cari nama atau nama berkas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                options={[
                                    { value: '', label: 'Semua Tipe' },
                                    { value: 'image', label: 'Gambar' },
                                    { value: 'document', label: 'Dokumen' },
                                ]}
                            />
                        </div>
                        <Button type="submit" variant="outline">
                            <Search className="w-4 h-4 mr-1.5" />
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Media Grid + Detail Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Media Items */}
                    <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                        {media.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                                <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                                <p className="text-base font-medium">Belum ada media.</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Berkas yang diunggah pada modul konten akan otomatis terdaftar di sini.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {media.data.map((item) => {
                                        const isSelected = selectedMedia?.id === item.id;
                                        const isImage = item.mime_type.startsWith('image/');
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedMedia(item)}
                                                className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-primary-600 ring-2 ring-primary-500/20 shadow-md'
                                                        : 'border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
                                                }`}
                                            >
                                                <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
                                                    {isImage && item.url ? (
                                                        <img
                                                            src={item.url}
                                                            alt={item.alt || item.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-neutral-400 p-2">
                                                            <FileText className="w-8 h-8 mb-1" />
                                                            <span className="text-[10px] uppercase font-bold tracking-wider">
                                                                {item.mime_type.split('/')[1] || 'FILE'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Usage Badge */}
                                                <div className="absolute top-2 left-2">
                                                    {item.is_used ? (
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary-600/90 text-white shadow-xs backdrop-blur-xs">
                                                            <Lock className="w-2.5 h-2.5" />
                                                            Terpakai
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-900/60 text-white/90 backdrop-blur-xs">
                                                            Bebas
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Caption overlay */}
                                                <div className="p-2 bg-white border-t border-neutral-100">
                                                    <p className="text-xs font-semibold text-neutral-900 truncate">
                                                        {item.name || item.file_name}
                                                    </p>
                                                    <p className="text-[11px] text-neutral-400 mt-0.5">
                                                        {item.human_size}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {media.meta.last_page > 1 && (
                                    <div className="mt-6 border-t pt-4 flex justify-center">
                                        <Pagination
                                            currentPage={media.meta.current_page}
                                            totalPages={media.meta.last_page}
                                            onPageChange={(page) => {
                                                router.get(
                                                    '/admin/media',
                                                    {
                                                        page,
                                                        search: search || undefined,
                                                        type: type || undefined,
                                                    },
                                                    { preserveState: true }
                                                );
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-4 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs sticky top-6">
                        <h2 className="text-base font-bold text-neutral-900 border-b pb-3 mb-4">
                            Detail Media
                        </h2>

                        {selectedMedia ? (
                            <div className="space-y-4">
                                <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-200">
                                    {selectedMedia.mime_type.startsWith('image/') && selectedMedia.url ? (
                                        <img
                                            src={selectedMedia.url}
                                            alt={selectedMedia.alt || selectedMedia.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <FileText className="w-12 h-12 text-neutral-400" />
                                    )}
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-neutral-500 font-medium">Nama Tampilan:</span>
                                        <p className="font-semibold text-neutral-900 break-words mt-0.5">
                                            {selectedMedia.name}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-neutral-500 font-medium">Nama Berkas:</span>
                                        <p className="font-mono text-neutral-700 break-all mt-0.5">
                                            {selectedMedia.file_name}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-neutral-500 font-medium">Alt Text:</span>
                                        <p className="text-neutral-800 mt-0.5 italic">
                                            {selectedMedia.alt || '(Belum disetel - Disarankan untuk aksesibilitas)'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                        <div>
                                            <span className="text-neutral-500 font-medium">Ukuran:</span>
                                            <p className="font-semibold text-neutral-900 mt-0.5">
                                                {selectedMedia.human_size}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-neutral-500 font-medium">Tipe MIME:</span>
                                            <p className="font-semibold text-neutral-900 mt-0.5 truncate">
                                                {selectedMedia.mime_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                        <div>
                                            <span className="text-neutral-500 font-medium">Model Pemilik:</span>
                                            <p className="font-semibold text-neutral-900 mt-0.5">
                                                {selectedMedia.model_type || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-neutral-500 font-medium">Collection:</span>
                                            <p className="font-semibold text-neutral-900 mt-0.5 truncate">
                                                {selectedMedia.collection_name || 'default'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <span className="text-neutral-500 font-medium">Status Penggunaan (BR-030):</span>
                                        <p className="mt-0.5">
                                            {selectedMedia.is_used ? (
                                                <span className="inline-flex items-center gap-1 text-primary-700 font-semibold">
                                                    <Lock className="w-3 h-3" />
                                                    Sedang terpakai pada konten
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                                    <Check className="w-3 h-3" />
                                                    Bebas / Tidak terpakai
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-3 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-center"
                                        onClick={() => openEditModal(selectedMedia)}
                                    >
                                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                        Ubah Alt Text / Nama
                                    </Button>

                                    {selectedMedia.url && (
                                        <a
                                            href={selectedMedia.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-center text-neutral-600"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                                Buka Berkas Asli
                                            </Button>
                                        </a>
                                    )}

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="w-full justify-center"
                                        disabled={selectedMedia.is_used}
                                        onClick={() => openDeleteModal(selectedMedia)}
                                        title={selectedMedia.is_used ? 'Media terpakai tidak dapat dihapus' : 'Hapus media'}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        Hapus Media
                                    </Button>
                                    {selectedMedia.is_used && (
                                        <p className="text-[11px] text-amber-600 text-center">
                                            Media terpakai pada konten tidak dapat dihapus (BR-030).
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-neutral-400">
                                <p className="text-sm">Pilih berkas media untuk melihat detail lengkap.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Edit Metadata */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Perbarui Metadata Media"
                size="md"
            >
                <form onSubmit={handleSaveMetadata} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Nama Media
                        </label>
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Nama deskriptif berkas..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Alt Text (Aksesibilitas / BR-031)
                        </label>
                        <Input
                            value={editAlt}
                            maxLength={150}
                            onChange={(e) => setEditAlt(e.target.value)}
                            placeholder="Deskripsi singkat gambar (maks 150 karakter)..."
                        />
                        <p className="text-[11px] text-neutral-400 mt-1">
                            {editAlt.length}/150 karakter
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEditModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={saving}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Hapus Media */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Hapus Berkas Media"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Apakah Anda yakin ingin menghapus berkas <strong className="text-neutral-900">{selectedMedia?.file_name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            disabled={deleting}
                            onClick={handleDelete}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

