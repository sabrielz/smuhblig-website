import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Ekstrakurikuler } from '@/types';

interface Props {
    ekskul: Ekstrakurikuler | null;
    gurus: Array<{ id: number; nama: string }>;
}

export default function Form({ ekskul, gurus }: Props) {
    const isEdit = !!ekskul;

    const guruOptions = [
        { value: '', label: 'Belum Ditentukan / Tidak Ada' },
        ...gurus.map((g) => ({
            value: g.id,
            label: g.nama,
        })),
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        pembina_guru_id: ekskul?.pembina_guru_id || '',
        urutan: ekskul?.urutan ?? 0,
        is_active: ekskul?.is_active ?? true,
        translations: {
            id: {
                nama: ekskul?.translations?.id?.nama || '',
                deskripsi: ekskul?.translations?.id?.deskripsi || '',
                jadwal: ekskul?.translations?.id?.jadwal || '',
            },
            en: {
                nama: ekskul?.translations?.en?.nama || '',
                deskripsi: ekskul?.translations?.en?.deskripsi || '',
                jadwal: ekskul?.translations?.en?.jadwal || '',
            },
        },
        foto: null as File | null,
        hapus_foto: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.ekstrakurikuler.update', { ekstrakurikuler: ekskul.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Ekstrakurikuler berhasil diperbarui.'),
                onError: () => toast.error('Gagal menyimpan perubahan. Periksa kembali form.'),
            });
        } else {
            post(route('admin.ekstrakurikuler.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Ekstrakurikuler berhasil dibuat.'),
                onError: () => toast.error('Gagal membuat ekstrakurikuler. Periksa kembali form.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}>
            <div className="space-y-6 max-w-4xl mx-auto pb-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.ekstrakurikuler.index')}>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-5 h-5 text-neutral-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-primary-600" />
                                {isEdit ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
                            </h1>
                            <p className="text-sm text-neutral-500">
                                Lengkapi informasi kegiatan ekstrakurikuler sekolah untuk ditampilkan ke publik.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Umum & Pembina */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200/60 pb-3">
                            Informasi Umum
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Guru Pembina
                                </label>
                                <Select
                                    value={data.pembina_guru_id}
                                    options={guruOptions}
                                    error={errors.pembina_guru_id}
                                    onChange={(e) => setData('pembina_guru_id', e.target.value ? Number(e.target.value) : '')}
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

                        {/* Foto Dokumentasi Utama */}
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Foto Dokumentasi / Logo Kegiatan (Maks 2MB)
                            </label>
                            <div className="max-w-md">
                                <ImageUpload
                                    value={ekskul?.foto_url || undefined}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Nama Ekstrakurikuler (ID) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Contoh: Hizbul Wathan (HW)"
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
                                            Jadwal Latihan / Kegiatan (ID)
                                        </label>
                                        <Input
                                            placeholder="Contoh: Jumat, 14.00 - 16.30 WIB"
                                            value={data.translations.id.jadwal}
                                            error={errors['translations.id.jadwal' as keyof typeof errors]}
                                            onChange={(e) =>
                                                setData('translations', {
                                                    ...data.translations,
                                                    id: { ...data.translations.id, jadwal: e.target.value },
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Deskripsi Kegiatan (ID)
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
                                        placeholder="Jelaskan tujuan kegiatan, materi pelatihan, dan prestasi yang diraih..."
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Nama Ekstrakurikuler (EN)
                                        </label>
                                        <Input
                                            placeholder="Contoh: Hizbul Wathan Scouting"
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
                                            Jadwal Latihan (EN)
                                        </label>
                                        <Input
                                            placeholder="Contoh: Friday, 14.00 - 16.30 WIB"
                                            value={data.translations.en.jadwal}
                                            error={errors['translations.en.jadwal' as keyof typeof errors]}
                                            onChange={(e) =>
                                                setData('translations', {
                                                    ...data.translations,
                                                    en: { ...data.translations.en, jadwal: e.target.value },
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Deskripsi Kegiatan (EN)
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

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.ekstrakurikuler.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-32">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Ekstrakurikuler'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
