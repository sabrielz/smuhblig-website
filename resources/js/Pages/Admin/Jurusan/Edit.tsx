import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

function DynamicList({ label, items, onChange }: { label: string, items: string[], onChange: (items: string[]) => void }) {
    const handleAdd = () => {
        onChange([...items, '']);
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    const handleChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-1" /> Tambah
                </Button>
            </div>
            {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <Input
                        value={item}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder={`Masukkan ${label.toLowerCase()}...`}
                        className="flex-1"
                    />
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemove(index)} className="shrink-0 flex items-center justify-center px-2 py-2 rounded-md transition-colors bg-red-100 text-red-600 hover:bg-red-200">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            {items.length === 0 && <p className="text-sm text-gray-500 italic text-center py-2 border border-dashed rounded-md border-gray-200">Tidak ada item</p>}
        </div>
    );
}

export default function Edit({ jurusan }: { jurusan: any }) {
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        cover: null as File | null,
        id: jurusan.id_data,
        en: jurusan.en_data,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.jurusan.update', jurusan.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Jurusan berhasil diperbarui!'),
            onError: () => toast.error('Harap periksa form kembali.'),
        });
    };

    return (
        <AdminLayout title={`Edit Jurusan ${jurusan.kode}`}>
            <Head title={`Edit Jurusan ${jurusan.kode}`} />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.jurusan.index')}>
                        <Button variant="outline" size="sm" className="px-3 text-neutral-600 hover:text-neutral-900">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Jurusan {jurusan.kode}</h1>
                        <p className="text-gray-500 text-sm mt-1">Perbarui konten dan informasi program keahlian.</p>
                    </div>
                </div>
                <Button onClick={submit} disabled={processing} className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                </Button>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 flex p-4 pb-0 space-x-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('id')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'id' ? 'border-primary-navy text-primary-navy' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Bahasa Indonesia (ID)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('en')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'en' ? 'border-primary-navy text-primary-navy' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            English (EN)
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <Input
                            label={`Nama Jurusan (${activeTab.toUpperCase()})`}
                            value={data[activeTab].nama}
                            onChange={(e) => setData(activeTab, { ...data[activeTab], nama: e.target.value })}
                            error={errors[`${activeTab}.nama` as keyof typeof errors]}
                            required={activeTab === 'id'}
                        />

                        <Input
                            label={`Tagline (${activeTab.toUpperCase()})`}
                            value={data[activeTab].tagline}
                            onChange={(e) => setData(activeTab, { ...data[activeTab], tagline: e.target.value })}
                            error={errors[`${activeTab}.tagline` as keyof typeof errors]}
                            required={activeTab === 'id'}
                        />

                        <Textarea
                            label={`Deskripsi Singkat (${activeTab.toUpperCase()})`}
                            value={data[activeTab].deskripsi_singkat}
                            onChange={(e) => setData(activeTab, { ...data[activeTab], deskripsi_singkat: e.target.value })}
                            error={errors[`${activeTab}.deskripsi_singkat` as keyof typeof errors]}
                            required={activeTab === 'id'}
                        />

                        <Textarea
                            label={`Deskripsi Lengkap (${activeTab.toUpperCase()})`}
                            value={data[activeTab].deskripsi_lengkap}
                            onChange={(e) => setData(activeTab, { ...data[activeTab], deskripsi_lengkap: e.target.value })}
                            error={errors[`${activeTab}.deskripsi_lengkap` as keyof typeof errors]}
                            rows={6}
                            required={activeTab === 'id'}
                        />

                        <hr className="border-gray-100" />

                        <DynamicList
                            label={`Kompetensi Keahlian (${activeTab.toUpperCase()})`}
                            items={data[activeTab].kompetensi}
                            onChange={(items) => setData(activeTab, { ...data[activeTab], kompetensi: items })}
                        />

                        <DynamicList
                            label={`Prospek Karir (${activeTab.toUpperCase()})`}
                            items={data[activeTab].prospek_karir}
                            onChange={(items) => setData(activeTab, { ...data[activeTab], prospek_karir: items })}
                        />

                        <DynamicList
                            label={`Fasilitas Unggulan (${activeTab.toUpperCase()})`}
                            items={data[activeTab].fasilitas}
                            onChange={(items) => setData(activeTab, { ...data[activeTab], fasilitas: items })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Preview Kartu</h3>
                        <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div
                                className="h-24 w-full"
                                style={{ background: jurusan.color_gradient || 'linear-gradient(to right, #003f87, #001f4d)' }}
                                title="Color Gradient Preview"
                            />
                            <div className="p-4 bg-white text-center font-bold text-gray-800">
                                {data.id.nama || jurusan.kode}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Cover Image (Opsional)</h3>
                        <ImageUpload
                            maxSizeMB={2}
                            value={jurusan.cover_url || ''}
                            onChange={(file: File) => setData('cover', file)}
                        />
                        {errors.cover && <p className="text-sm text-red-600 mt-2">{errors.cover}</p>}
                        <div className="text-xs text-gray-500 mt-2">
                            Ukuran cover gambar rekomendasi: 1280x720px. Max 2MB.
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
