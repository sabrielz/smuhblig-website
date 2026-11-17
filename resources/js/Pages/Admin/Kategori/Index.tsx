import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Table, Column } from '@/Components/UI/Table';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Pagination } from '@/Components/UI/Pagination';
import { Plus, Pen, Trash2, FolderTree } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

interface IndexProps {
    [key: string]: unknown;
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        total: number;
    };
    colors: Array<{ hex: string; label: string }>;
}

export default function KategoriIndex() {
    const { categories } = usePage<IndexProps>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.kategori.destroy', { kategori: deleteId }), {
                onSuccess: () => {
                    toast.success('Kategori berhasil dihapus');
                    setDeleteId(null);
                },
                onError: (errors) => {
                    const message = Object.values(errors)[0] as string;
                    toast.error(message || 'Gagal menghapus kategori');
                    setDeleteId(null);
                },
            });
        }
    };

    const columns: Column[] = [
        {
            key: 'color',
            label: 'Warna',
            render: (item: Category) => (
                <div className="flex items-center gap-2">
                    <span
                        className="w-4 h-4 rounded-full border border-neutral-300 shrink-0 inline-block"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="font-mono text-xs text-neutral-500">{item.color}</span>
                </div>
            ),
        },
        {
            key: 'name',
            label: 'Nama Kategori',
            render: (item: Category) => (
                <div>
                    <div className="font-semibold text-neutral-900">{item.name}</div>
                    {item.translations?.en?.name && (
                        <div className="text-xs text-neutral-500">EN: {item.translations.en.name}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (item: Category) => (
                <span className="font-mono text-xs text-neutral-500">{item.slug}</span>
            ),
        },
        {
            key: 'articles_count',
            label: 'Jumlah Artikel',
            render: (item: Category) => (
                <span className="text-sm text-neutral-700 font-medium">
                    {item.articles_count ?? 0}
                </span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item: Category) =>
                item.is_active ? (
                    <Badge variant="success">Aktif</Badge>
                ) : (
                    <Badge variant="neutral">Tidak Aktif</Badge>
                ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: Category) => (
                <div className="flex items-center gap-2">
                    <Link href={route('admin.kategori.edit', { kategori: item.id })}>
                        <Button variant="ghost" size="sm" className="px-2 text-primary-600 hover:text-primary-700">
                            <Pen className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 text-red-600 hover:text-red-700"
                        onClick={() => setDeleteId(Number(item.id))}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Kategori Artikel">
            <Head title="Kelola Kategori Artikel" />

            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FolderTree className="w-6 h-6 text-primary-600" />
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Kategori Artikel</h1>
                    </div>
                    <p className="text-neutral-500 text-sm mt-1">
                        Kelola kategori pengelompokan berita dan artikel sekolah.
                    </p>
                </div>
                <Link href={route('admin.kategori.create')}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Kategori
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <Table columns={columns} data={categories.data} />

                {categories.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={categories.current_page}
                            totalPages={categories.last_page}
                            onPageChange={(page) => {
                                router.get(route('admin.kategori.index'), { page }, { preserveScroll: true });
                            }}
                        />
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Kategori"
                message="Apakah Anda yakin ingin menghapus kategori ini? Kategori yang memiliki artikel tidak dapat dihapus."
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
