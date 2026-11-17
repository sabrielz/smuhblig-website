import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Pagination } from '@/Components/UI/Pagination';
import { Plus, Pen, Trash2, Search, ExternalLink, GripVertical, Building } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import type { Mitra, PaginatedData } from '@/types';

interface Props {
    mitras: PaginatedData<Mitra>;
    filters: {
        search?: string;
    };
}

function SortableRow({
    item,
    onDelete,
}: {
    item: Mitra;
    onDelete: (id: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b border-neutral-100 transition-colors ${
                isDragging ? 'bg-primary-50 opacity-90 shadow-md' : 'hover:bg-neutral-50/70'
            }`}
        >
            <td className="px-4 py-4 w-12 text-center">
                <button
                    type="button"
                    className="cursor-move text-neutral-400 hover:text-neutral-700 p-1 rounded"
                    {...attributes}
                    {...listeners}
                    title="Geser untuk mengubah urutan"
                >
                    <GripVertical className="w-4 h-4" />
                </button>
            </td>
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    {item.logo_url ? (
                        <div className="w-14 h-10 rounded-lg bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0">
                            <img
                                src={item.logo_url}
                                alt={item.nama}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-14 h-10 rounded-lg bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                            <Building className="w-5 h-5" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-neutral-900 truncate">{item.nama}</span>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-600 hover:underline flex items-center gap-1 truncate"
                            >
                                <span className="truncate">{item.url}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
                {item.bidang}
            </td>
            <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.jurusans && item.jurusans.length > 0 ? (
                        item.jurusans.map((j) => (
                            <Badge key={j.id} variant="neutral" size="sm">
                                {j.kode}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-neutral-400 italic">Semua Jurusan</span>
                    )}
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-neutral-600 font-medium">
                {item.urutan}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-center">
                <Badge variant={item.is_active ? 'success' : 'neutral'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link href={route('admin.mitra.edit', { mitra: item.id })}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit">
                            <Pen className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => onDelete(item.id)}
                        title="Hapus"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function Index({ mitras, filters }: Props) {
    const [items, setItems] = useState<Mitra[]>(mitras.data);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSearch = (newSearch = search) => {
        router.get(
            route('admin.mitra.index'),
            { search: newSearch || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.mitra.destroy', { mitra: deleteId }), {
            onSuccess: () => {
                toast.success('Mitra industri berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus mitra industri');
                setDeleteId(null);
            },
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const reordered = arrayMove(items, oldIndex, newIndex);
            setItems(reordered);

            const orders = reordered.map((item, idx) => ({
                id: item.id,
                urutan: idx + 1,
            }));

            router.post(
                route('admin.mitra.reorder'),
                { orders },
                {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Urutan mitra berhasil disimpan'),
                    onError: () => toast.error('Gagal mengubah urutan mitra'),
                }
            );
        }
    };

    return (
        <AdminLayout title="Kelola Mitra Industri">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Mitra Industri</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola jaringan perusahaan, asosiasi, dan industri rekanan SMK Muhammadiyah Bligo.
                        </p>
                    </div>
                    <Link href={route('admin.mitra.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Mitra
                        </Button>
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <Input
                            placeholder="Cari nama mitra atau bidang industri..."
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

                {/* Sortable Table */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-700">
                                    <th className="px-4 py-3.5 w-12 text-center">Urut</th>
                                    <th className="px-4 py-3.5">Nama & Tautan</th>
                                    <th className="px-4 py-3.5">Bidang Industri</th>
                                    <th className="px-4 py-3.5">Kerja Sama Jurusan</th>
                                    <th className="px-4 py-3.5 text-center">No</th>
                                    <th className="px-4 py-3.5 text-center">Status</th>
                                    <th className="px-4 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <SortableContext
                                    items={items.map((i) => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {items.map((item) => (
                                        <SortableRow
                                            key={item.id}
                                            item={item}
                                            onDelete={(id) => setDeleteId(id)}
                                        />
                                    ))}
                                </SortableContext>
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-neutral-500 text-sm">
                                            Belum ada mitra industri yang terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </DndContext>
                </div>

                {/* Pagination */}
                {mitras.meta.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <Pagination
                            currentPage={mitras.meta.current_page}
                            totalPages={mitras.meta.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.mitra.index'),
                                    { page, search: search || undefined },
                                    { preserveState: true }
                                );
                            }}
                        />
                    </div>
                )}

                {/* Confirm Dialog */}
                <ConfirmDialog
                    isOpen={deleteId !== null}
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Hapus Mitra Industri"
                    message="Apakah Anda yakin ingin menghapus data mitra industri ini? Tindakan ini tidak dapat dibatalkan."
                    confirmLabel="Hapus"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
