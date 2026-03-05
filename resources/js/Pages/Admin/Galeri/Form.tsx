import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { ArrowLeft, Save, Calendar as CalendarIcon } from 'lucide-react';

interface Galeri {
    id: number;
    judul_id: string;
    judul_en: string | null;
    deskripsi_id: string | null;
    deskripsi_en: string | null;
    event_date: string | null;
    is_active: boolean;
    is_featured: boolean;
}

interface Props {
    galeri: Galeri | null;
}

export default function Form({ galeri }: Props) {
    const isEdit = !!galeri;

    const { data, setData, post, put, processing, errors } = useForm({
        judul_id: galeri?.judul_id || '',
        judul_en: galeri?.judul_en || '',
        deskripsi_id: galeri?.deskripsi_id || '',
        deskripsi_en: galeri?.deskripsi_en || '',
        event_date: galeri?.event_date || '',
        is_active: galeri?.is_active ?? true,
        is_featured: galeri?.is_featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.galeri.update', { galeri: galeri.id } as any));
        } else {
            post(route('admin.galeri.store'));
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Album' : 'Tambah Album Baru'}>
            <Head title={isEdit ? 'Edit Album' : 'Tambah Album'} />

            <div className="flex items-center gap-4 mb-6">
                <Link href={route('admin.galeri.index')}>
                    <Button variant="outline" size="sm" className="px-3">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 border-none m-0 p-0 leading-tight">
                        {isEdit ? 'Edit Album Galeri' : 'Buat Album Galeri Baru'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEdit ? 'Ubah informasi album galeri.' : 'Silakan lengkapi informasi dasar album sebelum mengunggah foto.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Informasi Konten</h2>

                        <div className="grid gap-6">
                            <Input
                                label="Judul Album (ID)"
                                value={data.judul_id}
                                onChange={(e) => setData('judul_id', e.target.value)}
                                error={errors.judul_id}
                                required
                            />
                            <Input
                                label="Judul Album (EN) - Pilihan"
                                value={data.judul_en}
                                onChange={(e) => setData('judul_en', e.target.value)}
                                error={errors.judul_en}
                                placeholder="Kosongkan jika ingin diterjemahkan oleh AI"
                            />

                            <Textarea
                                label="Deskripsi Album (ID)"
                                value={data.deskripsi_id}
                                onChange={(e) => setData('deskripsi_id', e.target.value)}
                                error={errors.deskripsi_id}
                                rows={3}
                            />
                            <Textarea
                                label="Deskripsi Album (EN) - Pilihan"
                                value={data.deskripsi_en}
                                onChange={(e) => setData('deskripsi_en', e.target.value)}
                                error={errors.deskripsi_en}
                                rows={3}
                                placeholder="Kosongkan jika ingin diterjemahkan oleh AI"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Pengaturan Album</h2>

                        <Input
                            type="date"
                            label="Tanggal Kegiatan"
                            leftIcon={<CalendarIcon className="w-4 h-4 text-neutral-500" />}
                            value={data.event_date}
                            onChange={(e) => setData('event_date', e.target.value)}
                            error={errors.event_date}
                        />

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors bg-white">
                                <div className="flex h-5 items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">Aktifkan Album</span>
                                    <span className="text-xs text-gray-500">
                                        Album yang aktif akan ditampilkan di halaman publik pengunjung.
                                    </span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-amber-50 cursor-pointer transition-colors bg-white">
                                <div className="flex h-5 items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-amber-900">Jadikan Pilihan Beranda (Featured)</span>
                                    <span className="text-xs text-amber-700/70">
                                        Tampilkan album ini di halaman utama (Beranda).
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="pt-4 border-t">
                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Menyimpan...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Simpan Album
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
