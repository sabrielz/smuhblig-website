import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { Save, ArrowLeft, FolderTree } from 'lucide-react';
import type { Category } from '@/types';

interface ColorOption {
    hex: string;
    label: string;
}

interface FormProps {
    category: Category | null;
    colors: ColorOption[];
}

export default function KategoriForm({ category, colors }: FormProps) {
    const isEdit = Boolean(category);

    const { data, setData, post, put, processing, errors } = useForm({
        name_id: category?.translations?.id?.name ?? category?.name ?? '',
        name_en: category?.translations?.en?.name ?? '',
        description_id: category?.translations?.id?.description ?? category?.description ?? '',
        description_en: category?.translations?.en?.description ?? '',
        color: category?.color ?? (colors[0]?.hex ?? '#003f87'),
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order ?? 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && category) {
            put(route('admin.kategori.update', { kategori: category.id }));
        } else {
            post(route('admin.kategori.store'));
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}>
            <Head title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.kategori.index')}
                            className="p-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                                {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </h1>
                            <p className="text-neutral-500 text-sm mt-0.5">
                                {isEdit
                                    ? `Memperbarui kategori "${category?.name}"`
                                    : 'Tambahkan kategori pengelompokan artikel baru'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                    {/* Slug otomatis (hanya info saat edit) */}
                    {isEdit && category && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                                Slug Otomatis (URL)
                            </label>
                            <div className="px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-sm text-neutral-600">
                                {category.slug}
                            </div>
                        </div>
                    )}

                    {/* Nama Kategori ID & EN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Nama Kategori (ID) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={data.name_id}
                                onChange={(e) => setData('name_id', e.target.value)}
                                placeholder="Contoh: Prestasi"
                                required
                            />
                            {errors.name_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.name_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Nama Kategori (EN)
                            </label>
                            <Input
                                value={data.name_en}
                                onChange={(e) => setData('name_en', e.target.value)}
                                placeholder="Example: Achievements"
                            />
                            {errors.name_en && (
                                <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi ID & EN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Deskripsi Singkat (ID)
                            </label>
                            <textarea
                                value={data.description_id}
                                onChange={(e) => setData('description_id', e.target.value)}
                                rows={3}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                                placeholder="Deskripsi opsional dalam bahasa Indonesia"
                            />
                            {errors.description_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.description_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Deskripsi Singkat (EN)
                            </label>
                            <textarea
                                value={data.description_en}
                                onChange={(e) => setData('description_en', e.target.value)}
                                rows={3}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                                placeholder="Optional description in English"
                            />
                            {errors.description_en && (
                                <p className="text-red-500 text-xs mt-1">{errors.description_en}</p>
                            )}
                        </div>
                    </div>

                    {/* Pilihan Warna Palet */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-800 mb-2">
                            Warna Label Kategori <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {colors.map((c) => {
                                const isSelected = data.color.toLowerCase() === c.hex.toLowerCase();
                                return (
                                    <button
                                        type="button"
                                        key={c.hex}
                                        onClick={() => setData('color', c.hex)}
                                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                            isSelected
                                                ? 'border-primary-600 bg-primary-50/50 shadow-sm ring-2 ring-primary-500/20'
                                                : 'border-neutral-200 hover:border-neutral-300 bg-white'
                                        }`}
                                    >
                                        <span
                                            className="w-5 h-5 rounded-full shrink-0 border border-black/10"
                                            style={{ backgroundColor: c.hex }}
                                        />
                                        <span className="text-xs font-medium text-neutral-700 truncate">
                                            {c.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.color && (
                            <p className="text-red-500 text-xs mt-1">{errors.color}</p>
                        )}
                    </div>

                    {/* Status & Urutan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                        <div>
                            <label className="block text-sm font-medium text-neutral-800 mb-1">
                                Urutan Tampilan
                            </label>
                            <Input
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', parseInt(e.target.value, 10) || 0)}
                            />
                            {errors.sort_order && (
                                <p className="text-red-500 text-xs mt-1">{errors.sort_order}</p>
                            )}
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-neutral-800">
                                    Aktifkan Kategori
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                        <Link href={route('admin.kategori.index')}>
                            <Button variant="ghost" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            {isEdit ? 'Simpan Perubahan' : 'Buat Kategori'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
