import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Table, Column } from '@/Components/UI/Table';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Plus, Pen, Trash2, GripVertical } from 'lucide-react';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function Index() {
    const { tautans } = usePage<{ tautans: any[] }>().props;
    const [list, setList] = useState(tautans);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;

        let _list = [...list];
        const draggedItemContent = _list.splice(dragItem.current, 1)[0];
        _list.splice(dragOverItem.current, 0, draggedItemContent);

        // Update local state instantly
        const updatedList = _list.map((item, index) => ({
            ...item,
            sort_order: index + 1
        }));

        setList(updatedList);

        // Save to backend
        router.put(route('admin.tautan.update', updatedList[0].id), {
            reorder: true,
            items: updatedList.map(item => ({ id: item.id, sort_order: item.sort_order }))
        }, { preserveScroll: true });

        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.tautan.destroy', { tautan: deleteId } as any), {
                onSuccess: () => {
                    toast.success('Tautan berhasil dihapus');
                    setDeleteId(null);
                }
            });
        }
    };

    const columns: Column[] = [
        {
            key: 'drag',
            label: '',
            render: (item) => {
                const index = list.findIndex(i => i.id === item.id);
                return (
                    <div
                        draggable
                        onDragStart={(e) => (dragItem.current = index)}
                        onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="cursor-move text-gray-400 hover:text-gray-600"
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>
                );
            }
        },
        {
            key: 'label',
            label: 'Label',
            render: (item: any) => (
                <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    {item.label_en && <div className="text-xs text-gray-500">EN: {item.label_en}</div>}
                </div>
            )
        },
        { key: 'url', label: 'URL' },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item: any) => item.kategori || '-'
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item: any) => item.is_active ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Tidak Aktif</Badge>
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Link href={route('admin.tautan.edit', { tautan: item.id } as any)}>
                        <Button variant="ghost" size="sm" className="px-2 text-blue-600">
                            <Pen className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="px-2 text-red-600" onClick={() => setDeleteId(Number(item.id))}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout title="Tautan & Pintasan">
            <Head title="Kelola Tautan" />

            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tautan & Pintasan</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola link cepat di footer atau halaman tautan.</p>
                </div>
                <Link href={route('admin.tautan.create')}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Tautan
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <Table columns={columns} data={list} />
                <p className="text-xs text-gray-400 mt-2">✨ Drag and drop icon titik-titik (⋮⋮) untuk mengubah urutan</p>
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Tautan"
                message="Apakah Anda yakin ingin menghapus tautan ini? Tindakan ini tidak dapat dibatalkan."
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
