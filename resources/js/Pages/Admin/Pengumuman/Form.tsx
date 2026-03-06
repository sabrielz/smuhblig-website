import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { Select } from '@/Components/UI/Select';
import { ArrowLeft, Save, Bell, Calendar as CalendarIcon, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Pengumuman {
    id: number;
    judul_id: string;
    judul_en: string | null;
    konten_id: string | null;
    konten_en: string | null;
    tipe: 'info' | 'penting' | 'urgent';
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    is_active: boolean;
}

interface Props {
    pengumuman: Pengumuman | null;
}

export default function Form({ pengumuman }: Props) {
    const isEdit = !!pengumuman;
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

    const { data, setData, post, put, processing, errors } = useForm({
        judul_id: pengumuman?.judul_id || '',
        judul_en: pengumuman?.judul_en || '',
        konten_id: pengumuman?.konten_id || '',
        konten_en: pengumuman?.konten_en || '',
        tipe: pengumuman?.tipe || 'info',
        tanggal_mulai: pengumuman?.tanggal_mulai || '',
        tanggal_selesai: pengumuman?.tanggal_selesai || '',
        is_active: pengumuman?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.pengumuman.update', { pengumuman: pengumuman.id } as any), {
                onSuccess: () => toast.success('Pengumuman diperbarui.'),
                onError: () => toast.error('Cek kembali form isian.')
            });
        } else {
            post(route('admin.pengumuman.store'), {
                onSuccess: () => toast.success('Pengumuman dibuat.'),
                onError: () => toast.error('Cek kembali form isian.')
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Pengumuman' : 'Buat Pengumuman'}>
            <Head title={isEdit ? 'Edit Pengumuman' : 'Buat Pengumuman'} />

            <div className="flex items-center gap-4 mb-6">
                <Link href={route('admin.pengumuman.index')}>
                    <Button variant="outline" size="sm" className="px-3">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 border-none m-0 p-0 leading-tight">
                        {isEdit ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Informasikan hal-hal penting ke pengunjung website
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                {/* KONTEN */}
                <div className="w-full md:w-[60%] lg:w-[65%] space-y-6 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="flex items-center border-b border-neutral-100 bg-neutral-50 px-4 gap-4">
                            <button
                                type="button"
                                className={cn(
                                    "py-4 px-2 font-medium text-sm transition-colors relative",
                                    activeTab === 'id' ? "text-blue-600" : "text-neutral-500 hover:text-neutral-700"
                                )}
                                onClick={() => setActiveTab('id')}
                            >
                                <span className="flex gap-2 items-center"><Globe className="w-4 h-4" /> Bahasa Indonesia</span>
                                {activeTab === 'id' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                                )}
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    "py-4 px-2 font-medium text-sm transition-colors relative",
                                    activeTab === 'en' ? "text-blue-600" : "text-neutral-500 hover:text-neutral-700"
                                )}
                                onClick={() => setActiveTab('en')}
                            >
                                <span className="flex gap-2 items-center"><Globe className="w-4 h-4" /> English (Optional)</span>
                                {activeTab === 'en' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                                )}
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'id' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                                    <Input
                                        label="Judul Pengumuman (Wajib)"
                                        value={data.judul_id}
                                        onChange={(e) => setData('judul_id', e.target.value)}
                                        error={errors.judul_id}
                                        required
                                        autoFocus
                                    />
                                    <Textarea
                                        label="Isi Pengumuman"
                                        value={data.konten_id || ''}
                                        onChange={(e) => setData('konten_id', e.target.value)}
                                        error={errors.konten_id}
                                        rows={6}
                                        required
                                    />
                                </div>
                            )}

                            {activeTab === 'en' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-lg text-sm text-blue-800 mb-2">
                                        Isi untuk Bahasa Inggris. Jika kosong, akan otomatis diterjemahkan oleh AI.
                                    </div>
                                    <Input
                                        label="Judul Pengumuman (EN)"
                                        value={data.judul_en || ''}
                                        onChange={(e) => setData('judul_en', e.target.value)}
                                        error={errors.judul_en}
                                    />
                                    <Textarea
                                        label="Isi Pengumuman (EN)"
                                        value={data.konten_en || ''}
                                        onChange={(e) => setData('konten_en', e.target.value)}
                                        error={errors.konten_en}
                                        rows={6}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SETTINGS */}
                <div className="w-full md:w-[40%] lg:w-[35%] space-y-6 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex gap-2 items-center">
                            <Bell className="w-5 h-5 text-gray-500" /> Pengaturan
                        </h2>

                        <Select
                            label="Tipe Prioritas"
                            value={data.tipe}
                            onChange={(e) => setData('tipe', e.target.value as any)}
                            options={[
                                { label: 'Info Biasa (Biru)', value: 'info' },
                                { label: 'Penting (Kuning)', value: 'penting' },
                                { label: 'Urgent (Merah)', value: 'urgent' },
                            ]}
                            error={errors.tipe}
                        />

                        <div className="grid gap-4 border-t pt-4">
                            <label className="text-sm font-medium text-neutral-700">Masa Berlaku Pengumuman</label>

                            <Input
                                type="date"
                                label="Tanggal Mulai (Opsional)"
                                leftIcon={<CalendarIcon className="w-4 h-4 text-neutral-500" />}
                                value={data.tanggal_mulai}
                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                error={errors.tanggal_mulai}
                            />

                            <Input
                                type="date"
                                label="Tanggal Selesai (Opsional)"
                                leftIcon={<CalendarIcon className="w-4 h-4 text-neutral-500" />}
                                value={data.tanggal_selesai}
                                onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                error={errors.tanggal_selesai}
                                hint="Kosongkan jika berlaku selamanya."
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
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
                                    <span className="text-sm font-medium text-gray-900">Tayangkan / Aktif</span>
                                    <span className="text-xs text-gray-500">
                                        Matikan jika ingin menyimpan sebagai draft saja.
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="pt-4 border-t">
                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Menyimpan...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Simpan
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
