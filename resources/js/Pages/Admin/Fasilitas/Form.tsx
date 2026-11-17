import React, { useState, useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import { ArrowLeft, Save, UploadCloud, X, Building2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Fasilitas, FasilitasMedia } from '@/types';

interface Props {
    fasilitas: Fasilitas | null;
}

const KATEGORI_OPTIONS = [
    { value: 'ruang_praktik', label: 'Ruang Praktik / Bengkel / Lab' },
    { value: 'umum', label: 'Umum (Perpustakaan, Aula, dll)' },
    { value: 'olahraga', label: 'Sarana Olahraga' },
    { value: 'ibadah', label: 'Sarana Ibadah' },
];

export default function Form({ fasilitas }: Props) {
    const isEdit = !!fasilitas;
    const [existingMedia, setExistingMedia] = useState<FasilitasMedia[]>(fasilitas?.media || []);
    const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        kategori: fasilitas?.kategori || 'ruang_praktik',
        urutan: fasilitas?.urutan ?? 0,
        is_active: fasilitas?.is_active ?? true,
        translations: {
            id: {
                nama: fasilitas?.translations?.id?.nama || '',
                deskripsi: fasilitas?.translations?.id?.deskripsi || '',
            },
            en: {
                nama: fasilitas?.translations?.en?.nama || '',
                deskripsi: fasilitas?.translations?.en?.deskripsi || '',
            },
        },
        fotos: [] as File[],
        deleted_media_ids: [] as number[],
    });

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const currentTotal = existingMedia.length - deletedMediaIds.length + newFiles.length;
        const availableSlots = 8 - currentTotal;

        if (availableSlots <= 0) {
            toast.error('Maksimal 8 foto untuk setiap fasilitas.');
            return;
        }

        const validSelected: File[] = [];
        const validUrls: string[] = [];

        Array.from(files).forEach((file) => {
            if (validSelected.length >= availableSlots) return;

            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} bukan berkas gambar.`);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${file.name} melebihi batas 2MB.`);
                return;
            }

            validSelected.push(file);
            validUrls.push(URL.createObjectURL(file));
        });

        const updatedFiles = [...newFiles, ...validSelected];
        setNewFiles(updatedFiles);
        setNewPreviews([...newPreviews, ...validUrls]);
        setData('fotos', updatedFiles);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveExisting = (id: number) => {
        const nextDeleted = [...deletedMediaIds, id];
        setDeletedMediaIds(nextDeleted);
        setData('deleted_media_ids', nextDeleted);
    };

    const handleRestoreExisting = (id: number) => {
        const nextDeleted = deletedMediaIds.filter((mid) => mid !== id);
        setDeletedMediaIds(nextDeleted);
        setData('deleted_media_ids', nextDeleted);
    };

    const handleRemoveNew = (index: number) => {
        const updatedFiles = newFiles.filter((_, i) => i !== index);
        const updatedPreviews = newPreviews.filter((_, i) => i !== index);
        setNewFiles(updatedFiles);
        setNewPreviews(updatedPreviews);
        setData('fotos', updatedFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const activeTotal = existingMedia.length - deletedMediaIds.length + newFiles.length;
        if (activeTotal > 8) {
            toast.error('Total foto melebihi batas maksimum 8 foto.');
            return;
        }

        if (isEdit) {
            post(route('admin.fasilitas.update', { fasilita: fasilitas.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Fasilitas berhasil diperbarui.'),
                onError: () => toast.error('Gagal menyimpan perubahan. Periksa kembali form.'),
            });
        } else {
            post(route('admin.fasilitas.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Fasilitas berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat fasilitas. Periksa kembali form.'),
            });
        }
    };

    const totalActiveCount = existingMedia.length - deletedMediaIds.length + newFiles.length;

    return (
        <AdminLayout title={isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas'}>
            <div className="space-y-6 max-w-4xl mx-auto pb-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.fasilitas.index')}>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-5 h-5 text-neutral-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-primary-600" />
                                {isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
                            </h1>
                            <p className="text-sm text-neutral-500">
                                Lengkapi informasi sarana prasarana sekolah untuk ditampilkan ke publik.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200/60 pb-3">
                            Informasi Umum
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Kategori Fasilitas <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={data.kategori}
                                    options={KATEGORI_OPTIONS}
                                    error={errors.kategori}
                                    onChange={(e) => setData('kategori', e.target.value as Fasilitas['kategori'])}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                                <span className="text-sm font-medium text-neutral-700">
                                    Status Aktif (Ditampilkan di publik)
                                </span>
                            </div>
                        </div>

                        {/* Bahasa Indonesia */}
                        <div className="pt-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                                Konten Bahasa Indonesia (Wajib)
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Nama Fasilitas (ID) <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Contoh: Bengkel Otomotif Modern"
                                        value={data.translations.id.nama}
                                        error={errors['translations.id.nama' as keyof typeof errors]}
                                        onChange={(e) =>
                                            setData('translations', {
                                                ...data.translations,
                                                id: { ...data.translations.id, nama: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Deskripsi Fasilitas (ID)
                                    </label>
                                    <TipTapEditor
                                        value={data.translations.id.deskripsi}
                                        onChange={(content) =>
                                            setData('translations', {
                                                ...data.translations,
                                                id: { ...data.translations.id, deskripsi: content },
                                            })
                                        }
                                        error={errors['translations.id.deskripsi' as keyof typeof errors]}
                                        placeholder="Tuliskan spesifikasi, luas, dan sarana di dalam fasilitas ini..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bahasa Inggris */}
                        <div className="pt-4 border-t border-neutral-200/60">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                                Konten Bahasa Inggris (Opsional)
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Nama Fasilitas (EN)
                                    </label>
                                    <Input
                                        placeholder="Contoh: Modern Automotive Workshop"
                                        value={data.translations.en.nama}
                                        error={errors['translations.en.nama' as keyof typeof errors]}
                                        onChange={(e) =>
                                            setData('translations', {
                                                ...data.translations,
                                                en: { ...data.translations.en, nama: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Deskripsi Fasilitas (EN)
                                    </label>
                                    <TipTapEditor
                                        value={data.translations.en.deskripsi}
                                        onChange={(content) =>
                                            setData('translations', {
                                                ...data.translations,
                                                en: { ...data.translations.en, deskripsi: content },
                                            })
                                        }
                                        error={errors['translations.en.deskripsi' as keyof typeof errors]}
                                        placeholder="Write descriptions in English..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unggah Galeri Foto */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                            <div>
                                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary-600" />
                                    Foto Fasilitas
                                </h2>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Unggah hingga maksimal 8 foto dokumentasi fasilitas (Format: JPG/PNG/WebP, maks 2MB per foto).
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                                {totalActiveCount} / 8 Foto
                            </span>
                        </div>

                        {errors.fotos && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                {errors.fotos}
                            </div>
                        )}

                        {/* List Foto Eksisting */}
                        {existingMedia.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Foto Tersimpan
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {existingMedia.map((m) => {
                                        const isDeleted = deletedMediaIds.includes(m.id);
                                        return (
                                            <div
                                                key={m.id}
                                                className={`relative group rounded-lg overflow-hidden border aspect-4/3 transition-all ${
                                                    isDeleted
                                                        ? 'opacity-40 border-red-300 bg-red-50'
                                                        : 'border-neutral-200'
                                                }`}
                                            >
                                                <img
                                                    src={m.thumb_url || m.url}
                                                    alt={m.file_name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                                    {isDeleted ? (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs py-1 px-2 h-auto bg-white"
                                                            onClick={() => handleRestoreExisting(m.id)}
                                                        >
                                                            Batal Hapus
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="danger"
                                                            className="text-xs py-1 px-2 h-auto"
                                                            onClick={() => handleRemoveExisting(m.id)}
                                                        >
                                                            <X className="w-3.5 h-3.5 mr-1" />
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>
                                                {isDeleted && (
                                                    <span className="absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                                                        Akan Dihapus
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* List Foto Baru yang Dipilih */}
                        {newPreviews.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Foto Baru (Belum Disimpan)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {newPreviews.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative group rounded-lg overflow-hidden border border-primary-200 aspect-4/3"
                                        >
                                            <img
                                                src={src}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNew(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm"
                                                title="Hapus foto"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Button Area */}
                        {totalActiveCount < 8 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-neutral-300 hover:border-primary-500 hover:bg-neutral-50/60 rounded-xl p-6 text-center cursor-pointer transition-colors"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                        <UploadCloud className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-neutral-700">
                                        Klik untuk memilih foto fasilitas
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Bisa memilih lebih dari satu foto sekaligus (tersisa {8 - totalActiveCount} slot)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.fasilitas.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-32">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Fasilitas'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
