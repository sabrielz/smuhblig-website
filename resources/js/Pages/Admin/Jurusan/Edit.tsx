import { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import {
    ArrowLeft, Save, Plus, Trash2, Image as ImageIcon,
    Award, Star, CheckCircle, Users, BookOpen, Briefcase, Zap, Shield,
    TrendingUp, Globe, Cpu, Heart, Clock, Medal, Target, Lightbulb,
    Building2, GraduationCap, Wrench, FlaskConical, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICONS = {
    Award, Star, CheckCircle, Users, BookOpen, Briefcase, Zap, Shield,
    TrendingUp, Globe, Cpu, Heart, Clock, Medal, Target, Lightbulb,
    Building2, GraduationCap, Wrench, FlaskConical
};

type IconName = keyof typeof ICONS;

function IconSelect({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const SelectedIcon = value && ICONS[value as IconName] ? ICONS[value as IconName] : null;

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-gray-300 bg-white px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy"
            >
                <div className="flex items-center gap-2">
                    {SelectedIcon ? <SelectedIcon className="w-5 h-5 text-gray-600" /> : <span className="text-gray-400">Pilih Icon</span>}
                    <span>{value || 'Tidak ada'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 grid grid-cols-5 gap-2">
                        {Object.entries(ICONS).map(([name, IconComp]) => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => { onChange(name); setIsOpen(false); }}
                                className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 ${value === name ? 'bg-primary-navy/10 text-primary-navy' : 'text-gray-700'}`}
                                title={name}
                            >
                                <IconComp className="w-6 h-6 mb-1" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DynamicList({ label, items, onChange, locale }: { label: string, items: string[], onChange: (items: string[]) => void, locale: string }) {
    const handleAdd = () => onChange([...items, '']);
    const handleRemove = (index: number) => onChange(items.filter((_, i) => i !== index));
    const handleChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label} ({locale.toUpperCase()})</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-1" /> Tambah
                </Button>
            </div>
            {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <Input value={item} onChange={(e) => handleChange(index, e.target.value)} placeholder={`Item...`} className="flex-1" />
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemove(index)} className="shrink-0 flex items-center justify-center px-2 py-2">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            {items.length === 0 && <p className="text-sm text-gray-500 text-center py-2 border border-dashed rounded-md">Tidak ada data</p>}
        </div>
    );
}

export default function Edit({ jurusan }: { jurusan: any }) {
    const [mainTab, setMainTab] = useState<'konten' | 'visual'>('konten');
    const [activeLocale, setActiveLocale] = useState<'id' | 'en'>('id');
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        is_active: jurusan.is_active ?? true,
        color_start: jurusan.color_start || '#003f87',
        color_end: jurusan.color_end || '#001f4d',
        icon_name: jurusan.icon_name || '',
        akreditasi: jurusan.akreditasi || '',
        total_siswa: jurusan.total_siswa || 0,
        lama_pendidikan: jurusan.lama_pendidikan || '3 Tahun',
        highlight_1_icon: jurusan.highlight_1_icon || '',
        highlight_2_icon: jurusan.highlight_2_icon || '',
        highlight_3_icon: jurusan.highlight_3_icon || '',
        cover: null as File | null,
        gallery: [] as File[],
        deleted_gallery_ids: [] as number[],
        id: {
            nama: jurusan.id_data?.nama || '',
            tagline: jurusan.id_data?.tagline || '',
            deskripsi_singkat: jurusan.id_data?.deskripsi_singkat || '',
            deskripsi_lengkap: jurusan.id_data?.deskripsi_lengkap || '',
            konten_hero: jurusan.id_data?.konten_hero || '',
            kompetensi: jurusan.id_data?.kompetensi || [],
            prospek_karir: jurusan.id_data?.prospek_karir || [],
            fasilitas: jurusan.id_data?.fasilitas || [],
            highlight_1_label: jurusan.id_data?.highlight_1_label || '',
            highlight_2_label: jurusan.id_data?.highlight_2_label || '',
            highlight_3_label: jurusan.id_data?.highlight_3_label || '',
        },
        en: {
            nama: jurusan.en_data?.nama || '',
            tagline: jurusan.en_data?.tagline || '',
            deskripsi_singkat: jurusan.en_data?.deskripsi_singkat || '',
            deskripsi_lengkap: jurusan.en_data?.deskripsi_lengkap || '',
            konten_hero: jurusan.en_data?.konten_hero || '',
            kompetensi: jurusan.en_data?.kompetensi || [],
            prospek_karir: jurusan.en_data?.prospek_karir || [],
            fasilitas: jurusan.en_data?.fasilitas || [],
            highlight_1_en: jurusan.en_data?.highlight_1_en || '',
            highlight_2_en: jurusan.en_data?.highlight_2_en || '',
            highlight_3_en: jurusan.en_data?.highlight_3_en || '',
        }
    });

    const [existingGallery, setExistingGallery] = useState<{id: number, url: string}[]>(jurusan.gallery || []);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<{file: File, url: string}[]>([]);

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const totalImages = existingGallery.length + data.gallery.length + filesArray.length;
            if (totalImages > 8) {
                toast.error('Maksimal 8 foto galeri!');
                return;
            }

            const newPreviews = filesArray.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));

            setNewGalleryPreviews(prev => [...prev, ...newPreviews]);
            setData('gallery', [...data.gallery, ...filesArray]);
        }
    };

    const removeExistingGallery = (id: number) => {
        setExistingGallery(prev => prev.filter(img => img.id !== id));
        setData('deleted_gallery_ids', [...data.deleted_gallery_ids, id]);
    };

    const removeNewGallery = (index: number) => {
        const target = newGalleryPreviews[index];
        URL.revokeObjectURL(target.url);

        const updatedPreviews = [...newGalleryPreviews];
        updatedPreviews.splice(index, 1);
        setNewGalleryPreviews(updatedPreviews);

        const updatedFiles = [...data.gallery];
        updatedFiles.splice(index, 1);
        setData('gallery', updatedFiles);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.jurusan.update', jurusan.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Jurusan berhasil diperbarui!'),
            onError: (err) => {
                toast.error('Harap periksa form kembali.');
                console.error(err);
            },
        });
    };

    const MainIcon = data.icon_name && ICONS[data.icon_name as IconName] ? ICONS[data.icon_name as IconName] : BookOpen;

    return (
        <AdminLayout title={`Edit Jurusan ${jurusan.kode}`}>
            <Head title={`Edit Jurusan ${jurusan.kode}`} />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.jurusan.index')}>
                        <Button variant="outline" size="sm" className="px-3 text-neutral-600">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Jurusan {jurusan.kode}</h1>
                        <p className="text-gray-500 text-sm mt-1">Perbarui konten dan informasi program keahlian.</p>
                    </div>
                </div>
                <Button onClick={submit} disabled={processing} className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                {/* Kolom Kiri */}
                <div className="w-full md:w-[70%] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0">
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        <button
                            type="button"
                            onClick={() => setMainTab('konten')}
                            className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'konten' ? 'border-primary-navy text-primary-navy bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                        >
                            Konten
                        </button>
                        <button
                            type="button"
                            onClick={() => setMainTab('visual')}
                            className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'visual' ? 'border-primary-navy text-primary-navy bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                        >
                            Pengaturan Visual
                        </button>
                    </div>

                    <div className="p-6">
                        {mainTab === 'konten' ? (
                            <div className="space-y-6">
                                <div className="flex border-b border-gray-100 space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveLocale('id')}
                                        className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeLocale === 'id' ? 'border-primary-navy text-primary-navy' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        ID (Indonesia)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveLocale('en')}
                                        className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeLocale === 'en' ? 'border-primary-navy text-primary-navy' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        EN (English)
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <Input
                                        label={`Nama Jurusan (${activeLocale.toUpperCase()})`}
                                        value={data[activeLocale].nama}
                                        onChange={(e) => setData(activeLocale, { ...data[activeLocale], nama: e.target.value })}
                                        error={errors[`${activeLocale}.nama` as keyof typeof errors]}
                                    />

                                    <Input
                                        label={`Tagline (${activeLocale.toUpperCase()})`}
                                        value={data[activeLocale].tagline}
                                        onChange={(e) => setData(activeLocale, { ...data[activeLocale], tagline: e.target.value })}
                                        error={errors[`${activeLocale}.tagline` as keyof typeof errors]}
                                    />

                                    <Textarea
                                        label={`Deskripsi Singkat (${activeLocale.toUpperCase()})`}
                                        value={data[activeLocale].deskripsi_singkat}
                                        onChange={(e) => setData(activeLocale, { ...data[activeLocale], deskripsi_singkat: e.target.value })}
                                        error={errors[`${activeLocale}.deskripsi_singkat` as keyof typeof errors]}
                                        rows={3}
                                    />

                                    <Textarea
                                        label={`Konten Hero (${activeLocale.toUpperCase()})`}
                                        value={data[activeLocale].konten_hero}
                                        onChange={(e) => setData(activeLocale, { ...data[activeLocale], konten_hero: e.target.value })}
                                        error={errors[`${activeLocale}.konten_hero` as keyof typeof errors]}
                                        rows={3}
                                        placeholder="Paragraf pendek untuk section pahlawan..."
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Lengkap ({activeLocale.toUpperCase()})</label>
                                        <TipTapEditor
                                            value={data[activeLocale].deskripsi_lengkap}
                                            onChange={(val) => setData(activeLocale, { ...data[activeLocale], deskripsi_lengkap: val })}
                                            error={errors[`${activeLocale}.deskripsi_lengkap` as keyof typeof errors]}
                                        />
                                    </div>

                                    <hr className="border-gray-100 my-6" />

                                    <h3 className="font-semibold text-gray-900 mb-4">3 Highlight Unggulan</h3>

                                    <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {/* Highlight 1 */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-1/3">
                                                <IconSelect label="Icon 1" value={data.highlight_1_icon} onChange={(val) => setData('highlight_1_icon', val)} />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    label={`Label 1 (${activeLocale.toUpperCase()})`}
                                                    value={activeLocale === 'id' ? data.id.highlight_1_label : data.en.highlight_1_en}
                                                    onChange={(e) => activeLocale === 'id' ? setData('id', {...data.id, highlight_1_label: e.target.value}) : setData('en', {...data.en, highlight_1_en: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        {/* Highlight 2 */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-1/3">
                                                <IconSelect label="Icon 2" value={data.highlight_2_icon} onChange={(val) => setData('highlight_2_icon', val)} />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    label={`Label 2 (${activeLocale.toUpperCase()})`}
                                                    value={activeLocale === 'id' ? data.id.highlight_2_label : data.en.highlight_2_en}
                                                    onChange={(e) => activeLocale === 'id' ? setData('id', {...data.id, highlight_2_label: e.target.value}) : setData('en', {...data.en, highlight_2_en: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        {/* Highlight 3 */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-1/3">
                                                <IconSelect label="Icon 3" value={data.highlight_3_icon} onChange={(val) => setData('highlight_3_icon', val)} />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    label={`Label 3 (${activeLocale.toUpperCase()})`}
                                                    value={activeLocale === 'id' ? data.id.highlight_3_label : data.en.highlight_3_en}
                                                    onChange={(e) => activeLocale === 'id' ? setData('id', {...data.id, highlight_3_label: e.target.value}) : setData('en', {...data.en, highlight_3_en: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 my-6" />

                                    <DynamicList
                                        label="Kompetensi Keahlian"
                                        locale={activeLocale}
                                        items={data[activeLocale].kompetensi}
                                        onChange={(items) => setData(activeLocale, { ...data[activeLocale], kompetensi: items })}
                                    />
                                    <DynamicList
                                        label="Prospek Karir"
                                        locale={activeLocale}
                                        items={data[activeLocale].prospek_karir}
                                        onChange={(items) => setData(activeLocale, { ...data[activeLocale], prospek_karir: items })}
                                    />
                                    <DynamicList
                                        label="Fasilitas Unggulan"
                                        locale={activeLocale}
                                        items={data[activeLocale].fasilitas}
                                        onChange={(items) => setData(activeLocale, { ...data[activeLocale], fasilitas: items })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Akreditasi</label>
                                        <select
                                            value={data.akreditasi}
                                            onChange={(e) => setData('akreditasi', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-navy focus:ring-primary-navy"
                                        >
                                            <option value="">Pilih Akreditasi</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                                        </select>
                                    </div>
                                    <Input
                                        type="number"
                                        label="Total Siswa"
                                        value={data.total_siswa.toString()}
                                        onChange={(e) => setData('total_siswa', parseInt(e.target.value) || 0)}
                                    />
                                    <Input
                                        label="Lama Pendidikan"
                                        value={data.lama_pendidikan}
                                        onChange={(e) => setData('lama_pendidikan', e.target.value)}
                                    />
                                    <IconSelect
                                        label="Icon Utama Jurusan"
                                        value={data.icon_name}
                                        onChange={(val) => setData('icon_name', val)}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Warna Mulai (Start)</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={data.color_start} onChange={(e) => setData('color_start', e.target.value)} className="w-10 h-10 p-0 border-0 rounded" />
                                            <Input value={data.color_start} onChange={(e) => setData('color_start', e.target.value)} className="flex-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Warna Akhir (End)</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={data.color_end} onChange={(e) => setData('color_end', e.target.value)} className="w-10 h-10 p-0 border-0 rounded" />
                                            <Input value={data.color_end} onChange={(e) => setData('color_end', e.target.value)} className="flex-1" />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-100 my-6" />

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Cover Image</h3>
                                    <ImageUpload
                                        maxSizeMB={2}
                                        value={jurusan.cover_url || ''}
                                        onChange={(file: File) => setData('cover', file)}
                                    />
                                </div>

                                <hr className="border-gray-100 my-6" />

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">Galeri Foto (Max 8)</h3>
                                        <Button type="button" variant="outline" size="sm" onClick={() => galleryInputRef.current?.click()}>
                                            <Plus className="w-4 h-4 mr-1" /> Tambah Foto
                                        </Button>
                                        <input
                                            type="file"
                                            ref={galleryInputRef}
                                            multiple
                                            accept="image/*"
                                            onChange={handleGalleryChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {/* Existing Gallery Images */}
                                        {existingGallery.map(img => (
                                            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-gray-100 border border-gray-200">
                                                <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeExistingGallery(img.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* New Uploading Previews */}
                                        {newGalleryPreviews.map((item, idx) => (
                                            <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-gray-100 border border-gray-200">
                                                <img src={item.url} alt="New Gallery Preview" className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Baru</div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeNewGallery(idx)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {existingGallery.length === 0 && newGalleryPreviews.length === 0 && (
                                            <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                                                <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-gray-500 text-sm">Belum ada foto galeri.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kolom Kanan / Sidebar */}
                <div className="w-full md:w-[30%] space-y-6 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Preview Kartu Jurusan</h3>
                        <div className="rounded-xl border border-gray-100 overflow-hidden relative group">
                            <div
                                className="h-32 w-full relative"
                                style={{ background: `linear-gradient(to right, ${data.color_start}, ${data.color_end})` }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay">
                                    <MainIcon className="w-20 h-20 text-white" />
                                </div>
                            </div>
                            <div className="p-5 bg-white relative">
                                <div className="absolute -top-7 right-5 w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary-navy">
                                    <MainIcon className="w-7 h-7" />
                                </div>
                                <div className="text-[10px] font-mono tracking-widest text-primary-navy font-bold uppercase mb-1">
                                    {jurusan.kode}
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg leading-tight">
                                    {data.id.nama || 'Nama Jurusan'}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-2">Status & Info</h3>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">Status Aktif</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-navy/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-navy"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Slug URL (Otomatis)</label>
                            <Input value={jurusan.slug} disabled className="bg-gray-50 text-gray-500 text-sm" />
                        </div>
                    </div>

                    <Button onClick={submit} disabled={processing} className="w-full py-6 text-base font-semibold shadow-lg shadow-primary-navy/20">
                        <Save className="w-5 h-5 mr-2" />
                        Simpan Perubahan
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
