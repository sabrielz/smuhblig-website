import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { Table, Column } from '@/Components/UI/Table';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Pagination } from '@/Components/UI/Pagination';
import { Tag as TagIcon, Trash2, Merge, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface TagItem {
    id: number;
    name: string;
    slug: string;
    articles_count: number;
    created_at: string;
}

interface TagSimple {
    id: number;
    name: string;
}

interface IndexProps {
    [key: string]: unknown;
    tags: {
        data: TagItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    allTags: TagSimple[];
}

export default function TagIndex() {
    const { tags, allTags } = usePage<IndexProps>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [mergingTag, setMergingTag] = useState<TagItem | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        source_id: 0,
        target_id: 0,
    });

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.tag.destroy', { tag: deleteId }), {
                onSuccess: () => {
                    toast.success('Tag berhasil dihapus');
                    setDeleteId(null);
                },
                onError: () => {
                    toast.error('Gagal menghapus tag');
                    setDeleteId(null);
                },
            });
        }
    };

    const handleOpenMerge = (tag: TagItem) => {
        setMergingTag(tag);
        setData({
            source_id: tag.id,
            target_id: allTags.find((t) => t.id !== tag.id)?.id ?? 0,
        });
    };

    const handleMergeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tag.merge'), {
            onSuccess: () => {
                toast.success('Tag berhasil digabungkan');
                setMergingTag(null);
                reset();
            },
            onError: (errs) => {
                const msg = Object.values(errs)[0] as string;
                toast.error(msg || 'Gagal menggabungkan tag');
            },
        });
    };

    const columns: Column[] = [
        {
            key: 'name',
            label: 'Nama Tag',
            render: (item: TagItem) => (
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-medium text-xs">
                        #{item.name}
                    </span>
                </div>
            ),
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (item: TagItem) => (
                <span className="font-mono text-xs text-neutral-500">{item.slug}</span>
            ),
        },
        {
            key: 'articles_count',
            label: 'Jumlah Artikel',
            render: (item: TagItem) => (
                <span className="text-sm font-semibold text-neutral-800">
                    {item.articles_count}
                </span>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: TagItem) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-2.5 text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5"
                        onClick={() => handleOpenMerge(item)}
                    >
                        <Merge className="w-3.5 h-3.5" />
                        <span className="text-xs">Gabung</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 text-red-600 hover:text-red-700"
                        onClick={() => setDeleteId(item.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kelola Tag Artikel">
            <Head title="Kelola Tag Artikel" />

            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <TagIcon className="w-6 h-6 text-primary-600" />
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tag Artikel</h1>
                    </div>
                    <p className="text-neutral-500 text-sm mt-1">
                        Daftar kata kunci pencarian dan topik artikel berita.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <Table columns={columns} data={tags.data} />

                {tags.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={tags.current_page}
                            totalPages={tags.last_page}
                            onPageChange={(page) => {
                                router.get(route('admin.tag.index'), { page }, { preserveScroll: true });
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Modal Gabung Tag */}
            <Modal
                isOpen={!!mergingTag}
                onClose={() => setMergingTag(null)}
                title={`Gabungkan Tag #${mergingTag?.name}`}
            >
                <form onSubmit={handleMergeSubmit} className="space-y-4">
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Seluruh artikel yang menggunakan tag <strong>#{mergingTag?.name}</strong> akan dipindahkan ke tag tujuan, kemudian tag <strong>#{mergingTag?.name}</strong> akan dihapus.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-neutral-800 mb-1">
                            Pilih Tag Tujuan
                        </label>
                        <select
                            value={data.target_id}
                            onChange={(e) => setData('target_id', Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                            required
                        >
                            <option value="">Pilih tag...</option>
                            {allTags
                                .filter((t) => t.id !== mergingTag?.id)
                                .map((t) => (
                                    <option key={t.id} value={t.id}>
                                        #{t.name}
                                    </option>
                                ))}
                        </select>
                        {errors.target_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.target_id}</p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setMergingTag(null)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing || !data.target_id} className="gap-2">
                            <Check className="w-4 h-4" />
                            Gabungkan Tag
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Dialog Hapus */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Tag"
                message="Apakah Anda yakin ingin menghapus tag ini? Tag akan dilepas dari seluruh artikel yang menggunakannya."
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
