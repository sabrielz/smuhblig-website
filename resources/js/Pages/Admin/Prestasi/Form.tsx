import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import { ArrowLeft, Save, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Prestasi } from '@/types';

interface Props {
    prestasi: Prestasi | null;
    jurusans: Array<{ id: number; nama: string }>;
}

const TINGKAT_OPTIONS = [
    { value: 'sekolah', label: 'Tingkat Sekolah' },
    { value: 'kabupaten', label: 'Tingkat Kabupaten / Kota' },
    { value: 'provinsi', label: 'Tingkat Provinsi' },
    { value: 'nasional', label: 'Tingkat Nasional' },
    { value: 'internasional', label: 'Tingkat Internasional' },
];

const KATEGORI_OPTIONS = [
    { value: 'akademik', label: 'Akademik' },
    { value: 'non_akademik', label: 'Non-Akademik' },
];

export default function Form({ prestasi, jurusans }: Props) {
    const isEdit = !!prestasi;

    const currentYear = new Date().getFullYear();

    const jurusanOptions = [
        { value: '', label: 'Umum / Tidak Terikat Jurusan Tertentu' },
        ...jurusans.map((j) => ({
            value: j.id,
            label: j.nama,
        })),
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        tingkat: prestasi?.tingkat || 'kabupaten',
        kategori: prestasi?.kategori || 'non_akademik',
        tahun: prestasi?.tahun || currentYear,
        tanggal: prestasi?.tanggal || '',
        jurusan_id: prestasi?.jurusan_id || '',
        is_active: prestasi?.is_active ?? true,
        translations: {
            id: {
                judul: prestasi?.translations?.id?.judul || '',
                ringkasan: prestasi?.translations?.id?.ringkasan || '',
            },
            en: {
                judul: prestasi?.translations?.en?.judul || '',
                ringkasan: prestasi?.translations?.en?.ringkasan || '',
            },
        },
        foto: null as File | null,
        hapus_foto: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.prestasi.update', { prestasi: prestasi.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Prestasi berhasil diperbarui.'),
                onError: () => toast.error('Gagal menyimpan perubahan. Periksa kembali form.'),
            });
        } else {
            post(route('admin.prestasi.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Prestasi berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat prestasi. Periksa kembali form.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Prestasi' : 'Tambah Prestasi'}>
            <div className="space-y-6 max-w-4xl mx-auto pb-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.prestasi.index')}>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-5 h-5 text-neutral-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-gold-500" />
                                {isEdit ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
                            </h1>
                            <p className="text-sm text-neutral-500">
                                Dokumentasikan penghargaan dan kejuaraan yang diraih siswa maupun sekolah.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Umum */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200/60 pb-3">
                            Informasi Kejuaraan & Tingkat
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Tingkat Kejuaraan <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={data.tingkat}
                                    options={TINGKAT_OPTIONS}
                                    error={errors.tingkat}
                                    onChange={(e) => setData('tingkat', e.target.value as Prestasi['tingkat'])}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Kategori Prestasi <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={data.kategori}
                                    options={KATEGORI_OPTIONS}
                                    error={errors.kategori}
                                    onChange={(e) => setData('kategori', e.target.value as Prestasi['kategori'])}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Tahun Perolehan <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    min={2000}
                                    max={2100}
                                    value={data.tahun}
                                    error={errors.tahun}
                                    onChange={(e) => setData('tahun', Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Tanggal Pelaksanaan / Perolehan
                                </label>
                                <Input
                                    type="date"
                                    value={data.tanggal}
                                    error={errors.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Jurusan / Program Keahlian
                                </label>
                                <Select
                                    value={data.jurusan_id}
                                    options={jurusanOptions}
                                    error={errors.jurusan_id}
                                    onChange={(e) => setData('jurusan_id', e.target.value ? Number(e.target.value) : '')}
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

                        {/* Foto Dokumentasi / Tropi */}
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Foto Dokumentasi / Penyerahan Tropi (Maks 2MB)
                            </label>
                            <div className="max-w-md">
                                <ImageUpload
                                    value={prestasi?.foto_url || undefined}
                                    onChange={(file) => {
                                        setData('foto', file);
                                        setData('hapus_foto', false);
                                    }}
                                    error={errors.foto}
                                    aspectRatio="aspect-16/9"
                                />
                            </div>
                        </div>

                        {/* Bahasa Indonesia */}
                        <div className="pt-4 border-t border-neutral-200/60">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                                Konten Bahasa Indonesia (Wajib)
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Judul Prestasi / Kejuaraan (ID) <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Contoh: Juara 1 Lomba Kompetensi Siswa (LKS) Tingkat Nasional"
                                        value={data.translations.id.judul}
                                        error={errors['translations.id.judul' as keyof typeof errors]}
                                        onChange={(e) =>
                                            setData('translations', {
                                                ...data.translations,
                                                id: { ...data.translations.id, judul: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Ringkasan & Keterangan Prestasi (ID)
                                    </label>
                                    <TipTapEditor
                                        value={data.translations.id.ringkasan}
                                        onChange={(content) =>
                                            setData('translations', {
                                                ...data.translations,
                                                id: { ...data.translations.id, ringkasan: content },
                                            })
                                        }
                                        error={errors['translations.id.ringkasan' as keyof typeof errors]}
                                        placeholder="Tuliskan nama pembimbing, nama peserta didik peraih prestasi, dan deskripsi kejuaraan..."
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
                                        Judul Prestasi (EN)
                                    </label>
                                    <Input
                                        placeholder="Contoh: 1st Place National Vocational Student Skills Competition"
                                        value={data.translations.en.judul}
                                        error={errors['translations.en.judul' as keyof typeof errors]}
                                        onChange={(e) =>
                                            setData('translations', {
                                                ...data.translations,
                                                en: { ...data.translations.en, judul: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Ringkasan & Keterangan (EN)
                                    </label>
                                    <TipTapEditor
                                        value={data.translations.en.ringkasan}
                                        onChange={(content) =>
                                            setData('translations', {
                                                ...data.translations,
                                                en: { ...data.translations.en, ringkasan: content },
                                            })
                                        }
                                        error={errors['translations.en.ringkasan' as keyof typeof errors]}
                                        placeholder="Write descriptions in English..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.prestasi.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-32">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Prestasi'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
