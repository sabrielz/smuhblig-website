import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Mitra } from '@/types';

interface JurusanOption {
    id: number;
    kode: string;
    nama: string;
}

interface Props {
    mitra: Mitra | null;
    jurusans: JurusanOption[];
}

export default function Form({ mitra, jurusans }: Props) {
    const isEdit = !!mitra;

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        nama: mitra?.nama || '',
        bidang: mitra?.bidang || '',
        url: mitra?.url || '',
        urutan: mitra?.urutan ?? 1,
        is_active: mitra?.is_active ?? true,
        jurusan_ids: mitra?.jurusan_ids || mitra?.jurusans?.map((j) => j.id) || ([] as number[]),
        logo: null as File | null,
        hapus_logo: false,
    });

    const handleJurusanToggle = (id: number) => {
        setData(
            'jurusan_ids',
            data.jurusan_ids.includes(id)
                ? data.jurusan_ids.filter((item) => item !== id)
                : [...data.jurusan_ids, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.mitra.update', { mitra: mitra.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Mitra industri berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui mitra. Periksa formulir.'),
            });
        } else {
            post(route('admin.mitra.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Mitra industri berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat mitra. Periksa formulir.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Mitra Industri' : 'Tambah Mitra Industri'}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.mitra.index')}>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                                {isEdit ? 'Edit Mitra Industri' : 'Tambah Mitra Industri'}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {isEdit
                                    ? 'Perbarui profil mitra industri dan kerja sama jurusan.'
                                    : 'Tambahkan perusahaan rekanan baru dan tautkan ke jurusan terkait.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Utama */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Profil Perusahaan / Rekanan
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Nama Perusahaan / Lembaga <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Contoh: PT Telkom Indonesia"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && (
                                    <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Bidang Industri <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Contoh: Teknologi Informasi & Telekomunikasi"
                                    value={data.bidang}
                                    onChange={(e) => setData('bidang', e.target.value)}
                                />
                                {errors.bidang && (
                                    <p className="text-xs text-red-500 mt-1">{errors.bidang}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Tautan Website Resmi (Opsional)
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://..."
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                />
                                {errors.url && (
                                    <p className="text-xs text-red-500 mt-1">{errors.url}</p>
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

                        {/* Logo Perusahaan */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Logo Perusahaan (Maks. 2 MB)
                            </label>
                            <ImageUpload
                                value={mitra?.logo_url || undefined}
                                onChange={(file) => {
                                    setData('logo', file);
                                    if (file) setData('hapus_logo', false);
                                }}
                                error={errors.logo}
                            />
                            <p className="text-[11px] text-neutral-400 mt-1">
                                Disarankan format PNG transparan atau WebP untuk tampilan logo terbaik di Beranda.
                            </p>
                        </div>

                        {/* Jurusan yang Bekerja Sama */}
                        <div className="pt-2">
                            <label className="block text-xs font-medium text-neutral-700 mb-2">
                                Jurusan yang Bekerja Sama (Opsional, kosongkan jika umum/semua)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {jurusans.map((j) => {
                                    const isChecked = data.jurusan_ids.includes(j.id);
                                    return (
                                        <label
                                            key={j.id}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                                                isChecked
                                                    ? 'bg-primary-50/70 border-primary-300 text-primary-900'
                                                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleJurusanToggle(j.id)}
                                                className="w-4 h-4 rounded text-primary-600 border-neutral-300 focus:ring-primary-500"
                                            />
                                            <span className="text-xs font-medium">
                                                <span className="font-bold">{j.kode}</span> — {j.nama}
                                            </span>
                                        </label>
                                    );
                                })}
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
                                    Tampilkan logo mitra ini di website publik
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.mitra.index')}>
                            <Button variant="outline" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Mitra'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
