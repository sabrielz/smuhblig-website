import React, { useState, useCallback, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { Select } from '@/Components/UI/Select';
import { Button } from '@/Components/UI/Button';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import { AiToolbar } from '@/Components/Editor/AiToolbar';
import { AiBubble } from '@/Components/Editor/AiBubble';
import { AiPanel } from '@/Components/Editor/AiPanel';
import { SeoPanel } from '@/Components/Editor/SeoPanel';
import { AiStatusBadge } from '@/Components/Editor/AiStatusBadge';
import { Save, Send, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAiJob } from '@/hooks/useAiJob';
import type { Editor } from '@tiptap/react';
import type { GenerateDraftParams } from '@/Components/Editor/AiToolbar';
import type { AiPanelMode } from '@/Components/Editor/AiPanel';
import type { SeoAnalysisResult } from '@/Components/Editor/SeoPanel';
import type { TranslationStatus } from '@/Components/Editor/AiStatusBadge';

/* ─────────────────────────────────────────────
   CSRF helper
   ───────────────────────────────────────────── */
function getCsrf(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''
    );
}

async function aiPost(path: string, body: Record<string, unknown>): Promise<{ job_id: string }> {
    const res = await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': getCsrf(),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? 'Request gagal');
    }
    return res.json() as Promise<{ job_id: string }>;
}

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface ArticleData {
    id: number;
    category_id: string | number;
    status: string;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    thumbnail_url: string | null;
    // Translations
    title_id: string;
    excerpt_id: string | null;
    content_id: string;
    title_en: string | null;
    excerpt_en: string | null;
    content_en: string | null;
    // Translation status
    en_ai_translated?: boolean;
    en_reviewed?: boolean;
}

