import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Faq } from '@/types';

interface Props {
    faq: Faq | null;
}

const KATEGORI_OPTIONS = [
    { value: 'umum', label: 'Umum' },
    { value: 'pendaftaran', label: 'Pendaftaran (SPMB)' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'fasilitas', label: 'Fasilitas' },
];

export default function Form({ faq }: Props) {
    const isEdit = !!faq;

    const { data, setData, post, put, processing, errors } = useForm({
        kategori: faq?.kategori || 'umum',
        urutan: faq?.urutan ?? 1,
        is_active: faq?.is_active ?? true,
        translations: {
            id: {
                pertanyaan: faq?.translations?.id?.pertanyaan || '',
                jawaban: faq?.translations?.id?.jawaban || '',
            },
            en: {
                pertanyaan: faq?.translations?.en?.pertanyaan || '',
                jawaban: faq?.translations?.en?.jawaban || '',
            },
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.faq.update', { faq: faq.id }), {
                preserveScroll: true,
                onSuccess: () => toast.success('FAQ berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui FAQ. Periksa formulir.'),
            });
        } else {
            post(route('admin.faq.store'), {
                preserveScroll: true,
                onSuccess: () => toast.success('FAQ berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat FAQ. Periksa formulir.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit FAQ' : 'Tambah FAQ'}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.faq.index')}>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                                {isEdit ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ'}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {isEdit
                                    ? 'Perbarui pertanyaan atau jawaban FAQ sekolah.'
                                    : 'Tambahkan pertanyaan umum beserta jawaban informatif.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pengaturan Dasar */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Kategori & Status
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Kategori FAQ <span className="text-red-500">*</span>
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
                                    Nomor Urut Tampil
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={data.urutan}
                                    onChange={(e) => setData('urutan', parseInt(e.target.value) || 1)}
                                />
                                {errors.urutan && (
                                    <p className="text-xs text-red-500 mt-1">{errors.urutan}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-primary-600 border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-xs font-medium text-neutral-700">
                                    Tampilkan pertanyaan ini di halaman publik
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
                                Pertanyaan <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Contoh: Kapan pendaftaran siswa baru gelombang pertama dibuka?"
                                value={data.translations.id.pertanyaan}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        id: { ...data.translations.id, pertanyaan: e.target.value },
                                    })
                                }
                            />
                            {errors['translations.id.pertanyaan'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.id.pertanyaan']}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Jawaban Lengkap <span className="text-red-500">*</span>
                            </label>
                            <TipTapEditor
                                value={data.translations.id.jawaban}
                                onChange={(content) =>
                                    setData('translations', {
                                        ...data.translations,
                                        id: { ...data.translations.id, jawaban: content },
                                    })
                                }
                                placeholder="Tuliskan jawaban yang jelas dan informatif..."
                            />
                            {errors['translations.id.jawaban'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.id.jawaban']}</p>
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
                                Question (English)
                            </label>
                            <Input
                                placeholder="e.g. When is the first wave of admissions open?"
                                value={data.translations.en.pertanyaan}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        en: { ...data.translations.en, pertanyaan: e.target.value },
                                    })
                                }
                            />
                            {errors['translations.en.pertanyaan'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.en.pertanyaan']}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Answer (English)
                            </label>
                            <TipTapEditor
                                value={data.translations.en.jawaban}
                                onChange={(content) =>
                                    setData('translations', {
                                        ...data.translations,
                                        en: { ...data.translations.en, jawaban: content },
                                    })
                                }
                                placeholder="Write clear answer in English..."
                            />
                            {errors['translations.en.jawaban'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.en.jawaban']}</p>
                            )}
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.faq.index')}>
                            <Button variant="outline" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat FAQ'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
