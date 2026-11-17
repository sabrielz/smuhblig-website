import React, { useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import { ArrowLeft, Save, Upload, FileDown, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Unduhan } from '@/types';

interface Props {
    unduhan: Unduhan | null;
}

const KATEGORI_OPTIONS = [
    { value: 'brosur', label: 'Brosur' },
    { value: 'kalender', label: 'Kalender Akademik' },
    { value: 'formulir', label: 'Formulir' },
    { value: 'sk', label: 'Surat Keputusan (SK)' },
    { value: 'lainnya', label: 'Lainnya' },
];

export default function Form({ unduhan }: Props) {
    const isEdit = !!unduhan;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const todayDate = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        kategori: unduhan?.kategori || 'brosur',
        tanggal_terbit: unduhan?.tanggal_terbit ? unduhan.tanggal_terbit.split('T')[0] : todayDate,
        is_active: unduhan?.is_active ?? true,
        translations: {
            id: {
                judul: unduhan?.translations?.id?.judul || '',
                deskripsi: unduhan?.translations?.id?.deskripsi || '',
            },
            en: {
                judul: unduhan?.translations?.en?.judul || '',
                deskripsi: unduhan?.translations?.en?.deskripsi || '',
            },
        },
        berkas: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Validasi ukuran client side (10 MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('Ukuran berkas maksimal 10 MB');
                return;
            }
            setData('berkas', selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.unduhan.update', { unduhan: unduhan.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Dokumen unduhan berhasil diperbarui.'),
                onError: () => toast.error('Gagal menyimpan perubahan. Periksa kembali formulir.'),
            });
        } else {
            post(route('admin.unduhan.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Dokumen unduhan berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat dokumen unduhan. Periksa kembali formulir.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Dokumen Unduhan' : 'Tambah Dokumen Unduhan'}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.unduhan.index')}>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                                {isEdit ? 'Edit Dokumen Unduhan' : 'Tambah Dokumen Unduhan'}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {isEdit
                                    ? 'Perbarui rincian atau ganti berkas dokumen sekolah.'
                                    : 'Unggah berkas baru dan lengkapi deskripsi dokumen.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Utama */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Informasi Dokumen
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Kategori Dokumen <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={KATEGORI_OPTIONS}
                                    value={data.kategori}
                                    onChange={(e) => setData('kategori', e.target.value as any)}
                                />
                                {errors.kategori && (
                                    <p className="text-xs text-red-500 mt-1">{errors.kategori}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Tanggal Terbit <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={data.tanggal_terbit}
                                    onChange={(e) => setData('tanggal_terbit', e.target.value)}
                                />
                                {errors.tanggal_terbit && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tanggal_terbit}</p>
                                )}
                            </div>
                        </div>

                        {/* Berkas File */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Berkas Dokumen {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            
                            <div className="space-y-3">
                                {isEdit && unduhan?.file && (
                                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                        <div className="flex items-center gap-3">
                                            <FileDown className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-neutral-900">{unduhan.file.file_name}</p>
                                                <p className="text-[11px] text-neutral-500">
                                                    Ukuran: {unduhan.file.human_size} • Ekstensi: {unduhan.file.extension.toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan
                                        </span>
                                    </div>
                                )}

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-neutral-200 hover:border-primary-400 rounded-xl p-5 text-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50"
                                >
                                    <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                                    <p className="text-xs font-medium text-neutral-700">
                                        {data.berkas ? (
                                            <span className="text-primary-600 font-semibold">{data.berkas.name}</span>
                                        ) : (
                                            <span>Klik untuk memilih berkas atau seret berkas ke sini</span>
                                        )}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 mt-1">
                                        Format berkas: PDF, DOCX, XLSX (Maks. 10 MB)
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                {errors.berkas && (
                                    <p className="text-xs text-red-500 mt-1">{errors.berkas}</p>
                                )}
                            </div>
                        </div>

                        {/* Status Aktif */}
                        <div className="pt-2">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-primary-600 border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-xs font-medium text-neutral-700">
                                    Publikasikan dokumen ini di halaman publik
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Bahasa Indonesia */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-700">
                                ID
                            </span>
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Konten Bahasa Indonesia (Utama)
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Judul Dokumen <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Contoh: Kalender Akademik Tahun Ajaran 2026/2027"
                                value={data.translations.id.judul}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        id: { ...data.translations.id, judul: e.target.value },
                                    })
                                }
                            />
                            {errors['translations.id.judul'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.id.judul']}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Deskripsi Dokumen (Opsional)
                            </label>
                            <TipTapEditor
                                value={data.translations.id.deskripsi}
                                onChange={(content) =>
                                    setData('translations', {
                                        ...data.translations,
                                        id: { ...data.translations.id, deskripsi: content },
                                    })
                                }
                                placeholder="Tuliskan keterangan singkat mengenai dokumen ini..."
                            />
                            {errors['translations.id.deskripsi'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.id.deskripsi']}</p>
                            )}
                        </div>
                    </div>

                    {/* Bahasa Inggris (Opsional) */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                                EN
                            </span>
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Konten Bahasa Inggris (Opsional)
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Title (English)
                            </label>
                            <Input
                                placeholder="e.g. Academic Calendar Academic Year 2026/2027"
                                value={data.translations.en.judul}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        en: { ...data.translations.en, judul: e.target.value },
                                    })
                                }
                            />
                            {errors['translations.en.judul'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.en.judul']}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Description (English)
                            </label>
                            <TipTapEditor
                                value={data.translations.en.deskripsi}
                                onChange={(content) =>
                                    setData('translations', {
                                        ...data.translations,
                                        en: { ...data.translations.en, deskripsi: content },
                                    })
                                }
                                placeholder="Provide brief summary in English..."
                            />
                            {errors['translations.en.deskripsi'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.en.deskripsi']}</p>
                            )}
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.unduhan.index')}>
                            <Button variant="outline" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Dokumen'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
