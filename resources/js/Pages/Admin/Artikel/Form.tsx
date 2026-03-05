import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { Select } from '@/Components/UI/Select';
import { Button } from '@/Components/UI/Button';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { Save, Send, Image as ImageIcon, ArrowLeft, Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
    article: any;
    categories: Array<{ id: number; name: string; color: string }>;
}

export default function Form({ article, categories }: Props) {
    const isEdit = !!article;
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

    const { data, setData, post, put, processing, errors } = useForm({
        _method: isEdit ? 'put' : 'post',
        category_id: article?.category_id || '',
        status: article?.status || 'draft',
        published_at: article?.published_at ? article.published_at.slice(0, 16) : '', // formatted for datetime-local
        meta_title: article?.meta_title || '',
        meta_description: article?.meta_description || '',
        thumbnail: null as File | null,

        // Translation ID
        title_id: article?.title_id || '',
        excerpt_id: article?.excerpt_id || '',
        content_id: article?.content_id || '',

        // Translation EN
        title_en: article?.title_en || '',
        excerpt_en: article?.excerpt_en || '',
        content_en: article?.content_en || '',
    });

    const handleSubmit = (statusToSave?: string) => {
        // If statusToSave is provided, use it (e.g. for "Simpan Draft" or "Publish")
        if (statusToSave) {
            setData('status', statusToSave);
        }

        const url = isEdit
            ? route('admin.artikel.update', article.id)
            : route('admin.artikel.store');

        post(url, {
            preserveScroll: true,
            onError: (err) => {
                if(Object.keys(err).length > 0) {
                    toast.error('Mohon periksa kembali form yang Anda isikan.');
                }
            }
        });
    };

    return (
        <AdminLayout
            title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            breadcrumbs={[
                { label: 'Artikel', url: route('admin.artikel.index') },
                { label: isEdit ? 'Edit' : 'Baru' }
            ]}
        >
            <Head title={isEdit ? 'Edit Artikel' : 'Tulis Artikel'} />

            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.artikel.index')}>
                        <Button variant="ghost" className="px-2">
                            <ArrowLeft className="w-5 h-5 text-neutral-500" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">
                            {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit('draft')}
                        disabled={processing}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Draft
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleSubmit(data.status === 'draft' ? 'published' : data.status)}
                        disabled={processing}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {data.status === 'published' ? 'Simpan' : 'Publish'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area (65%) */}
                <div className="w-full lg:w-[65%] flex flex-col gap-6">
                    {/* Language Tab Switcher */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-1 flex w-max">
                        <button
                            type="button"
                            onClick={() => setActiveTab('id')}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'id'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                            }`}
                        >
                            Indonesia (ID)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('en')}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'en'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                            }`}
                        >
                            English (EN)
                        </button>
                    </div>

                    {/* Editor Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        {/* AI Toolbar Placeholder */}
                        <div className="bg-neutral-50 border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-neutral-400">
                                <Bot className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">AI Assistant Coming Soon</span>
                            </div>
                            <Button variant="ghost" size="sm" disabled className="h-8 text-neutral-400">
                                Terjemahkan
                            </Button>
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            {activeTab === 'id' ? (
                                <>
                                    <Input
                                        label="Judul Artikel (ID)"
                                        placeholder="Masukkan judul artikel..."
                                        value={data.title_id}
                                        onChange={(e) => setData('title_id', e.target.value)}
                                        error={errors.title_id}
                                        className="text-lg font-medium"
                                        required
                                    />
                                    <Textarea
                                        label="Ringkasan / Excerpt (ID)"
                                        placeholder="Ringkasan singkat artikel..."
                                        rows={3}
                                        value={data.excerpt_id}
                                        onChange={(e) => setData('excerpt_id', e.target.value)}
                                        error={errors.excerpt_id}
                                    />
                                    <Textarea
                                        label="Isi Konten (ID)"
                                        placeholder="Tulis isi artikel di sini..."
                                        rows={15}
                                        value={data.content_id}
                                        onChange={(e) => setData('content_id', e.target.value)}
                                        error={errors.content_id}
                                        required
                                        className="font-mono text-sm" // Placeholder until Markdown/TipTap is added
                                    />
                                </>
                            ) : (
                                <>
                                    <Input
                                        label="Article Title (EN)"
                                        placeholder="Enter article title..."
                                        value={data.title_en}
                                        onChange={(e) => setData('title_en', e.target.value)}
                                        error={errors.title_en}
                                        className="text-lg font-medium"
                                    />
                                    <Textarea
                                        label="Excerpt (EN)"
                                        placeholder="Short summary of the article..."
                                        rows={3}
                                        value={data.excerpt_en}
                                        onChange={(e) => setData('excerpt_en', e.target.value)}
                                        error={errors.excerpt_en}
                                    />
                                    <Textarea
                                        label="Content (EN)"
                                        placeholder="Write article content here..."
                                        rows={15}
                                        value={data.content_en}
                                        onChange={(e) => setData('content_en', e.target.value)}
                                        error={errors.content_en}
                                        className="font-mono text-sm"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (35%) */}
                <div className="w-full lg:w-[35%] flex flex-col gap-6">
                    {/* Publikasi */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">Publikasi</h3>

                        <Select
                            label="Status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            options={[
                                { value: 'draft', label: 'Draft' },
                                { value: 'pending_review', label: 'Pending Review' },
                                { value: 'published', label: 'Published' },
                                { value: 'archived', label: 'Archived' },
                            ]}
                            error={errors.status}
                        />

                        <Input
                            type="datetime-local"
                            label="Tanggal Publikasi"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                            error={errors.published_at}
                        />
                    </div>

                    {/* Kategori */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <h3 className="text-lg font-semibold text-neutral-900">Kategori</h3>
                        </div>

                        <Select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            options={[
                                { value: '', label: 'Pilih Kategori...' },
                                ...categories.map(c => ({ value: c.id.toString(), label: c.name }))
                            ]}
                            error={errors.category_id}
                            required
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">Thumbnail</h3>

                        <ImageUpload
                            value={data.thumbnail}
                            onChange={(file) => setData('thumbnail', file)}
                            previewUrl={article?.thumbnail_url}
                            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={2}
                            error={errors.thumbnail}
                            helpText="Rasio 16:9 direkomendasikan. Maks 2MB."
                        />
                    </div>

                    {/* SEO */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">SEO</h3>

                        <Input
                            label="Meta Title"
                            placeholder="Judul SEO optimal max 60 karakter"
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            error={errors.meta_title}
                        />

                        <Textarea
                            label="Meta Description"
                            placeholder="Deskripsi SEO optimal max 160 karakter"
                            rows={3}
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            error={errors.meta_description}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