interface Props {
    article: ArticleData | null;
    categories: Array<{ id: number; name: string; color: string }>;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
export default function Form({ article, categories }: Props) {
    const isEdit = !!article;
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

    /* ── Form data ── */
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'put' : 'post',
        category_id: article?.category_id?.toString() ?? '',
        status: article?.status ?? 'draft',
        published_at: article?.published_at ? article.published_at.slice(0, 16) : '',
        meta_title: article?.meta_title ?? '',
        meta_description: article?.meta_description ?? '',
        thumbnail: null as File | null,
        // Translation ID
        title_id:   article?.title_id ?? '',
        excerpt_id: article?.excerpt_id ?? '',
        content_id: article?.content_id ?? '',
        // Translation EN
        title_en:   article?.title_en ?? '',
        excerpt_en: article?.excerpt_en ?? '',
        content_en: article?.content_en ?? '',
    });

    /* ── EN translation status ── */
    const [enTranslationStatus, setEnTranslationStatus] = useState<TranslationStatus>(
        article?.en_reviewed
            ? 'reviewed'
            : article?.en_ai_translated
              ? 'ai_translated'
              : null,
    );
    const [isMarkingReviewed, setIsMarkingReviewed] = useState(false);

    /* ── TipTap editor ref (for AiBubble) ── */
    const [editorId, setEditorId] = useState<Editor | null>(null);

    /* ── AI Job IDs ── */
    const [generateJobId, setGenerateJobId] = useState<string | null>(null);
    const [correctJobId, setCorrectJobId]   = useState<string | null>(null);
    const [translateJobId, setTranslateJobId] = useState<string | null>(null);
    const [seoJobId, setSeoJobId]           = useState<string | null>(null);

    /* ── Revision state (for AiBubble) ── */
    const [revisionJobId, setRevisionJobId] = useState<string | null>(null);
    const [pendingRevisionOriginal, setPendingRevisionOriginal] = useState('');

    /* ── AiPanel state ── */
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<AiPanelMode>('generate');
    const [panelSummary, setPanelSummary] = useState<string | undefined>(undefined);

    /* ── SEO analysis result ── */
    const [seoResult, setSeoResult] = useState<SeoAnalysisResult | null>(null);
    const [seoOpen, setSeoOpen] = useState(false);

    /* ── Polling hooks ── */
    const generateJob = useAiJob(generateJobId);
    const correctJob  = useAiJob(correctJobId);
    const translateJob = useAiJob(translateJobId);
    const seoJob      = useAiJob(seoJobId);
    const revisionJob = useAiJob(revisionJobId);

    /* Handle SEO job done */
    const prevSeoStatus = useRef<string | null>(null);
    if (seoJob.status === 'done' && seoJob.result && prevSeoStatus.current !== 'done') {
        prevSeoStatus.current = 'done';
        try {
            const parsed = JSON.parse(seoJob.result) as SeoAnalysisResult;
            setSeoResult(parsed);
        } catch {
            toast.error('Gagal parse hasil analisis SEO.');
        }
    }

    /* Handle generate job done → open panel */
    const prevGenStatus = useRef<string | null>(null);
    if (generateJob.status === 'done' && generateJob.result && prevGenStatus.current !== 'done') {
        prevGenStatus.current = 'done';
        setPanelOpen(true);
    }
    if (generateJob.status === 'failed' && prevGenStatus.current !== 'failed') {
        prevGenStatus.current = 'failed';
        toast.error(generateJob.error ?? 'Generate draft gagal.');
    }

    /* Handle correct job done → open panel */
    const prevCorrectStatus = useRef<string | null>(null);
    if (correctJob.status === 'done' && correctJob.result && prevCorrectStatus.current !== 'done') {
        prevCorrectStatus.current = 'done';
        const words = correctJob.result.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
        setPanelSummary(`Artikel telah diproses (${words} kata)`);
        setPanelOpen(true);
    }
    if (correctJob.status === 'failed' && prevCorrectStatus.current !== 'failed') {
        prevCorrectStatus.current = 'failed';
        toast.error(correctJob.error ?? 'Koreksi grammar gagal.');
    }

    /* Handle translate job done */
    const prevTranslateStatus = useRef<string | null>(null);
    if (translateJob.status === 'done' && translateJob.result && prevTranslateStatus.current !== 'done') {
        prevTranslateStatus.current = 'done';
        try {
            const parsed = JSON.parse(translateJob.result) as {
                title: string;
                excerpt: string;
                content: string;
            };
            setData((prev) => ({
                ...prev,
                title_en: parsed.title ?? prev.title_en,
                excerpt_en: parsed.excerpt ?? prev.excerpt_en,
                content_en: parsed.content ?? prev.content_en,
            }));
            setEnTranslationStatus('ai_translated');
            toast.success('Terjemahan AI selesai! Silakan review konten EN.');
        } catch {
            toast.error('Gagal parse hasil terjemahan.');
        }
    }
    if (translateJob.status === 'failed' && prevTranslateStatus.current !== 'failed') {
        prevTranslateStatus.current = 'failed';
        toast.error(translateJob.error ?? 'Terjemahan gagal.');
    }

    /* ─── Any AI loading? ─── */
    const isAnyLoading =
        generateJob.isPolling ||
        correctJob.isPolling  ||
        translateJob.isPolling ||
        seoJob.isPolling;

    /* ─── Editor empty check ─── */
    const editorEmpty = (
        activeTab === 'id'
            ? data.content_id.replace(/<[^>]*>/g, '').trim()
            : data.content_en?.replace(/<[^>]*>/g, '').trim() ?? ''
    ).length < 100;

    /* ─── Handlers ─── */

    const handleGenerate = useCallback(async (params: GenerateDraftParams) => {
        prevGenStatus.current = null;
        setPanelMode('generate');
        setPanelSummary(undefined);
        setPanelOpen(false);
        try {
            const { job_id } = await aiPost('/admin/ai/generate', {
                topic: params.topic,
                points: params.points,
                tone: params.tone,
                locale: params.locale,
            });
            setGenerateJobId(job_id);
            setPanelOpen(true);
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai generate draft.');
        }
    }, []);

    const handleCorrect = useCallback(async () => {
        prevCorrectStatus.current = null;
        const content = activeTab === 'id' ? data.content_id : (data.content_en ?? '');
        if (!content.replace(/<[^>]*>/g, '').trim()) {
            toast.error('Tidak ada konten untuk dikoreksi.');
            return;
        }
        setPanelMode('correct');
        setPanelSummary(undefined);
        setPanelOpen(false);
        try {
            const { job_id } = await aiPost('/admin/ai/correct', { content });
            setCorrectJobId(job_id);
            setPanelOpen(true);
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai koreksi grammar.');
        }
    }, [activeTab, data.content_id, data.content_en]);

    const handleOpenSeo = useCallback(() => {
        setSeoOpen(true);
        // Scroll to SEO panel in sidebar
        document.getElementById('seo-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleSeoAnalyze = useCallback(async () => {
        prevSeoStatus.current = null;
        setSeoResult(null);
        const plainText = data.content_id.replace(/<[^>]+>/g, ' ').trim();
        try {
            const { job_id } = await aiPost('/admin/ai/seo', {
                title: data.title_id,
                content: plainText,
                meta_description: data.meta_description,
            });
            setSeoJobId(job_id);
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai analisis SEO.');
        }
    }, [data.content_id, data.title_id, data.meta_description]);

    const handleTranslate = useCallback(async () => {
        prevTranslateStatus.current = null;
        if (!data.title_id || !data.content_id.replace(/<[^>]*>/g, '').trim()) {
            toast.error('Isi konten Indonesia terlebih dahulu sebelum menerjemahkan.');
            return;
        }
        try {
            const { job_id } = await aiPost('/admin/ai/translate', {
                title_id: data.title_id,
                content_id: data.content_id,
                excerpt_id: data.excerpt_id,
            });
            setTranslateJobId(job_id);
            toast('✦ Terjemahan AI dimulai...', { icon: '🌐' });
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai terjemahan.');
        }
    }, [data.title_id, data.content_id, data.excerpt_id]);

    const handleRevise = useCallback(async (text: string, instruction: string): Promise<string | null> => {
        setPendingRevisionOriginal(text);
        setRevisionJobId(null);
        try {
            const { job_id } = await aiPost('/admin/ai/revise', { text, instruction });
            setRevisionJobId(job_id);
            return job_id;
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai revisi teks.');
            return null;
        }
    }, []);

    const handleApplyRevision = useCallback((originalText: string, newText: string) => {
        if (!editorId) return;
        const { from, to } = editorId.state.selection;
        editorId.chain().focus().deleteRange({ from, to }).insertContent(newText).run();
        setRevisionJobId(null);
        setPendingRevisionOriginal('');
        toast.success('Revisi diterapkan.');
    }, [editorId]);

    const handleDiscardRevision = useCallback(() => {
        setRevisionJobId(null);
        setPendingRevisionOriginal('');
    }, []);

    /* ─── Accept AI Panel result ─── */
    const handlePanelAccept = useCallback((result: string) => {
        if (panelMode === 'generate') {
            setData((prev) => ({
                ...prev,
                [activeTab === 'id' ? 'content_id' : 'content_en']: result,
            }));
            prevGenStatus.current = null;
            setGenerateJobId(null);
        } else if (panelMode === 'correct') {
            setData((prev) => ({
                ...prev,
                [activeTab === 'id' ? 'content_id' : 'content_en']: result,
            }));
            prevCorrectStatus.current = null;
            setCorrectJobId(null);
        }
        setPanelOpen(false);
        toast.success('Konten berhasil diperbarui.');
    }, [panelMode, activeTab, setData]);

    /* ─── Mark EN reviewed ─── */
    const handleMarkReviewed = useCallback(() => {
        if (!article?.id) return;
        setIsMarkingReviewed(true);
        router.patch(
            route('admin.artikel.translation.reviewed', { artikel: article.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEnTranslationStatus('reviewed');
                    toast.success('Terjemahan ditandai sudah direview.');
                },
                onError: () => toast.error('Gagal menandai review.'),
                onFinish: () => setIsMarkingReviewed(false),
            },
        );
    }, [article?.id]);

    /* ─── Form submit ─── */
    const handleSubmit = (statusToSave?: string) => {
        if (statusToSave) setData('status', statusToSave);
        const url = isEdit
            ? route('admin.artikel.update', { artikel: article!.id })
            : route('admin.artikel.store');
        post(url, {
            preserveScroll: true,
            forceFormData: true,
            onError: (err) => {
                if (Object.keys(err).length > 0) {
                    toast.error('Mohon periksa kembali form yang Anda isikan.');
                }
            },
        });
    };

    /* ─── Derive panel result & loading ─── */
    const activePanelJob = panelMode === 'generate' ? generateJob : correctJob;
    const panelResult = activePanelJob.result;
    const panelLoading = activePanelJob.isPolling;
    const panelError = activePanelJob.error;

    /* ─── Revision result ─── */
    const revisionResult = revisionJob.result;
    const isRevising = revisionJob.isPolling;

    /* ===================================================== */
    return (
        <AdminLayout title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}>
            <Head title={isEdit ? 'Edit Artikel' : 'Tulis Artikel'} />

            {/* ── AiPanel overlay ── */}
            <AiPanel
                open={panelOpen}
                mode={panelMode}
                isLoading={panelLoading}
                result={panelResult}
                error={panelError}
                summary={panelSummary}
                onAccept={handlePanelAccept}
                onClose={() => setPanelOpen(false)}
                onRetry={() => {
                    if (panelMode === 'correct') void handleCorrect();
                }}
            />

            {/* ── AiBubble (floating, portal-style via fixed positioning) ── */}
            <AiBubble
                editor={editorId}
                onRevise={handleRevise}
                revisionResult={revisionResult}
                isRevising={isRevising}
                onApply={handleApplyRevision}
                onDiscard={handleDiscardRevision}
            />

            {/* ── Page Header ── */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.artikel.index')}>
                        <Button variant="ghost" className="px-2">
                            <ArrowLeft className="w-5 h-5 text-neutral-500" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900">
                        {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                    </h1>
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
                        onClick={() =>
                            handleSubmit(data.status === 'draft' ? 'published' : data.status)
                        }
                        disabled={processing}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {data.status === 'published' ? 'Simpan' : 'Publish'}
                    </Button>
                </div>
            </div>

            {/* ── Two-column Layout ── */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* ══════════════════════════════════════
                    Main Content Area (65%)
                   ══════════════════════════════════════ */}
                <div className="w-full lg:w-[65%] flex flex-col gap-6">

                    {/* Language Tab Switcher */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-1 flex items-center gap-1 w-max">
                        <TabButton
                            active={activeTab === 'id'}
                            onClick={() => setActiveTab('id')}
                            label="Indonesia (ID)"
                        />
                        <div className="relative flex items-center gap-2">
                            <TabButton
                                active={activeTab === 'en'}
                                onClick={() => setActiveTab('en')}
                                label="English (EN)"
                            />
                            {/* Translation status badge next to EN tab */}
                            {enTranslationStatus && (
                                <div className="ml-1">
                                    <AiStatusBadge
                                        status={enTranslationStatus}
                                        onMarkReviewed={
                                            isEdit && enTranslationStatus === 'ai_translated'
                                                ? handleMarkReviewed
                                                : undefined
                                        }
                                        isMarkingReviewed={isMarkingReviewed}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editor Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">

                        {/* ── AI Toolbar (between tab bar and editor) ── */}
                        <AiToolbar
                            onGenerate={(p) => void handleGenerate(p)}
                            onCorrect={() => void handleCorrect()}
                            onOpenSeo={handleOpenSeo}
                            isLoading={isAnyLoading}
                            editorEmpty={editorEmpty}
                            locale={activeTab}
                        />

                        <div className="p-6 flex flex-col gap-6">

                            {/* ── ID Tab ── */}
                            {activeTab === 'id' && (
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
                                        placeholder="Ringkasan singkat artikel (tampil di listing berita)..."
                                        rows={3}
                                        value={data.excerpt_id}
                                        onChange={(e) => setData('excerpt_id', e.target.value)}
                                        error={errors.excerpt_id}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Isi Konten (ID) <span className="text-red-500">*</span>
                                        </label>
                                        <TipTapEditor
                                            value={data.content_id}
                                            onChange={(html) => setData('content_id', html)}
                                            placeholder="Mulai menulis artikel Anda di sini..."
                                            error={errors.content_id}
                                            onEditorReady={setEditorId}
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── EN Tab ── */}
                            {activeTab === 'en' && (
                                <>
                                    {/* Translate button */}
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#001f4d]/5 to-[#003f87]/5 border border-[#003f87]/10">
                                        <div>
                                            <p className="text-sm font-semibold text-[#003f87]">
                                                Gunakan AI untuk menerjemahkan
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                Terjemahkan otomatis dari konten Indonesia ke English
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => void handleTranslate()}
                                            disabled={translateJob.isPolling}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#001f4d] to-[#003f87] text-white text-sm font-semibold hover:from-[#002a6b] hover:to-[#0050b0] transition-all shadow-md shadow-[#003f87]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
                                        >
                                            {translateJob.isPolling ? (
                                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            )}
                                            ✦ Terjemahkan dengan AI
                                        </button>
                                    </div>

                                    <Input
                                        label="Article Title (EN)"
                                        placeholder="Enter article title..."
                                        value={data.title_en ?? ''}
                                        onChange={(e) => setData('title_en', e.target.value)}
                                        error={errors.title_en}
                                        className="text-lg font-medium"
                                    />

                                    <Textarea
                                        label="Excerpt (EN)"
                                        placeholder="Short summary of the article (shown in news listing)..."
                                        rows={3}
                                        value={data.excerpt_en ?? ''}
                                        onChange={(e) => setData('excerpt_en', e.target.value)}
                                        error={errors.excerpt_en}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Content (EN)
                                        </label>
                                        <TipTapEditor
                                            value={data.content_en ?? ''}
                                            onChange={(html) => setData('content_en', html)}
                                            placeholder="Start writing the article content here..."
                                            error={errors.content_en}
                                            onEditorReady={setEditorId}
                                        />
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    Sidebar (35%)
                   ══════════════════════════════════════ */}
                <div className="w-full lg:w-[35%] flex flex-col gap-6">

                    {/* Publikasi */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Publikasi
                        </h3>

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
                        <div className="border-b border-neutral-100 pb-3">
                            <h3 className="text-lg font-semibold text-neutral-900">Kategori</h3>
                        </div>

                        <Select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            options={[
                                { value: '', label: 'Pilih Kategori...' },
                                ...categories.map((c) => ({
                                    value: c.id.toString(),
                                    label: c.name,
                                })),
                            ]}
                            error={errors.category_id}
                            required
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                            Thumbnail
                        </h3>

                        <ImageUpload
                            value={article?.thumbnail_url ?? undefined}
                            onChange={(file) => setData('thumbnail', file)}
                            error={errors.thumbnail}
                        />
                        <p className="text-xs text-neutral-500 -mt-2">
                            Rasio 16:9 direkomendasikan. Maks 2MB.
                        </p>
                    </div>

                    {/* SEO Panel — with AI analysis */}
                    <div id="seo-panel">
                        <SeoPanel
                            metaTitle={data.meta_title}
                            metaDescription={data.meta_description}
                            onMetaTitleChange={(val) => setData('meta_title', val)}
                            onMetaDescriptionChange={(val) => setData('meta_description', val)}
                            errors={{
                                meta_title: errors.meta_title,
                                meta_description: errors.meta_description,
                            }}
                            onAnalyze={() => void handleSeoAnalyze()}
                            isAnalyzing={seoJob.isPolling}
                            jobStatus={seoJob.isPolling ? 'processing' : seoJob.status}
                            analysisResult={seoResult}
                            jobError={seoJob.error}
                        />
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}

/* ─────────────────────────────────────────────
   Tab Button
   ───────────────────────────────────────────── */
interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
}

function TabButton({ active, onClick, label }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                    ? 'bg-[#003f87] text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
        >
            {label}
        </button>
    );
}
