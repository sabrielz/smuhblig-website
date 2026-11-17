import React, { useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { ArrowLeft, Save, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Testimoni } from '@/types';

interface Props {
    testimoni: Testimoni | null;
}

const PERAN_OPTIONS = [
    { value: 'alumni', label: 'Alumni' },
    { value: 'orang_tua', label: 'Orang Tua Siswa' },
    { value: 'mitra', label: 'Mitra Industri' },
];

export default function Form({ testimoni }: Props) {
    const isEdit = !!testimoni;

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        nama: testimoni?.nama || '',
        peran: testimoni?.peran || 'alumni',
        keterangan: testimoni?.keterangan || '',
        persetujuan_tampil: testimoni?.persetujuan_tampil ?? true,
        is_active: testimoni?.is_active ?? true,
        urutan: testimoni?.urutan ?? 1,
        translations: {
            id: {
                kutipan: testimoni?.translations?.id?.kutipan || '',
            },
            en: {
                kutipan: testimoni?.translations?.en?.kutipan || '',
            },
        },
        foto: null as File | null,
        hapus_foto: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi client-side: status aktif butuh persetujuan
        if (data.is_active && !data.persetujuan_tampil) {
            toast.error('Testimoni hanya dapat diaktifkan jika persetujuan tampil telah dicentang.');
            return;
        }

        if (isEdit) {
            post(route('admin.testimoni.update', { testimoni: testimoni.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Testimoni berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui testimoni. Periksa kembali form.'),
            });
        } else {
            post(route('admin.testimoni.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Testimoni berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat testimoni. Periksa kembali form.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.testimoni.index')}>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                                {isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {isEdit
                                    ? 'Perbarui kutipan testimoni atau izin publikasi.'
                                    : 'Tambahkan testimoni baru dari alumni, wali siswa, atau mitra kerja.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Narasumber */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Informasi Narasumber
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Contoh: Ahmad Fauzi, S.Kom."
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && (
                                    <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Peran / Kategori <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={PERAN_OPTIONS}
                                    value={data.peran}
                                    onChange={(e) => setData('peran', e.target.value as any)}
                                />
                                {errors.peran && (
                                    <p className="text-xs text-red-500 mt-1">{errors.peran}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Keterangan / Jabatan <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Contoh: Alumni TKJ 2021 • Network Engineer"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                />
                                {errors.keterangan && (
                                    <p className="text-xs text-red-500 mt-1">{errors.keterangan}</p>
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

                        {/* Foto Narasumber */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Foto Narasumber (Opsional)
                            </label>
                            <ImageUpload
                                value={testimoni?.foto_url || undefined}
                                onChange={(file) => {
                                    setData('foto', file);
                                    if (file) setData('hapus_foto', false);
                                }}
                                error={errors.foto}
                            />
                            <p className="text-[11px] text-neutral-400 mt-1">
                                Format: JPG, PNG, WebP (Maks. 3 MB, disarankan rasio 1:1)
                            </p>
                        </div>

                        {/* Persetujuan & Status Aktif */}
                        <div className="pt-3 border-t border-neutral-100 space-y-3">
                            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-800 leading-relaxed">
                                    <span className="font-semibold">Penting:</span> Pastikan orang yang bersangkutan sudah memberi izin tertulis atau lisan untuk menampilkan nama, foto, dan kutipannya di website resmi sekolah.
                                </div>
                            </div>

                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.persetujuan_tampil}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setData('persetujuan_tampil', checked);
                                        if (!checked) {
                                            setData('is_active', false);
                                        }
                                    }}
                                    className="w-4 h-4 rounded text-primary-600 border-neutral-300 focus:ring-primary-500 mt-0.5"
                                />
                                <div>
                                    <span className="text-xs font-semibold text-neutral-800 block">
                                        Persetujuan Tampil Diberikan
                                    </span>
                                    <span className="text-[11px] text-neutral-500 block">
                                        Wajib dicentang agar testimoni ini memenuhi syarat legal untuk ditampilkan ke publik.
                                    </span>
                                </div>
                            </label>
                            {errors.persetujuan_tampil && (
                                <p className="text-xs text-red-500 mt-1">{errors.persetujuan_tampil}</p>
                            )}

                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    disabled={!data.persetujuan_tampil}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-primary-600 border-neutral-300 focus:ring-primary-500 disabled:opacity-50 mt-0.5"
                                />
                                <div>
                                    <span className="text-xs font-semibold text-neutral-800 block">
                                        Aktifkan Testimoni di Website
                                    </span>
                                    <span className="text-[11px] text-neutral-500 block">
                                        Testimoni hanya akan muncul di halaman publik bila status aktif dan persetujuan keduanya bernilai benar.
                                    </span>
                                </div>
                            </label>
                            {errors.is_active && (
                                <p className="text-xs text-red-500 mt-1">{errors.is_active}</p>
                            )}
                        </div>
                    </div>

                    {/* Bahasa Indonesia */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-700">
                                ID
                            </span>
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Kutipan Bahasa Indonesia (Utama)
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Kutipan Testimoni <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Tuliskan isi testimoni atau pengalaman narasumber bersama SMK Muhammadiyah Bligo..."
                                value={data.translations.id.kutipan}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        id: { kutipan: e.target.value },
                                    })
                                }
                                className="block w-full rounded-lg border-neutral-300 shadow-xs text-xs sm:text-sm focus:border-primary-600 focus:ring-primary-600"
                            />
                            {errors['translations.id.kutipan'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.id.kutipan']}</p>
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
                                Kutipan Bahasa Inggris (Opsional)
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Quote (English)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Write testimonial quote in English..."
                                value={data.translations.en.kutipan}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        en: { kutipan: e.target.value },
                                    })
                                }
                                className="block w-full rounded-lg border-neutral-300 shadow-xs text-xs sm:text-sm focus:border-primary-600 focus:ring-primary-600"
                            />
                            {errors['translations.en.kutipan'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.en.kutipan']}</p>
                            )}
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.testimoni.index')}>
                            <Button variant="outline" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Testimoni'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
