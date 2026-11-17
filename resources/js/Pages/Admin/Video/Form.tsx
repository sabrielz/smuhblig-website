import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ArrowLeft, Save, Youtube, Play, CheckCircle2 } from 'lucide-react';
import { extractYoutubeId, getYoutubeThumbnailUrl } from '@/lib/youtube';
import toast from 'react-hot-toast';
import type { VideoItem } from '@/types';

interface GaleriOption {
    id: number;
    title: string;
}

interface Props {
    video: VideoItem | null;
    galeris: GaleriOption[];
}

export default function Form({ video, galeris }: Props) {
    const isEdit = !!video;

    const { data, setData, post, put, processing, errors } = useForm({
        youtube_id: video?.youtube_id || '',
        galeri_id: video?.galeri_id ? String(video.galeri_id) : '',
        urutan: video?.urutan ?? 1,
        is_active: video?.is_active ?? true,
        translations: {
            id: {
                judul: video?.translations?.id?.judul || '',
            },
            en: {
                judul: video?.translations?.en?.judul || '',
            },
        },
    });

    const extractedId = extractYoutubeId(data.youtube_id);

    const galeriOptions = [
        { value: '', label: 'Tanpa Album (Video Lepas)' },
        ...galeris.map((g) => ({
            value: String(g.id),
            label: g.title,
        })),
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!extractedId) {
            toast.error('Masukkan URL atau ID YouTube yang valid (11 karakter).');
            return;
        }

        if (isEdit) {
            put(route('admin.video.update', { video: video.id }), {
                preserveScroll: true,
                onSuccess: () => toast.success('Video berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui video. Periksa kembali form.'),
            });
        } else {
            post(route('admin.video.store'), {
                preserveScroll: true,
                onSuccess: () => toast.success('Video berhasil ditambahkan.'),
                onError: () => toast.error('Gagal menambahkan video. Periksa kembali form.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Video YouTube' : 'Tambah Video YouTube'}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.video.index')}>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                                {isEdit ? 'Edit Video YouTube' : 'Tambah Video YouTube'}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {isEdit
                                    ? 'Perbarui judul, album, atau ID video YouTube.'
                                    : 'Tambahkan tautan video YouTube resmi sekolah ke galeri.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Video */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Informasi Video YouTube
                        </h2>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                URL Video atau ID YouTube <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Youtube className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
                                <Input
                                    placeholder="Contoh: https://www.youtube.com/watch?v=... atau ID 11 karakter"
                                    value={data.youtube_id}
                                    onChange={(e) => setData('youtube_id', e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            {errors.youtube_id && (
                                <p className="text-xs text-red-500 mt-1">{errors.youtube_id}</p>
                            )}
                            <p className="text-[11px] text-neutral-400 mt-1">
                                Mendukung format URL standar, youtu.be, shorts, embed, atau ID video 11 karakter.
                            </p>
                        </div>

                        {/* Live Preview Thumbnail */}
                        {extractedId && (
                            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative w-44 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0 shadow-xs">
                                    <img
                                        src={getYoutubeThumbnailUrl(extractedId)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                                            <Play className="w-4 h-4 ml-0.5 fill-current" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>ID Video Terdeteksi: <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">{extractedId}</code></span>
                                    </div>
                                    <p className="text-neutral-500 text-[11px]">
                                        Thumbnail otomatis diambil dari server YouTube sesuai ADR-006 opsi (a).
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Kaitkan ke Album Galeri (Opsional)
                                </label>
                                <Select
                                    options={galeriOptions}
                                    value={data.galeri_id}
                                    onChange={(e) => setData('galeri_id', e.target.value)}
                                />
                                {errors.galeri_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.galeri_id}</p>
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
                                    Tampilkan video ini di galeri publik
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Judul Bahasa Indonesia */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-700">
                                ID
                            </span>
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Judul Video Bahasa Indonesia (Utama)
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Judul Video <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Contoh: Dokumentasi Pelepasan Wisudawan Angkatan 2026"
                                value={data.translations.id.judul}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        id: { judul: e.target.value },
                                    })
                                }
                            />
                            {errors['translations.id.judul'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.id.judul']}</p>
                            )}
                        </div>
                    </div>

                    {/* Judul Bahasa Inggris */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                                EN
                            </span>
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Judul Video Bahasa Inggris (Opsional)
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Video Title (English)
                            </label>
                            <Input
                                placeholder="e.g. Graduation Ceremony Documentation Batch 2026"
                                value={data.translations.en.judul}
                                onChange={(e) =>
                                    setData('translations', {
                                        ...data.translations,
                                        en: { judul: e.target.value },
                                    })
                                }
                            />
                            {errors['translations.en.judul'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['translations.en.judul']}</p>
                            )}
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={route('admin.video.index')}>
                            <Button variant="outline" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Video'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
