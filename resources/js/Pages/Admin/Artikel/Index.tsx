import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Table, Column } from '@/Components/UI/Table';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { Pagination } from '@/Components/UI/Pagination';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Modal } from '@/Components/UI/Modal';
import { Textarea } from '@/Components/UI/Textarea';
import { Search, Plus, Edit, Trash2, CheckCircle, RotateCcw } from 'lucide-react';
import { SharedProps } from '@/types';

interface Article {
    id: number;
    title_id: string;
    category: {
        id: number;
        name: string;
        color: string;
    };
    user: {
        id: number;
        name: string;
    };
    status: 'draft' | 'pending_review' | 'published' | 'archived';
    formatted_published_at: string | null;
    published_at: string | null;
    thumbnail_url: string | null;
}

interface Props {
    articles: {
        data: Article[];
        meta: any;
    };
    categories: Array<{ id: number; name: string; color: string }>;
    filters: {
        search?: string;
        status?: string;
        category_id?: string;
        user_id?: string;
    };
}

export default function Index({ articles, categories, filters }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const can = auth.user?.can;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
    const [kembalikanModalOpen, setKembalikanModalOpen] = useState(false);
    const [articleToKembalikan, setArticleToKembalikan] = useState<number | null>(null);
    const [catatanReview, setCatatanReview] = useState('');
    const [isSubmittingKembalikan, setIsSubmittingKembalikan] = useState(false);

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            route('admin.artikel.index'),
            { search, status, category_id: categoryId },
            { preserveState: true }
        );
    };

    const confirmDelete = (id: number) => {
        setArticleToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (articleToDelete) {
            router.delete(route('admin.artikel.destroy', articleToDelete as any), {
                onSuccess: () => setIsDeleteDialogOpen(false),
            });
        }
    };

    const handlePublish = (id: number) => {
        router.post(route('admin.artikel.publish', id as any), {}, { preserveScroll: true });
    };

    const triggerKembalikan = (id: number) => {
        setArticleToKembalikan(id);
        setCatatanReview('');
        setKembalikanModalOpen(true);
    };

    const handleConfirmKembalikan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!articleToKembalikan || !catatanReview.trim()) return;

        setIsSubmittingKembalikan(true);
        router.post(
            route('admin.artikel.kembalikan', articleToKembalikan as any),
            { catatan: catatanReview },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmittingKembalikan(false);
                    setKembalikanModalOpen(false);
                    setCatatanReview('');
                },
            }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge variant="success">Published</Badge>;
            case 'pending_review':
                return <Badge variant="warning">Pending</Badge>;
            case 'archived':
                return <Badge variant="danger">Archived</Badge>;
            default:
                return <Badge variant="neutral">Draft</Badge>;
        }
    };

    const columns: Column<Article>[] = [
        {
            key: 'thumbnail_url',
            label: 'Thumbnail',
            render: (article) => (
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
                    {article.thumbnail_url ? (
                        <img src={article.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-neutral-400 text-xs">No img</div>
                    )}
                </div>
            )
        },
        {
            key: 'title_id',
            label: 'Judul',
            render: (article) => (
                <div className="max-w-xs truncate font-medium text-neutral-900">
                    {article.title_id || 'Tanpa Judul'}
                </div>
            )
        },
        {
            key: 'category',
            label: 'Kategori',
            render: (article) => (
                article.category ? (
                    <span
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                        style={{ backgroundColor: article.category.color }}
                    >
                        {article.category.name}
                    </span>
                ) : <span className="text-neutral-400">-</span>
            )
        },
        {
            key: 'user',
            label: 'Penulis',
            render: (article) => article.user?.name || '-'
        },
        {
            key: 'status',
            label: 'Status',
            render: (article) => getStatusBadge(article.status)
        },
        {
            key: 'published_at',
            label: 'Tgl Publish',
            render: (article) => (
                <span className="text-sm text-neutral-600">
                    {article.status === 'published' ? article.formatted_published_at : '-'}
                </span>
            )
        },
        {
            key: 'id',
            label: 'Aksi',
            render: (article) => (
                <div className="flex items-center justify-end gap-2">
                    {can?.publish_artikel && (article.status === 'draft' || article.status === 'pending_review') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-success hover:text-success hover:bg-success/10"
                            onClick={() => handlePublish(article.id)}
                            title="Publish"
                        >
                            <CheckCircle className="w-4 h-4" />
                        </Button>
                    )}
                    {can?.publish_artikel && article.status === 'pending_review' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => triggerKembalikan(article.id)}
                            title="Kembalikan dengan Catatan"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    )}
                    <Link href={route('admin.artikel.edit', { artikel: article.id })}>
                        <Button variant="ghost" size="sm" className="text-info hover:text-info hover:bg-info/10">
                            <Edit className="w-4 h-4" />
                        </Button>
                    </Link>
                    {can?.hapus_artikel && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:text-error hover:bg-error/10"
                            onClick={() => confirmDelete(article.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AdminLayout title="Manajemen Artikel">
            <Head title="Manajemen Artikel" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Daftar Artikel</h1>
                    <p className="text-sm text-neutral-500 mt-1">Kelola semua artikel dan berita publikasi.</p>
                </div>
                <Link href={route('admin.artikel.create')}>
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Tulis Artikel
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden mb-6">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Cari judul artikel..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                                className="bg-white"
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <Select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                options={[
                                    { value: '', label: 'Semua Kategori' },
                                    ...categories.map(c => ({ value: c.id.toString(), label: c.name }))
                                ]}
                                className="bg-white"
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                options={[
                                    { value: '', label: 'Semua Status' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'pending_review', label: 'Pending' },
                                    { value: 'published', label: 'Published' },
                                    { value: 'archived', label: 'Archived' },
                                ]}
                                className="bg-white"
                            />
                        </div>
                        <Button type="submit" variant="primary">Filter</Button>
                    </form>
                </div>

                <div className="p-0">
                    <Table
                        columns={columns}
                        data={articles.data}
                    />
                </div>
            </div>

            {articles.meta && articles.meta.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={articles.meta.current_page}
                        totalPages={articles.meta.last_page}
                        onPageChange={(page) => {
                            router.get(
                                route('admin.artikel.index'),
                                { search, status, category_id: categoryId, page },
                                { preserveState: true }
                            );
                        }}
                    />
                </div>
            )}

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Artikel"
                message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan dan semua data termasuk foto akan dihapus."
                confirmLabel="Hapus Artikel"
                cancelLabel="Batal"
                variant="danger"
            />

            {/* Modal Kembalikan dengan Catatan */}
            <Modal
                isOpen={kembalikanModalOpen}
                onClose={() => setKembalikanModalOpen(false)}
                title="Kembalikan Artikel ke Penulis"
            >
                <form onSubmit={handleConfirmKembalikan} className="space-y-4">
                    <p className="text-xs text-neutral-500">
                        Status artikel akan diubah kembali menjadi <strong>Draft</strong>. Berikan catatan revisi yang jelas agar penulis dapat memperbaiki kontennya.
                    </p>
                    <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Catatan Revisi <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            rows={4}
                            maxLength={1000}
                            placeholder="Tuliskan catatan perbaikan untuk penulis artikel..."
                            value={catatanReview}
                            onChange={(e) => setCatatanReview(e.target.value)}
                            required
                        />
                        <p className="text-[10px] text-neutral-400 mt-1 text-right">{catatanReview.length}/1000 karakter</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setKembalikanModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmittingKembalikan || !catatanReview.trim()}
                        >
                            Kembalikan ke Draft
                        </Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
