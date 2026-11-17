import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { Switch } from '@/Components/UI/Switch';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Guru } from '@/types';

interface Props {
    guru: Guru | null;
    jurusans: Array<{ id: number; nama: string }>;
}

export default function Form({ guru, jurusans }: Props) {
    const isEdit = !!guru;
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

    const { data, setData, post, processing, errors } = useForm<{
        nama: string;
        gelar_depan: string;
        gelar_belakang: string;
        kelompok: 'guru' | 'tendik';
        jurusan_id: string;
        urutan: number;
        is_active: boolean;
        foto: File | null;
        remove_foto: boolean;
        translations: {
            id: { jabatan: string; mapel: string };
            en: { jabatan: string; mapel: string };
        };
        _method?: string;
    }>({
        nama: guru?.nama || '',
        gelar_depan: guru?.gelar_depan || '',
        gelar_belakang: guru?.gelar_belakang || '',
        kelompok: guru?.kelompok || 'guru',
        jurusan_id: guru?.jurusan_id ? String(guru.jurusan_id) : '',
        urutan: guru?.urutan || 0,
        is_active: guru?.is_active ?? true,
        foto: null,
        remove_foto: false,
        translations: {
            id: {
                jabatan: guru?.translations?.id?.jabatan || '',
                mapel: guru?.translations?.id?.mapel || '',
            },
            en: {
                jabatan: guru?.translations?.en?.jabatan || '',
                mapel: guru?.translations?.en?.mapel || '',
            },
        },
        ...(isEdit ? { _method: 'PUT' } : {}),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.guru.update', { guru: guru.id }), {
                forceFormData: true,
                onSuccess: () => toast.success('Data berhasil diperbarui.'),
                onError: () => toast.error('Cek kembali formulir isian.'),
            });
        } else {
            post(route('admin.guru.store'), {
                forceFormData: true,
                onSuccess: () => toast.success('Data berhasil ditambahkan.'),
                onError: () => toast.error('Cek kembali formulir isian.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Guru / Tendik' : 'Tambah Guru / Tendik'}>
            <Head title={isEdit ? 'Edit Guru / Tendik - Admin' : 'Tambah Guru / Tendik - Admin'} />

            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.guru.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">
                            {isEdit ? 'Edit Guru / Tendik' : 'Tambah Guru / Tendik Baru'}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-0.5">
                            Data profil pengajar atau staf kependidikan.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Dasar */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                        <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Informasi Identitas
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-1">
                                <Input
                                    label="Gelar Depan"
                                    placeholder="Contoh: Drs."
                                    value={data.gelar_depan}
                                    onChange={(e) => setData('gelar_depan', e.target.value)}
                                    error={errors.gelar_depan}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Input
                                    label="Nama Lengkap *"
                                    placeholder="Nama tanpa gelar..."
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    error={errors.nama}
                                    required
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <Input
                                    label="Gelar Belakang"
                                    placeholder="Contoh: S.Pd."
                                    value={data.gelar_belakang}
                                    onChange={(e) => setData('gelar_belakang', e.target.value)}
                                    error={errors.gelar_belakang}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <Select
                                    label="Kelompok *"
                                    value={data.kelompok}
                                    onChange={(e) => setData('kelompok', e.target.value as 'guru' | 'tendik')}
                                    options={[
                                        { value: 'guru', label: 'Guru (Tenaga Pendidik)' },
                                        { value: 'tendik', label: 'Tendik (Tenaga Kependidikan)' },
                                    ]}
                                    error={errors.kelompok}
                                />
                            </div>

                            <div>
                                <Select
                                    label="Jurusan Terkait (Opsional)"
                                    value={data.jurusan_id}
                                    onChange={(e) => setData('jurusan_id', e.target.value)}
                                    options={[
                                        { value: '', label: 'Lintas Jurusan / Umum' },
                                        ...jurusans.map((j) => ({ value: String(j.id), label: j.nama })),
                                    ]}
                                    error={errors.jurusan_id}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab Bahasa */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-neutral-500" />
                                <h2 className="text-base font-semibold text-neutral-900">
                                    Jabatan & Mata Pelajaran
                                </h2>
                            </div>

                            <div className="flex bg-neutral-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('id')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                        activeTab === 'id' ? 'bg-white shadow text-primary-600' : 'text-neutral-600'
                                    }`}
                                >
                                    Indonesia (Wajib)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('en')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                        activeTab === 'en' ? 'bg-white shadow text-primary-600' : 'text-neutral-600'
                                    }`}
                                >
                                    English (Opsional)
                                </button>
                            </div>
                        </div>

                        {activeTab === 'id' && (
                            <div className="space-y-4">
                                <Input
                                    label="Jabatan (ID) *"
                                    placeholder="Contoh: Kepala Sekolah / Guru Produktif"
                                    value={data.translations.id.jabatan}
                                    onChange={(e) => {
                                        const newTrans = { ...data.translations };
                                        newTrans.id.jabatan = e.target.value;
                                        setData('translations', newTrans);
                                    }}
                                    error={errors['translations.id.jabatan' as keyof typeof errors]}
                                    required
                                />

                                <Input
                                    label="Mata Pelajaran yang Diampu (ID)"
                                    placeholder="Contoh: Pemrograman Web / Administrasi Sistem Jaringan"
                                    value={data.translations.id.mapel}
                                    onChange={(e) => {
                                        const newTrans = { ...data.translations };
                                        newTrans.id.mapel = e.target.value;
                                        setData('translations', newTrans);
                                    }}
                                    error={errors['translations.id.mapel' as keyof typeof errors]}
                                    hint="Dapat dikosongkan untuk staf kependidikan / kepala sekolah."
                                />
                            </div>
                        )}

                        {activeTab === 'en' && (
                            <div className="space-y-4">
                                <Input
                                    label="Jabatan (EN)"
                                    placeholder="Example: Principal / Vocational Teacher"
                                    value={data.translations.en.jabatan}
                                    onChange={(e) => {
                                        const newTrans = { ...data.translations };
                                        newTrans.en.jabatan = e.target.value;
                                        setData('translations', newTrans);
                                    }}
                                    error={errors['translations.en.jabatan' as keyof typeof errors]}
                                />

                                <Input
                                    label="Mata Pelajaran (EN)"
                                    placeholder="Example: Web Programming / Network Administration"
                                    value={data.translations.en.mapel}
                                    onChange={(e) => {
                                        const newTrans = { ...data.translations };
                                        newTrans.en.mapel = e.target.value;
                                        setData('translations', newTrans);
                                    }}
                                    error={errors['translations.en.mapel' as keyof typeof errors]}
                                />
                            </div>
                        )}
                    </div>

                    {/* Foto & Pengaturan Tampilan */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                        <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Foto & Publikasi
                        </h2>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-700">
                                Foto Profil (Maks 2 MB, JPG/PNG/WebP)
                            </label>
                            <ImageUpload
                                value={guru?.foto_url || undefined}
                                onChange={(file: File) => {
                                    setData('foto', file);
                                    setData('remove_foto', false);
                                }}
                                error={errors.foto}
                            />
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-neutral-900">Status Aktif</div>
                                <div className="text-xs text-neutral-500">
                                    Tampilkan di direktori profil sekolah publik.
                                </div>
                            </div>
                            <Switch
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('admin.guru.index')}>
                            <Button variant="ghost" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button variant="primary" type="submit" disabled={processing}>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
