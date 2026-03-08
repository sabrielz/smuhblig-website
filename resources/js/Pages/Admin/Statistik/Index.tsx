import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { GripVertical, Save, Activity } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface StatistikItem {
    id: number;
    key: string;
    nilai: number;
    label: string;
    label_en: string | null;
    suffix: string | null;
    icon_name: string | null;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    statistik: StatistikItem[];
}

function SortableItem({ item, index, updateItem }: { item: StatistikItem; index: number; updateItem: (index: number, field: keyof StatistikItem, value: any) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    const Icon = item.icon_name && (LucideIcons as any)[item.icon_name]
        ? (LucideIcons as any)[item.icon_name]
        : Activity;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-white border rounded-xl p-5 mb-4 flex gap-4 md:items-start items-center transition-shadow",
                isDragging ? "shadow-lg border-primary-500 opacity-90 ring-1 ring-primary-500" : "shadow-sm border-gray-200"
            )}
        >
            <button
                type="button"
                className="cursor-move text-gray-400 hover:text-gray-600 p-2 shrink-0 md:mt-2"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-5 h-5" />
            </button>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 md:col-span-2 pb-2 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                        <Icon className="w-5 h-5 opacity-90" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 tracking-tight">{item.key.toUpperCase().replace(/_/g, ' ')}</div>
                        <div className="text-xs text-gray-500">ID: {item.id}</div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer ml-auto border rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={item.is_active}
                                onChange={(e) => updateItem(index, 'is_active', e.target.checked)}
                            />
                            <div className={cn(
                                "block w-8 h-4.5 rounded-full transition-colors",
                                item.is_active ? "bg-primary-600" : "bg-gray-300"
                            )}></div>
                            <div className={cn(
                                "dot absolute left-[2px] top-[2px] bg-white w-3.5 h-3.5 rounded-full transition-transform",
                                item.is_active ? "transform translate-x-[14px]" : ""
                            )}></div>
                        </div>
                        <span className={cn("text-xs font-semibold select-none", item.is_active ? "text-primary-700" : "text-gray-500")}>
                            {item.is_active ? 'Tampil' : 'Sembunyi'}
                        </span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Angka</label>
                    <input
                        type="number"
                        min="0"
                        value={item.nilai}
                        onChange={(e) => updateItem(index, 'nilai', parseInt(e.target.value) || 0)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Akhiran (Suffix)</label>
                    <input
                        type="text"
                        maxLength={5}
                        value={item.suffix || ''}
                        onChange={(e) => updateItem(index, 'suffix', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Cth: +, %"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label teks</label>
                    <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateItem(index, 'label', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Label deskripsi (ID)"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label teks (EN)</label>
                    <input
                        type="text"
                        value={item.label_en || ''}
                        onChange={(e) => updateItem(index, 'label_en', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="English translation"
                    />
                </div>
            </div>
        </div>
    );
}

export default function StatistikIndex({ statistik: initialStatistik }: Props) {
    const [items, setItems] = useState<StatistikItem[]>(initialStatistik);
    const [isSaving, setIsSaving] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            let newItems = [...items];
            const oldIndex = newItems.findIndex((item) => item.id === active.id);
            const newIndex = newItems.findIndex((item) => item.id === over?.id);

            newItems = arrayMove(newItems, oldIndex, newIndex);

            newItems = newItems.map((item, index) => ({
                ...item,
                sort_order: index + 1
            }));

            setItems(newItems);

            // Native CSRF fetch for reorder
            const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            fetch(route('admin.statistik.reorder'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    items: newItems.map(item => ({ id: item.id, sort_order: item.sort_order }))
                })
            }).then(() => {
                router.reload({ only: ['statistik'] });
            }).catch(console.error);
        }
    };

    const updateItemValue = (index: number, field: keyof StatistikItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const saveAll = async () => {
        setIsSaving(true);
        const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        try {
            const promises = items.map(item =>
                fetch(route('admin.statistik.update', item.id), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': token,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        nilai: item.nilai,
                        label: item.label,
                        label_en: item.label_en,
                        suffix: item.suffix,
                        is_active: item.is_active,
                    })
                })
            );

            await Promise.all(promises);

            router.reload({ only: ['statistik'] });

            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 3000);

        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Statistik Beranda" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Statistik Beranda</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Kelola angka statistik yang tampil di halaman beranda. Drag & drop untuk mengubah urutan.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-0">
                    {/* LEFT COLUMN - FORM */}
                    <div className="flex-1 lg:max-w-3xl">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((item, index) => (
                                    <SortableItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        updateItem={updateItemValue}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        <div className="mt-6 flex items-center gap-4 bg-white p-4 border rounded-xl shadow-sm">
                            <button
                                type="button"
                                onClick={saveAll}
                                disabled={isSaving}
                                className={cn(
                                    "inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all",
                                    isSaving ? "bg-primary-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                )}
                            >
                                <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-spin")} />
                                {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                            </button>

                            {recentlySuccessful && (
                                <span className="text-sm font-medium text-emerald-600 flex items-center bg-emerald-50 px-3 py-1.5 rounded-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                                    Tersimpan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - PREVIEW (Desktop only) */}
                    <div className="hidden lg:block w-80 shrink-0">
                        <div className="sticky top-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Live Preview (Mobile layout)</h3>
                            <div className="bg-primary-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-gold-500/10 blur-2xl"></div>

                                <div className="space-y-4 relative z-10 w-full h-full">
                                    {items.filter(i => i.is_active).map(item => {
                                        const Icon = item.icon_name && (LucideIcons as any)[item.icon_name]
                                            ? (LucideIcons as any)[item.icon_name]
                                            : Activity;
                                        return (
                                            <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 -mt-2 -mr-2 text-white/5 group-hover:text-white/10 transition-colors duration-500">
                                                    <Icon className="w-20 h-20" />
                                                </div>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center text-gold-400 border border-gold-500/30">
                                                        <Icon className="w-6 h-6 shrink-0" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-bold text-white tracking-tight">
                                                                {item.nilai.toLocaleString('id-ID')}
                                                            </span>
                                                            {item.suffix && (
                                                                <span className="text-gold-400 font-bold text-sm">{item.suffix}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-white/70 text-xs font-medium leading-none mt-1 uppercase tracking-wider">{item.label}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {items.filter(i => i.is_active).length === 0 && (
                                        <div className="text-center py-8 text-white/50 text-sm border border-dashed border-white/20 rounded-xl">
                                            Tidak ada statistik aktif
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
