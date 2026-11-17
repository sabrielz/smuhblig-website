import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Table, Column } from '@/Components/UI/Table';
import { Pagination } from '@/Components/UI/Pagination';
import { Plus, Pen, Trash2, Search, HelpCircle, GripVertical } from 'lucide-react';
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
import type { Faq, PaginatedData } from '@/types';

interface Props {
    faqs: PaginatedData<Faq>;
    filters: {
        kategori?: string;
        search?: string;
    };
}

const KATEGORI_OPTIONS = [
    { value: '', label: 'Semua Kategori' },
    { value: 'umum', label: 'Umum' },
    { value: 'pendaftaran', label: 'Pendaftaran (SPMB)' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'fasilitas', label: 'Fasilitas' },
];

const KATEGORI_LABELS: Record<string, string> = {
    umum: 'Umum',
    pendaftaran: 'Pendaftaran (SPMB)',
    akademik: 'Akademik',
    fasilitas: 'Fasilitas',
};

const KATEGORI_BADGE_VARIANTS: Record<string, 'gold' | 'primary' | 'success' | 'warning' | 'neutral'> = {
    umum: 'primary',
    pendaftaran: 'gold',
    akademik: 'warning',
    fasilitas: 'success',
};

function SortableRow({
    item,
    onDelete,
}: {
    item: Faq;
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
                <div className="flex flex-col gap-1 max-w-lg">
                    <span className="font-semibold text-neutral-900 line-clamp-2">
                        {item.translations?.id?.pertanyaan || item.pertanyaan || '-'}
                    </span>
                    <span
                        className="text-xs text-neutral-500 line-clamp-1 prose-sm"
                        dangerouslySetInnerHTML={{
                            __html: item.translations?.id?.jawaban || item.jawaban || '',
                        }}
                    />
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
                <Badge variant={KATEGORI_BADGE_VARIANTS[item.kategori] || 'neutral'}>
                    {KATEGORI_LABELS[item.kategori] || item.kategori}
                </Badge>
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
                    <Link href={route('admin.faq.edit', { faq: item.id })}>
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

export default function Index({ faqs, filters }: Props) {
    const [items, setItems] = useState<Faq[]>(faqs.data);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');

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

    const handleFilterChange = (newKategori = kategori, newSearch = search) => {
        router.get(
            route('admin.faq.index'),
            {
                kategori: newKategori || undefined,
                search: newSearch || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.faq.destroy', { faq: deleteId }), {
            onSuccess: () => {
                toast.success('FAQ berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus FAQ');
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
                route('admin.faq.reorder'),
                { orders },
                {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Urutan FAQ berhasil disimpan'),
                    onError: () => toast.error('Gagal mengubah urutan FAQ'),
                }
            );
        }
    };

    return (
        <AdminLayout title="Kelola FAQ (Tanya Jawab)">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                            FAQ (Tanya Jawab)
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola pertanyaan yang sering diajukan dan jawabannya untuk membantu calon siswa dan masyarakat.
                        </p>
                    </div>
                    <Link href={route('admin.faq.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah FAQ
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Cari pertanyaan atau jawaban..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(kategori, search)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            options={KATEGORI_OPTIONS}
                            value={kategori}
                            onChange={(e) => {
                                setKategori(e.target.value);
                                handleFilterChange(e.target.value, search);
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleFilterChange(kategori, search)}
                            >
                                Terapkan Filter
                            </Button>
                            {(kategori || search) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setKategori('');
                                        setSearch('');
                                        handleFilterChange('', '');
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table with Drag & Drop Sorting */}
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
                                    <th className="px-4 py-3.5">Pertanyaan & Jawaban</th>
                                    <th className="px-4 py-3.5">Kategori</th>
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
                                        <td colSpan={6} className="text-center py-12 text-neutral-500 text-sm">
                                            Belum ada pertanyaan FAQ yang terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </DndContext>
                </div>

                {/* Pagination */}
                {faqs.meta.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <Pagination
                            currentPage={faqs.meta.current_page}
                            totalPages={faqs.meta.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.faq.index'),
                                    {
                                        page,
                                        kategori: kategori || undefined,
                                        search: search || undefined,
                                    },
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
                    title="Hapus FAQ"
                    message="Apakah Anda yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan."
                    confirmLabel="Hapus"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
