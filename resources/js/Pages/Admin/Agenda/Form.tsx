import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { Switch } from '@/Components/UI/Switch';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/UI/Tabs';

interface AgendaTranslation {
    judul: string;
    deskripsi: string | null;
    lokasi: string | null;
}

interface Agenda {
    id: number;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    warna: string;
    tipe: string;
    is_active: boolean;
    translations: {
        id: AgendaTranslation | null;
        en: AgendaTranslation | null;
    };
}

interface Props {
    agenda: Agenda | null;
    isEdit: boolean;
}

export default function Form({ agenda, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        tanggal_mulai: agenda?.tanggal_mulai || '',
        tanggal_selesai: agenda?.tanggal_selesai || '',
        warna: agenda?.warna || '#003f87',
        tipe: agenda?.tipe || 'kegiatan',
        is_active: agenda?.is_active ?? true,
        translations: {
            id: {
                judul: agenda?.translations.id?.judul || '',
                deskripsi: agenda?.translations.id?.deskripsi || '',
                lokasi: agenda?.translations.id?.lokasi || '',
            },
            en: {
                judul: agenda?.translations.en?.judul || '',
                deskripsi: agenda?.translations.en?.deskripsi || '',
                lokasi: agenda?.translations.en?.lokasi || '',
            },
        },
    });

    const [activeTab, setActiveTab] = useState('id');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.agenda.update', { agenda: agenda!.id }));
        } else {
            post(route('admin.agenda.store'));
        }
    };

    const presetColors = [
        '#003f87', // Primary navy
        '#c9a84c', // Gold
        '#ef4444', // Red
        '#f59e0b', // Orange
        '#10b981', // Green
        '#8b5cf6', // Purple
    ];

    return (
        <AdminLayout title={isEdit ? 'Edit Agenda' : 'Buat Agenda'}>
            <Head title={isEdit ? 'Edit Agenda' : 'Buat Agenda'} />

            <div className="flex items-center gap-4 mb-6">
                <Link href={route('admin.agenda.index')}>
                    <Button variant="outline" size="sm" className="px-2">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Agenda' : 'Buat Agenda Baru'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Isi form di bawah ini untuk mengelola agenda kegiatan sekolah.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <div className="border-b border-neutral-200 px-1 pt-1 bg-neutral-50/50">
                                    <TabsList className="bg-transparent">
                                        <TabsTrigger value="id" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent shadow-none px-4">
                                            🇮🇩 Indonesia
                                        </TabsTrigger>
                                        <TabsTrigger value="en" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent shadow-none px-4">
                                            🇬🇧 English (Opsional)
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                {['id', 'en'].map((lang) => (
                                    <TabsContent key={lang} value={lang} className="p-6 space-y-6 mt-0">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">
                                                Judul Agenda {lang === 'id' ? '*' : ''}
                                            </label>
                                            <Input
                                                value={data.translations[lang as 'id' | 'en'].judul}
                                                onChange={e => {
                                                    const newData = { ...data };
                                                    newData.translations[lang as 'id' | 'en'].judul = e.target.value;
                                                    setData(newData);
                                                }}
                                                placeholder={lang === 'id' ? 'Contoh: Ujian Tengah Semester' : 'Example: Midterm Exams'}
                                                className={cn(errors[`translations.${lang}.judul` as keyof typeof errors] && "border-red-500 focus:ring-red-500")}
                                            />
                                            {errors[`translations.${lang}.judul` as keyof typeof errors] && (
                                                <p className="text-sm text-red-500">{errors[`translations.${lang}.judul` as keyof typeof errors]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Lokasi</label>
                                            <Input
                                                value={data.translations[lang as 'id' | 'en'].lokasi || ''}
                                                onChange={e => {
                                                    const newData = { ...data };
                                                    newData.translations[lang as 'id' | 'en'].lokasi = e.target.value;
                                                    setData(newData);
                                                }}
                                                placeholder={lang === 'id' ? 'Contoh: Aula Utama' : 'Example: Main Hall'}
                                                className={cn(errors[`translations.${lang}.lokasi` as keyof typeof errors] && "border-red-500 focus:ring-red-500")}
                                            />
                                            {errors[`translations.${lang}.lokasi` as keyof typeof errors] && (
                                                <p className="text-sm text-red-500">{errors[`translations.${lang}.lokasi` as keyof typeof errors]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                                            <Textarea
                                                value={data.translations[lang as 'id' | 'en'].deskripsi || ''}
                                                onChange={e => {
                                                    const newData = { ...data };
                                                    newData.translations[lang as 'id' | 'en'].deskripsi = e.target.value;
                                                    setData(newData);
                                                }}
                                                placeholder={lang === 'id' ? 'Keterangan tambahan...' : 'Additional notes...'}
                                                rows={4}
                                                className={cn(errors[`translations.${lang}.deskripsi` as keyof typeof errors] && "border-red-500 focus:ring-red-500")}
                                            />
                                            {errors[`translations.${lang}.deskripsi` as keyof typeof errors] && (
                                                <p className="text-sm text-red-500">{errors[`translations.${lang}.deskripsi` as keyof typeof errors]}</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 space-y-6">
                            <h3 className="font-semibold text-gray-900 pb-4 border-b">Detail Waktu & Kategori</h3>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Mulai *</label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={e => setData('tanggal_mulai', e.target.value)}
                                        className={cn(errors.tanggal_mulai && "border-red-500 focus:ring-red-500")}
                                    />
                                    {errors.tanggal_mulai && <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={e => setData('tanggal_selesai', e.target.value)}
                                        className={cn(errors.tanggal_selesai && "border-red-500 focus:ring-red-500")}
                                    />
                                    <p className="text-xs text-neutral-500">Kosongkan jika agenda hanya 1 hari.</p>
                                    {errors.tanggal_selesai && <p className="text-sm text-red-500">{errors.tanggal_selesai}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Tipe / Kategori *</label>
                                    <select
                                        className={cn(
                                            "w-full border border-neutral-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3",
                                            errors.tipe && "border-red-500 focus:ring-red-500"
                                        )}
                                        value={data.tipe}
                                        onChange={e => setData('tipe', e.target.value)}
                                    >
                                        <option value="kegiatan">Kegiatan Akademik (Biru)</option>
                                        <option value="libur">Libur / Cuti (Merah)</option>
                                        <option value="ujian">Ujian / Tes (Oranye)</option>
                                        <option value="penerimaan">Penerimaan / PPDB (Hijau)</option>
                                    </select>
                                    {errors.tipe && <p className="text-sm text-red-500">{errors.tipe}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Warna Aksen *</label>

                                    <div className="flex gap-2">
                                        {presetColors.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={cn(
                                                    "w-8 h-8 rounded-full border-2 transition-all",
                                                    data.warna === color ? "border-neutral-900 scale-110" : "border-transparent hover:scale-105"
                                                )}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setData('warna', color)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={data.warna}
                                            onChange={e => setData('warna', e.target.value)}
                                            className="w-10 h-10 p-1 border border-neutral-200 rounded cursor-pointer"
                                        />
                                        <Input
                                            value={data.warna}
                                            onChange={e => setData('warna', e.target.value)}
                                            placeholder="#003f87"
                                            className="font-mono text-sm max-w-[120px]"
                                            maxLength={7}
                                        />
                                    </div>
                                    {errors.warna && <p className="text-sm text-red-500">{errors.warna}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                            <h3 className="font-semibold text-gray-900 pb-4 border-b mb-4">Publikasi</h3>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Status Aktif</h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tampilkan agenda di website publik
                                    </p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={checked => setData('is_active', checked)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isEdit ? 'Simpan Perubahan' : 'Publish Agenda'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
